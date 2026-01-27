const express = require('express');

const cors = require('cors');

// Importa o robô que criamos
const roboDolar = require('./robo-dolar');

// Importa a conexão com o banco
const pool = require('./database');

const app = express();
const PORT = 4000;

app.use(cors());

// GET
app.get('/api/cotacao', async (req, res) => {
    console.log(' Recebi um pedido de cotação via API...');
    try{
        // Chama o robô e espera ele trabalhar
        const valor = await roboDolar();

        if (valor) {
            // Salva no banco de dados
            //  o $1 é um placeholder de segurança (evita SQL Injection)
            const query = 'INSERT INTO historico_dolar (valor) VALUES ($1) RETURNING *';
            const resultadoDB = await pool.query (query, [valor]);

            console.log("🔍 O BANCO DEVOLVEU ISSO AQUI:", resultadoDB.rows[0]);
            console.log("Dado salvo no banco com ID:", resultadoDB.rows[0].id);

            //  Sucesso! Devolvemos o JSON
            return res.json({
                mensagem: "Sucesso!",
                dados: {
                    valor: valor,
                    id_banco: resultadoDB.rows[0].id || resultadoDB.rows[0].ID,
                    data_gravacao: resultadoDB.rows[0].data_consulta
                }
            });
        } else {
            //  Se o robô não achar nada (mas não der erro)
            return res.status(404).json({erro: "Valor não encontrado."})
        }
    } catch (error) {
        // Erro: O robõ quebrou ou o site caiu
        console.error("Erro no servidor:", error);
        return res.status(500).json({erro: "Erro interno ao buscar cotação."});
    }
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`API rodando na porta ${PORT}`);
})