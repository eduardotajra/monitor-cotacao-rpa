const puppeteer = require('puppeteer');

async function roboDolar() {
  console.log('Iniciando robô (Alvo: DolarHoje.com)...');

//   Abrir o navegador
  const browser = await puppeteer.launch({ 
    headless: true, 
    args: ['--no-sandbox'] 
  });

//   Abrir uma nova página
  const page = await browser.newPage();

  try {
    // Vai direto na fonte especializada
    await page.goto('https://dolarhoje.com/');

    // Espera o campo onde fica o valor carregar
    // O ID desse campo no site é "nacional"
    await page.waitForSelector('#nacional');

    // 3. Extrai o VALOR do input (diferente de pegar texto de uma div)
    const valorDolar = await page.$eval('#nacional', (elemento) => elemento.value);

    console.log(`Dólar encontrado: R$ ${valorDolar}`);
    
    return valorDolar; // Retornamos o valor para usar depois
    
  } catch (erro) {
    console.error("Erro ao buscar dados:", erro.message);
  } finally {
    await browser.close();
  }
}

// Se rodar o arquivo direto, executa a função
if (require.main === module) {
    roboDolar();
}

module.exports = roboDolar; // Exportamos para usar no servidor depois