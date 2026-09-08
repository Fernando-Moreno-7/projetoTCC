import { useEffect, useState } from "react";
import axios from "axios";

import Layout from "../../components/Layout/Layout";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

import {
    TrendingUp,
    Dumbbell,
    Weight,
    Activity
} from "lucide-react";


export default function MinhaEvolucao() {

    const [historico, setHistorico] = useState([]);
    const [avaliacoes, setAvaliacoes] = useState([]);
    const [carregando, setCarregando] = useState(true);


    useEffect(() => {

        async function carregarEvolucao() {

            try {

                const usuarioId =
                    localStorage.getItem("userId");


                if (!usuarioId) {

                    alert(
                        "Usuário não identificado. Faça login novamente."
                    );

                    return;

                }


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


                const historicoFormatado =
                    historicoResponse.data.map(
                        (item) => ({

                            id: item.id,

                            peso:
                                Number(item.peso),

                            data:
                                new Date(
                                    item.data_inicial
                                ).toLocaleDateString(
                                    "pt-BR"
                                ),

                            treinoExercicioId:
                                item.treino_exercicios_id

                        })
                    );


                const avaliacoesFormatadas =
                    avaliacoesResponse.data.map(
                        (item) => ({

                            id: item.id,

                            peso:
                                Number(item.peso),

                            imc:
                                Number(item.imc),

                            data:
                                new Date(
                                    `${item.data_avaliacao}T00:00:00`
                                ).toLocaleDateString(
                                    "pt-BR"
                                )

                        })
                    );


                setHistorico(
                    historicoFormatado
                );

                setAvaliacoes(
                    avaliacoesFormatadas
                );


            } catch (error) {

                console.error(
                    "Erro ao carregar evolução:",
                    error
                );


                if (error.response) {

                    alert(
                        error.response.data.message ||
                        "Erro ao carregar evolução!"
                    );

                } else {

                    alert(
                        "Não foi possível conectar ao servidor."
                    );

                }


            } finally {

                setCarregando(false);

            }

        }


        carregarEvolucao();

    }, []);


    if (carregando) {

        return (

            <Layout>

                <p className="text-gray-500">
                    Carregando evolução...
                </p>

            </Layout>

        );

    }


    const maiorCarga =
        historico.length > 0
            ? Math.max(
                ...historico.map(
                    (item) => item.peso
                )
            )
            : 0;


    const ultimaCarga =
        historico.length > 0
            ? historico[
                historico.length - 1
            ].peso
            : 0;


    const ultimaAvaliacao =
        avaliacoes.length > 0
            ? avaliacoes[
                avaliacoes.length - 1
            ]
            : null;


    return (

        <Layout>

            <div>

                <h1 className="mb-2 text-4xl font-bold">
                    Minha Evolução
                </h1>

                <p className="mb-8 text-gray-500">
                    Acompanhe sua evolução nos treinos e avaliações físicas.
                </p>


                {/* CARDS */}

                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">


                    {/* MAIOR CARGA */}

                    <div className="rounded-2xl bg-white p-6 shadow-md">

                        <div className="mb-4 flex items-center gap-3">

                            <div className="rounded-xl bg-purple-100 p-3 text-purple-700">

                                <Dumbbell size={24} />

                            </div>

                            <h2 className="font-semibold">
                                Maior Carga
                            </h2>

                        </div>


                        <p className="text-3xl font-bold">

                            {maiorCarga > 0
                                ? `${maiorCarga} kg`
                                : "Sem registro"
                            }

                        </p>

                    </div>


                    {/* ÚLTIMA CARGA */}

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
                                : "Sem registro"
                            }

                        </p>

                    </div>


                    {/* PESO ATUAL */}

                    <div className="rounded-2xl bg-white p-6 shadow-md">

                        <div className="mb-4 flex items-center gap-3">

                            <div className="rounded-xl bg-blue-100 p-3 text-blue-700">

                                <Weight size={24} />

                            </div>

                            <h2 className="font-semibold">
                                Peso Atual
                            </h2>

                        </div>


                        <p className="text-3xl font-bold">

                            {ultimaAvaliacao
                                ? `${ultimaAvaliacao.peso} kg`
                                : "Sem avaliação"
                            }

                        </p>

                    </div>


                    {/* IMC ATUAL */}

                    <div className="rounded-2xl bg-white p-6 shadow-md">

                        <div className="mb-4 flex items-center gap-3">

                            <div className="rounded-xl bg-orange-100 p-3 text-orange-700">

                                <Activity size={24} />

                            </div>

                            <h2 className="font-semibold">
                                IMC Atual
                            </h2>

                        </div>


                        <p className="text-3xl font-bold">

                            {ultimaAvaliacao
                                ? ultimaAvaliacao.imc.toFixed(2)
                                : "Sem avaliação"
                            }

                        </p>

                    </div>

                </div>


                {/* GRÁFICO DE CARGAS */}

                <div className="mb-8 rounded-2xl bg-white p-6 shadow-md">

                    <h2 className="mb-2 text-2xl font-bold">
                        Evolução das Cargas
                    </h2>

                    <p className="mb-6 text-sm text-gray-500">
                        Histórico das cargas registradas durante os treinos.
                    </p>


                    {historico.length === 0 ? (

                        <p className="text-gray-500">
                            Você ainda não possui cargas registradas.
                        </p>

                    ) : (

                        <div className="h-80">

                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >

                                <LineChart
                                    data={historico}
                                >

                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                    />

                                    <XAxis
                                        dataKey="data"
                                    />

                                    <YAxis
                                        unit=" kg"
                                    />

                                    <Tooltip />

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


                {/* GRÁFICO DE PESO */}

                <div className="mb-8 rounded-2xl bg-white p-6 shadow-md">

                    <h2 className="mb-2 text-2xl font-bold">
                        Evolução do Peso
                    </h2>

                    <p className="mb-6 text-sm text-gray-500">
                        Alterações do peso registradas nas avaliações físicas.
                    </p>


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

                                <LineChart
                                    data={avaliacoes}
                                >

                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                    />

                                    <XAxis
                                        dataKey="data"
                                    />

                                    <YAxis
                                        unit=" kg"
                                        domain={["auto", "auto"]}
                                    />

                                    <Tooltip />

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


                {/* GRÁFICO DE IMC */}

                <div className="mb-8 rounded-2xl bg-white p-6 shadow-md">

                    <h2 className="mb-2 text-2xl font-bold">
                        Evolução do IMC
                    </h2>

                    <p className="mb-6 text-sm text-gray-500">
                        Histórico do IMC calculado nas avaliações físicas.
                    </p>


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

                                <LineChart
                                    data={avaliacoes}
                                >

                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                    />

                                    <XAxis
                                        dataKey="data"
                                    />

                                    <YAxis
                                        domain={["auto", "auto"]}
                                    />

                                    <Tooltip />

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


                {/* HISTÓRICO DE CARGAS */}

                <div className="rounded-2xl bg-white p-6 shadow-md">

                    <h2 className="mb-5 text-2xl font-bold">
                        Histórico de Cargas
                    </h2>


                    {historico.length === 0 ? (

                        <p className="text-gray-500">
                            Nenhum histórico disponível.
                        </p>

                    ) : (

                        <div className="space-y-3">

                            {historico
                                .slice()
                                .reverse()
                                .map((item) => (

                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between rounded-xl border border-gray-200 p-4"
                                    >

                                        <div>

                                            <p className="font-semibold">
                                                Carga registrada
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                {item.data}
                                            </p>

                                        </div>


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