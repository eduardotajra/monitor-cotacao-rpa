# Monitor de Cotação

RPA que extrai a cotação do dólar por automação de navegador, guarda o histórico em banco e serve os dados por API para um front-end em Next.js.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express_5-000000?style=flat-square&logo=express&logoColor=white)
![Puppeteer](https://img.shields.io/badge/Puppeteer-40B5A4?style=flat-square&logo=puppeteer&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma_6-2D3748?style=flat-square&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)

> 📸 *Screenshot pendente. Veja [Como capturar](#como-capturar-o-screenshot) no fim deste arquivo.*

## O problema

Cotação de moeda não tem API pública gratuita e confiável para todo mundo. A saída comum é abrir o site, olhar o número e anotar numa planilha, todo dia, na mão.

Este projeto troca essa rotina por um robô: ele abre o navegador sozinho, lê o valor na fonte, grava no banco com data e hora, e devolve tudo por uma API.

## Como funciona

```
Front-end (Next.js)          pede a cotação
        ↓
Servidor (Express)           recebe e aciona o robô
        ↓
Robô (Puppeteer)             abre o navegador headless, navega até a fonte,
                             espera o seletor carregar e extrai o valor
        ↓
Prisma → PostgreSQL          grava o valor com timestamp
        ↓
Servidor                     devolve JSON limpo para o front
```

## Funcionalidades
**:** Puppeteer em modo headless, com espera explícita pelo seletor antes de ler o valor (evita ler a página antes da hora)
**:** cada consulta vira uma linha em `historico_dolar`, com data e hora automáticas
**:** `GET /api/cotacao` dispara o robô e devolve o valor já salvo
**:** Prisma cuida do schema e das queries
**:** `Dockerfile` no back-end, com as flags necessárias para rodar o Chromium do Puppeteer dentro do container

## Stack
**:** Node.js, Express 5, Puppeteer 24, Prisma 6, PostgreSQL, CORS, dotenv
**:** Next.js (App Router), React, TypeScript, Tailwind CSS
**:** Docker

## Estrutura

```
backend/
  robo-dolar.js        o robô: abre o navegador, extrai o valor, fecha
  server.js            API Express, orquestra robô + persistência
  database.js          pool de conexão com o PostgreSQL
  prisma/schema.prisma modelo HistoricoDolar
  Dockerfile
frontend/
  app/page.tsx         interface que consome a API
```

## Rodando localmente

Requisitos: **Node.js 18+**, **PostgreSQL** e **Docker** (opcional).

Os comandos abaixo estão no formato do **PowerShell no Windows**.

### 1. Clonar

```powershell
git clone https://github.com/eduardotajra/monitor-cotacao-rpa.git
cd monitor-cotacao-rpa
```

### 2. Back-end

```powershell
cd backend
npm install
```

Crie o arquivo `.env` com a URL do seu banco:

```
DATABASE_URL="postgresql://USUARIO:SENHA@localhost:5432/monitor_cotacao"
```

Aplique o schema e suba o servidor:

```powershell
npx prisma migrate dev --name init
node server.js
```

O servidor sobe em `http://localhost:4000`.

> ℹ️ Na primeira execução, o Puppeteer baixa uma cópia do Chromium (~150 MB). É esperado que demore.

### 3. Front-end

Em **outro terminal**:

```powershell
cd frontend
npm install
npm run dev
```

Abra `http://localhost:3000`.

### Testando só o robô

```powershell
cd backend
node robo-dolar.js
```

Ele imprime o valor encontrado no console, sem tocar no banco.

## Decisões técnicas

**Por que Puppeteer e não uma API de câmbio?**
O objetivo do projeto era justamente exercitar RPA, automatizar uma interação que hoje é feita por uma pessoa num navegador. Se existisse uma API boa, o projeto não teria razão de existir.

**Por que `waitForSelector` antes de ler?**
A primeira versão lia a página assim que carregava e às vezes vinha vazia. O valor entra no DOM depois do load inicial. Esperar o seletor específico resolveu de forma determinística, bem melhor que um `sleep` fixo, que ou é lento demais ou curto demais.

**Por que `$eval` com `.value` e não pegar o texto?**
O valor no site fica dentro de um `<input>`, não de uma `<div>`. Ler `textContent` retorna string vazia. Foi um erro que custou um tempo até eu inspecionar o elemento e entender a diferença.

**Por que Prisma?**
Comecei com `INSERT INTO` escrito à mão via `pg`. Trocar por Prisma eliminou o SQL manual, deu tipagem no retorno das queries e passou a versionar o schema via migrations, que era o ponto que eu queria aprender.

**Por que o robô roda por requisição, e não num agendador?**
Decisão consciente de escopo. Um `cron` que coleta de hora em hora seria mais útil na prática, e é a evolução natural. Como exercício, disparar sob demanda deixa o fluxo inteiro visível numa requisição só.

**Por que `--no-sandbox`?**
Necessário para o Chromium rodar dentro do container. Em produção real, o certo seria configurar o sandbox adequadamente em vez de desligá-lo.

## Limitações conhecidas

- O robô depende do seletor `#nacional` da página de origem. Se o site mudar o HTML, quebra. É fragilidade inerente a scraping.
- `valor` é gravado como `String`, não como tipo numérico. Funciona, mas impede agregação no banco.
- Sem testes automatizados.
- Sem deploy público, porque o Puppeteer exige um ambiente com Chromium disponível, o que não cabe no plano gratuito da maioria dos serviços serverless.

## Como capturar o screenshot

1. Suba back-end e front-end conforme as instruções acima
2. Abra `http://localhost:3000` e faça uma consulta
3. `Win + Shift + S` para recortar a tela
4. Salve como `docs/screenshot.png` no repositório
5. Troque o aviso do topo por `![Interface](docs/screenshot.png)`

---

Feito por [Eduardo Tajra](https://github.com/eduardotajra) · [Portfólio](https://eduardotajra.vercel.app) · [LinkedIn](https://www.linkedin.com/in/eduardo-tajra)
