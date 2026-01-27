# Usa uma imagem oficial do Node com Chrome instalado (necessário pro Puppeteer)
FROM ghcr.io/puppeteer/puppeteer:latest

# Define a pasta de trabalho
WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o resto do código
COPY . .

# Expõe a porta
EXPOSE 4000

# Comando para rodar
CMD ["node", "server.js"]