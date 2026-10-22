
import { useEffect, useState } from "react";
import axios from "axios";

// Layout padrão utilizado nas páginas do EvolutionFit.
import Layout from "../../components/Layout/Layout";

// Componentes da biblioteca Recharts para criar gráficos.
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

// Ícones utilizados nos cards de evolução.
import {
    TrendingUp,
    Dumbbell,
    Weight,
    Activity
} from "lucide-react";

export default function MinhaEvolucao() {

    // Armazena o histórico das cargas registradas pelo aluno.
    const [historico, setHistorico] = useState([]);

    // Armazena as avaliações físicas do aluno.
    const [avaliacoes, setAvaliacoes] = useState([]);

    // Controla a mensagem de carregamento da página.
    const [carregando, setCarregando] = useState(true);

    // Executa a busca dos dados quando o componente é montado.
    useEffect(() => {

        // Função assíncrona responsável por buscar os dados.
        async function carregarEvolucao() {
            try {

                // Recupera o ID do usuário salvo no navegador.
                const usuarioId =
                    localStorage.getItem("userId");

                // Impede a busca se o usuário não estiver identificado.
                if (!usuarioId) {
                    alert(
                        "Usuário não identificado. Faça login novamente."
                    );
                    return;
                }

                // Realiza as duas requisições HTTP em paralelo.
                // A primeira busca o histórico de cargas.
                // A segunda busca as avaliações físicas.
                const [
                    historicoResponse,
                    avaliacoesResponse
                ] = await Promise.all([
                    axios.get(
                        `http://localhost:5000/historico-cargas/usuario/${usuarioId}`
                    ),
                    axios.get(
                        `http://localhost:5000/avaliacao/usuario/${usuarioId}`
                    )
                ]);

                // Garante que o histórico recebido seja um array.
                const historicoRecebido =
                    Array.isArray(historicoResponse.data)
                        ? historicoResponse.data
                        : [];

                // Garante que as avaliações recebidas sejam um array.
                const avaliacoesRecebidas =
                    Array.isArray(avaliacoesResponse.data)
                        ? avaliacoesResponse.data
                        : [];

                // =========================================
                // FORMATAÇÃO DO HISTÓRICO DE CARGAS
                // =========================================

                const historicoFormatado =
                    historicoRecebido

                        // Cria um novo array com os dados formatados.
                        .map((item) => ({
                            id: item.id,

                            // Converte o peso para número.
                            peso: Number(item.peso),

                            // Guarda a data original para ordenação.
                            dataOriginal: item.data_inicial,

                            // Formata a data no padrão brasileiro.
                            data:
                                new Date(
                                    item.data_inicial
                                ).toLocaleDateString("pt-BR"),

                            treinoExercicioId:
                                item.treino_exercicios_id
                        }))

                        // Organiza os registros do mais antigo
                        // para o mais recente.
                        .sort(
                            (a, b) =>
                                new Date(a.dataOriginal) -
                                new Date(b.dataOriginal)
                        );

                // =========================================
                // FORMATAÇÃO DAS AVALIAÇÕES FÍSICAS
                // =========================================

                const avaliacoesFormatadas =
                    avaliacoesRecebidas
                        .map((item) => ({
                            id: item.id,

                            // Converte peso e IMC para números.
                            peso: Number(item.peso),
                            imc: Number(item.imc),

                            dataOriginal: item.data_avaliacao,

                            // Acrescenta horário à data e
                            // formata para o padrão brasileiro.
                            data:
                                new Date(
                                    `${item.data_avaliacao}T00:00:00`
                                ).toLocaleDateString("pt-BR")
                        }))

                        // Ordena as avaliações por data crescente.
                        .sort(
                            (a, b) =>
                                new Date(
                                    `${a.dataOriginal}T00:00:00`
                                ) -
                                new Date(
                                    `${b.dataOriginal}T00:00:00`
                                )
                        );

                // Atualiza os estados com os dados formatados.
                // O React renderiza a interface com esses dados.
                setHistorico(historicoFormatado);
                setAvaliacoes(avaliacoesFormatadas);

            } catch (error) {

                // Registra o erro no console para depuração.
                console.error(
                    "Erro ao carregar evolução:",
                    error
                );

                // Se o servidor respondeu com um erro HTTP.
                if (error.response) {
                    alert(
                        error.response.data.message ||
                        "Erro ao carregar evolução!"
                    );
                } else {

                    // Se não houve resposta do servidor.
                    alert(
                        "Não foi possível conectar ao servidor."
                    );
                }

            } finally {

                // Finaliza o estado de carregamento,
                // mesmo quando ocorre um erro.
                setCarregando(false);
            }
        }

        // Chama a função que busca os dados.
        carregarEvolucao();

        // Array vazio: efeito associado à montagem do componente.
    }, []);

    // =========================================
    // TELA DE CARREGAMENTO
    // =========================================

    // Enquanto os dados estão sendo carregados,
    // apresenta uma mensagem em vez da página completa.
    if (carregando) {
        return (
            <Layout>
                <p className="text-gray-500">
                    Carregando evolução...
                </p>
            </Layout>
        );
    }

    // =========================================
    // CÁLCULOS PARA OS CARDS
    // =========================================

    // Calcula a maior carga registrada.
    // map() extrai os pesos do histórico.
    // ... espalha os valores como argumentos de Math.max().
    const maiorCarga =
        historico.length > 0
            ? Math.max(
                ...historico.map(
                    (item) => item.peso
                )
            )
            : 0;

    // Obtém a última carga registrada.
    // Como o histórico está ordenado por data,
    // o último elemento é o mais recente.
    const ultimaCarga =
        historico.length > 0
            ? historico[
                historico.length - 1
            ].peso
            : 0;

    // Obtém a avaliação física mais recente.
    // Se não existir avaliação, utiliza null.
    const ultimaAvaliacao =
        avaliacoes.length > 0
            ? avaliacoes[
                avaliacoes.length - 1
            ]
            : null;

    // =========================================
    // INTERFACE DA PÁGINA
    // =========================================

    return (
        <Layout>
            <div>

                {/* TÍTULO E DESCRIÇÃO DA PÁGINA */}
                <h1 className="mb-2 text-4xl font-bold">
                    Minha Evolução
                </h1>

                <p className="mb-8 text-gray-500">
                    Acompanhe sua evolução nos treinos e avaliações físicas.
                </p>

                {/* =====================================
                    CARDS DE RESUMO
                    ===================================== */}

                {/* Grid responsivo:
                    1 coluna em telas pequenas,
                    2 em telas médias e
                    4 em telas maiores. */}
                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

                    {/* CARD: MAIOR CARGA */}
                    <div className="rounded-2xl bg-white p-6 shadow-md">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="rounded-xl bg-purple-100 p-3 text-purple-700">
                                <Dumbbell size={24} />
                            </div>

                            <h2 className="font-semibold">
                                Maior Carga
                            </h2>
                        </div>

                        {/* Mostra a maior carga ou
                            "Sem registro" se não houver valor positivo. */}
                        <p className="text-3xl font-bold">
                            {maiorCarga > 0
                                ? `${maiorCarga} kg`
                                : "Sem registro"}
                        </p>
                    </div>

                    {/* CARD: ÚLTIMA CARGA */}
                    <div className="rounded-2xl bg-white p-6 shadow-md">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="rounded-xl bg-green-100 p-3 text-green-700">
                                <TrendingUp size={24} />
                            </div>

                            <h2 className="font-semibold">
                                Última Carga
                            </h2>
                        </div>

                        <p className="text-3xl font-bold">
                            {ultimaCarga > 0
                                ? `${ultimaCarga} kg`
                                : "Sem registro"}
                        </p>
                    </div>

                    {/* CARD: PESO ATUAL */}
                    <div className="rounded-2xl bg-white p-6 shadow-md">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
                                <Weight size={24} />
                            </div>

                            <h2 className="font-semibold">
                                Peso Atual
                            </h2>
                        </div>

                        {/* Usa o peso da avaliação mais recente. */}
                        <p className="text-3xl font-bold">
                            {ultimaAvaliacao
                                ? `${ultimaAvaliacao.peso} kg`
                                : "Sem avaliação"}
                        </p>
                    </div>

                    {/* CARD: IMC ATUAL */}
                    <div className="rounded-2xl bg-white p-6 shadow-md">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="rounded-xl bg-orange-100 p-3 text-orange-700">
                                <Activity size={24} />
                            </div>

                            <h2 className="font-semibold">
                                IMC Atual
                            </h2>
                        </div>

                        {/* toFixed(2) mostra o IMC
                            com duas casas decimais. */}
                        <p className="text-3xl font-bold">
                            {ultimaAvaliacao
                                ? ultimaAvaliacao.imc.toFixed(2)
                                : "Sem avaliação"}
                        </p>
                    </div>
                </div>

                {/* =====================================
                    GRÁFICO DE EVOLUÇÃO DAS CARGAS
                    ===================================== */}

                <div className="mb-8 rounded-2xl bg-white p-6 shadow-md">
                    <h2 className="mb-2 text-2xl font-bold">
                        Evolução das Cargas
                    </h2>

                    <p className="mb-6 text-sm text-gray-500">
                        Histórico das cargas registradas durante os treinos.
                    </p>

                    {/* Se não houver histórico, mostra mensagem.
                        Caso contrário, mostra o gráfico. */}
                    {historico.length === 0 ? (
                        <p className="text-gray-500">
                            Você ainda não possui cargas registradas.
                        </p>
                    ) : (
                        <div className="h-80">

                            {/* Ajusta o gráfico ao tamanho disponível. */}
                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >

                                {/* Recebe o array de cargas. */}
                                <LineChart data={historico}>

                                    {/* Desenha a grade tracejada. */}
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                    />

                                    {/* Eixo horizontal: datas. */}
                                    <XAxis dataKey="data" />

                                    {/* Eixo vertical: valores em kg. */}
                                    <YAxis unit=" kg" />

                                    {/* Exibe detalhes ao passar o mouse. */}
                                    <Tooltip />

                                    {/* Desenha a linha das cargas.
                                        dataKey="peso" indica os valores.
                                        stroke define a cor da linha. */}
                                    <Line
                                        type="monotone"
                                        dataKey="peso"
                                        name="Carga"
                                        stroke="#7e22ce"
                                        strokeWidth={3}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                {/* =====================================
                    GRÁFICO DE EVOLUÇÃO DO PESO
                    ===================================== */}

                <div className="mb-8 rounded-2xl bg-white p-6 shadow-md">
                    <h2 className="mb-2 text-2xl font-bold">
                        Evolução do Peso
                    </h2>

                    <p className="mb-6 text-sm text-gray-500">
                        Alterações do peso registradas nas avaliações físicas.
                    </p>

                    {/* Só apresenta o gráfico se houver avaliações. */}
                    {avaliacoes.length === 0 ? (
                        <p className="text-gray-500">
                            Você ainda não possui avaliações físicas.
                        </p>
                    ) : (
                        <div className="h-80">
                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >
                                {/* Usa os dados das avaliações físicas. */}
                                <LineChart data={avaliacoes}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                    />

                                    {/* Datas das avaliações. */}
                                    <XAxis dataKey="data" />

                                    {/* Limites do eixo calculados
                                        automaticamente pelo Recharts. */}
                                    <YAxis
                                        unit=" kg"
                                        domain={["auto", "auto"]}
                                    />

                                    <Tooltip />

                                    {/* Linha azul representando o peso. */}
                                    <Line
                                        type="monotone"
                                        dataKey="peso"
                                        name="Peso"
                                        stroke="#2563eb"
                                        strokeWidth={3}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                {/* =====================================
                    GRÁFICO DE EVOLUÇÃO DO IMC
                    ===================================== */}

                <div className="mb-8 rounded-2xl bg-white p-6 shadow-md">
                    <h2 className="mb-2 text-2xl font-bold">
                        Evolução do IMC
                    </h2>

                    <p className="mb-6 text-sm text-gray-500">
                        Histórico do IMC calculado nas avaliações físicas.
                    </p>

                    {/* Sem avaliações, mostra uma mensagem. */}
                    {avaliacoes.length === 0 ? (
                        <p className="text-gray-500">
                            Você ainda não possui avaliações físicas.
                        </p>
                    ) : (
                        <div className="h-80">
                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >
                                <LineChart data={avaliacoes}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                    />

                                    {/* Eixo horizontal com datas. */}
                                    <XAxis dataKey="data" />

                                    {/* Eixo vertical ajustado aos dados. */}
                                    <YAxis
                                        domain={["auto", "auto"]}
                                    />

                                    <Tooltip />

                                    {/* Utiliza a propriedade imc
                                        dos objetos de avaliação. */}
                                    <Line
                                        type="monotone"
                                        dataKey="imc"
                                        name="IMC"
                                        stroke="#ea580c"
                                        strokeWidth={3}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                {/* =====================================
                    LISTA DO HISTÓRICO DE CARGAS
                    ===================================== */}

                <div className="rounded-2xl bg-white p-6 shadow-md">
                    <h2 className="mb-5 text-2xl font-bold">
                        Histórico de Cargas
                    </h2>

                    {/* Se não houver registros, mostra mensagem. */}
                    {historico.length === 0 ? (
                        <p className="text-gray-500">
                            Nenhum histórico disponível.
                        </p>
                    ) : (
                        <div className="space-y-3">

                            {/* slice() cria uma cópia do array.
                                reverse() inverte a ordem para
                                mostrar os registros mais recentes.
                                map() cria um elemento visual
                                para cada carga registrada. */}
                            {historico
                                .slice()
                                .reverse()
                                .map((item) => (
                                    <div
                                        // Identifica cada item da lista.
                                        key={item.id}
                                        className="flex items-center justify-between rounded-xl border border-gray-200 p-4"
                                    >
                                        <div>
                                            <p className="font-semibold">
                                                Carga registrada
                                            </p>

                                            {/* Data formatada do registro. */}
                                            <p className="text-sm text-gray-500">
                                                {item.data}
                                            </p>
                                        </div>

                                        {/* Peso registrado em quilogramas. */}
                                        <span className="text-lg font-bold text-purple-700">
                                            {item.peso} kg
                                        </span>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
