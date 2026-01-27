require('dotenv').config();
const {Pool} = require('pg');

// Configuração da conexão
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'cotacoes_db',
    password: process.env.DB_PASSWORD,
    port: 5432,
});

// Teste de conexão
async function testarConexao() {
    try { 
        const client = await pool.connect();
        console.log("Conectado ao PostgreSQL com sucesso!");

        // Vamos criar a tabela se ela não existir (SQL Puro)
        const queryCriarTabela = `
            CREATE TABLE IF NOT EXISTS historico_dolar (
            id SERIAL PRIMARY KEY,
            valor VARCHAR(50),
            data_consulta TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

        await client.query(queryCriarTabela);
        console.log("Tabela 'historico_dolar' verificada/criada.");

        client.release();
    } catch(err){
        console.error("Erro ao conectar no banco:", err.message);
    }
}

testarConexao();

// Exportamos o pool para usar em outros arquivos
module.exports = pool;