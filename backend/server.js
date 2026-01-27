const express = require('express');

const cors = require('cors');

// Importa o robô que criamos
const roboDolar = require('./robo-dolar');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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
            // --- A MÁGICA DO ORM ACONTECE AQUI ---
            // Antes: "INSERT INTO historico_dolar..."
            // Agora: Método JavaScript intuitivo
            const resultadoDB = await prisma.historicoDolar.create({
                data: {
                    valor: valor
                    // dataConsulta e id são preenchidos sozinhos
                }
            });

            console.log("Salvo via Prisma:", resultadoDB);

            //  Sucesso! Devolvemos o JSON
            return res.json({
                dados: {
                    valor: resultadoDB.valor, 
                    id_banco: resultadoDB.id,
                    data_gravacao: resultadoDB.dataConsulta
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
    console.log(`API com prisma rodando na porta ${PORT}`);
})