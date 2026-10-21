// Importa o layout padrão do EvolutionFit
import Layout from "../../components/Layout/Layout";

// Componentes reutilizáveis utilizados no Dashboard
import Card from "../../components/Card/Card";
import TreinoHoje from "../../components/TreinoHoje/TreinoHoje";
import GraficoEvolucao from "../../components/GraficoEvolucao/GraficoEvolucao";

// Hooks do React para controlar estados e efeitos
import { useEffect, useState } from "react";

// Biblioteca utilizada para realizar requisições HTTP
import axios from "axios";

// Ícones utilizados nos cards
import {
    Activity,
    Target,
    Dumbbell,
    Trophy
} from "lucide-react";

// Componente responsável por apresentar o Dashboard do aluno
export default function Dashboard() {

    // Armazena os dados recebidos do backend
    // Começa como null porque os dados ainda não foram carregados
    const [dashboard, setDashboard] =
        useState(null);

    // Controla se os dados estão sendo carregados
    const [carregando, setCarregando] =
        useState(true);

    // Executa automaticamente quando o componente é montado
    useEffect(() => {

        // Função assíncrona que busca os dados do Dashboard
        async function carregarDashboard() {

            try {

                // Recupera o ID do usuário armazenado no navegador
                const usuarioId =
                    localStorage.getItem("userId");

                // Verifica se o ID do usuário está disponível
                if (!usuarioId) {

                    alert(
                        "Usuário não identificado. Faça login novamente."
                    );

                    // Interrompe a função caso não exista um ID
                    return;
                }

                // Realiza uma requisição GET ao backend
                // O ID do usuário é inserido na URL
                const response =
                    await axios.get(
                        `http://localhost:5000/dashboard/${usuarioId}`
                    );

                // Atualiza o estado com os dados recebidos
                setDashboard(
                    response.data
                );

            } catch (error) {

                // Registra o erro no console
                console.error(error);

                // Verifica se o backend retornou uma resposta de erro
                if (error.response) {

                    alert(
                        error.response.data.message ||
                        "Erro ao carregar dashboard!"
                    );

                } else {

                    // Exibe mensagem quando não há resposta do servidor
                    alert(
                        "Não foi possível conectar ao servidor."
                    );
                }

            } finally {

                // Finaliza o carregamento mesmo se ocorrer um erro
                setCarregando(false);
            }
        }

        // Chama a função responsável por buscar os dados
        carregarDashboard();

    }, []);

    // =========================================
    // TELA DE CARREGAMENTO
    // =========================================

    // Enquanto os dados estão sendo buscados,
    // apresenta uma mensagem de carregamento
    if (carregando) {

        return (

            <Layout>

                <p className="text-gray-500">
                    Carregando dashboard...
                </p>

            </Layout>
        );
    }

    // =========================================
    // ERRO AO CARREGAR
    // =========================================

    // Se o carregamento terminou e o estado continua
    // sem dados, apresenta uma mensagem ao usuário
    if (!dashboard) {

        return (

            <Layout>

                <p className="text-gray-500">
                    Não foi possível carregar o dashboard.
                </p>

            </Layout>
        );
    }

    // =========================================
    // DADOS DO DASHBOARD
    // =========================================

    // Desestrutura o objeto dashboard para acessar
    // suas informações de maneira mais simples
    const {
        usuario,
        treino_hoje,
        estatisticas,
        evolucao_carga
    } = dashboard;

    // Verifica se o IMC está disponível
    // O operador ?. permite acessar propriedades com segurança
    // Number() converte o valor em número
    // toFixed(2) formata o IMC com duas casas decimais
    const imc =
        usuario?.imc !== null &&
        usuario?.imc !== undefined
            ? Number(
                usuario.imc
            ).toFixed(2)
            : "Não informado";

    // Verifica se existe uma maior carga registrada
    // Utiliza template literal para acrescentar "kg" ao valor
    const maiorCarga =
        estatisticas?.maior_carga !== null &&
        estatisticas?.maior_carga !== undefined
            ? `${estatisticas.maior_carga} kg`
            : "Sem registro";

    // Verifica se os dados de evolução estão em formato de array
    // Caso contrário, utiliza um array vazio
    const dadosEvolucao =
        Array.isArray(evolucao_carga)
            ? evolucao_carga
            : [];

    // =========================================
    // INTERFACE DO DASHBOARD
    // =========================================

    return (

        <Layout>

            <div>

                {/* CABEÇALHO */}

                <h1 className="mb-2 text-4xl font-bold">
                    Dashboard
                </h1>

                {/* Exibe o nome do aluno ou um texto alternativo */}
                <p className="mb-8 text-gray-500">

                    Bem-vindo ao EvolutionFit,{" "}

                    {usuario?.nome || "Aluno"}!

                </p>

                {/* CARDS DE INFORMAÇÕES */}

                {/* Grid responsivo:
                    1 coluna em telas pequenas,
                    2 colunas em telas médias,
                    4 colunas em telas grandes
                */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

                    {/* CARD DO IMC */}

                    {/* Envia título, valor, ícone e cor como props */}
                    <Card
                        titulo="IMC"
                        valor={imc}
                        icone={
                            <Activity size={28} />
                        }
                        cor="bg-blue-500"
                    />

                    {/* CARD DO OBJETIVO */}

                    {/* Mostra o objetivo do aluno ou "Não informado" */}
                    <Card
                        titulo="Objetivo"
                        valor={
                            usuario?.objetivo ||
                            "Não informado"
                        }
                        icone={
                            <Target size={28} />
                        }
                        cor="bg-green-500"
                    />

                    {/* CARD DE TREINOS CONCLUÍDOS */}

                    {/* O operador ?? utiliza 0 quando
                        o valor é null ou undefined
                    */}
                    <Card
                        titulo="Treinos Concluídos"
                        valor={
                            estatisticas
                                ?.treinos_concluidos ??
                            0
                        }
                        icone={
                            <Dumbbell size={28} />
                        }
                        cor="bg-purple-600"
                    />

                    {/* CARD DA MAIOR CARGA */}

                    {/* Mostra a maior carga registrada pelo aluno */}
                    <Card
                        titulo="Maior Carga"
                        valor={maiorCarga}
                        icone={
                            <Trophy size={28} />
                        }
                        cor="bg-orange-500"
                    />

                </div>

                {/* ÁREA DO TREINO E DO GRÁFICO */}

                {/* Organiza os componentes de forma responsiva */}
                <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">

                    {/* TREINO DE HOJE */}

                    {/* Envia os dados do treino do dia
                        para o componente TreinoHoje
                    */}
                    <TreinoHoje
                        treino={
                            treino_hoje
                        }
                    />

                    {/* GRÁFICO DE EVOLUÇÃO */}

                    <div className="rounded-2xl bg-white p-6 shadow-md">

                        <h2 className="mb-4 text-2xl font-bold">
                            Evolução de Carga
                        </h2>

                        {/* Envia os dados de evolução
                            para o componente do gráfico
                        */}
                        <GraficoEvolucao
                            dados={
                                dadosEvolucao
                            }
                        />

                    </div>

                </div>

            </div>

        </Layout>
    );
}