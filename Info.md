# Conceito de Arquitetura

- Cliente (FrontEnd): Pede o preço
- Servidor (Express): Recebe o pedido e 'acorda' o robô. (server.js)
- Robô (Puppeteer): Vai no site, pega o dado e devolve pro servidor. (robo-dolar.js)
- Servidor: Entrega o dado limpo (JSON) para o cliente.

# CSR vs SSR vs SSG

- CSR:

  - A página carrega vazia e o navegador do usuário faz um fetch para buscar o dado. A carga de processamento fica no navegador do cliente.
- SSR

  - O Next.js busca o dado no servidor **antes** de mandar o HTML para o usuário. O usuário já recebe a página com o preço "pintado"
- SSG

  - O Next.js roda o robô na hora do "Build". O preço ficaria congelado naquele valor para sempre, até o próximo deploy.

# Hooks

- useState: é a **memória** do componente.
  - O React não monitora variáveis comuns. Se eu usasse let valor = 10, a tela não mudaria. O useState avisa o React: 'Ei, o valor mudou, redesenhe a tela!."
- useEffect:
  - Conceito: Efeitos colaterais. "Faça algo quando a página nascer".
  - Exemplo: Se você quisesse que a cotação carregasse sozinha ao abrir a página (sem clicar no botão), você faria:
    ```javascript
    import { useEffect } from 'react';
    // ... dentro do componente
    useEffect(() => {
        atualizarCotacao(); // Chama a função automaticamente ao nascer
    }, []); // Array vazio = "Execute apenas uma vez"
    ```

# API REST e Verbos HTTP

- GET: Usado para buscar dados
- POST: Usado para criar algo

  - Exemplo: Se você tivesse um formulário para cadastrar um novo site para o robô ler
- PUT/PATCH: Atualizar dados
- DELETE: Apagar dados
- Status Codes:

  - 200: Tudo certo!
  - 404: Not Found.
  - 500: Internal Server Error

# Middleware

- CORS
- Explicação: Middleware é tudo que fica entre o pedido do usuário e a sua resposta. O cors() é uma segurança que parou a requisição, olhou o crachá e disse "Pode passar". Outro exemplo seria um middleware de auth que verifica se o usuário está logado.
- Tudo que fica entre o PEDIDO e a RESPOSTA.

# Async/Await

- Node.js é Single Thread
  - Explicação: Se eu não usasse await no Pupppeteer, o Node ia disparar o robô e, antes do robô terminar, já ia tentar responder o frontend com undefined. O await diz: "Node, pausa essa função aqui, vai atender outros clientes, e volta aqui só quando o robô terminar".
