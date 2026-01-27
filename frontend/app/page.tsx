'use client';

import {useState, useEffect} from 'react';

export default function Home(){
  const [valor, setValor] = useState('---');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('Aguardando...');

  interface RespostaAPI{
    mensagem: string;
    dados: {
        valor: string;
        id_banco: number;
        data_gravacao: string;
    }
}

  useEffect(() => {
    atualizarCotacao();
  }, []);

  async function atualizarCotacao(){
    setLoading(true);
    setStatus('Chamando robô...');

    try{
      // Chama a minha api na porta 4000
      const response = await fetch('http://localhost:4000/api/cotacao');
      const data: RespostaAPI = await response.json();

      // Atualiza a tela com o valor vindo do banco/robô
      setValor(data.dados.valor);
      setStatus(`Salvo no Banco (ID: ${data.dados.id_banco})`);
    } catch(error){
      console.error(error);
      setStatus('Erro ao conectar API');
    } finally {
      setLoading(false);
    }
  }
  
  return (
    // MAIN: Ocupa 100% da altura (min-h-screen) e centraliza tudo (flex-col, items-center, justify-center)
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-950 text-white p-4">
      
      {/* CABEÇALHO: Limpo e centralizado */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-500">
          Monitor de Cotação
        </h1>
      </div>

      {/* CARD DO PREÇO: Com borda e sombra para destacar */}
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl text-center">
        
        <p className="text-gray-400 text-sm font-medium uppercase mb-2">Dólar Comercial</p>
        
        <div className="my-6">
          <span className="text-5xl md:text-6xl font-extrabold text-white tracking-tight">
            R$ {valor}
          </span>
        </div>

        {/* STATUS: Com visual de terminal */}
        <div className="bg-black/50 rounded-md p-3 mb-6 font-mono text-xs text-green-400 border border-gray-800">
          {status}
        </div>

        <button
          onClick={atualizarCotacao}
          disabled={loading}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform active:scale-95 ${
            loading 
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              Processando...
            </span>
          ) : (
            'Atualizar Agora'
          )}
        </button>
      </div>
    </main>
  );
}