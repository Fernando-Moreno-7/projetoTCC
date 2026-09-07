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
    Dumbbell
} from "lucide-react";


export default function MinhaEvolucao() {

    const [historico, setHistorico] = useState([]);
    const [carregando, setCarregando] = useState(true);


    useEffect(() => {

        async function carregarHistorico() {

            try {

                const usuarioId =
                    localStorage.getItem("userId");


                if (!usuarioId) {

                    alert(
                        "Usuário não identificado. Faça login novamente."
                    );

                    return;

                }


                const response = await axios.get(
                    `http://localhost:5000/historico-cargas/usuario/${usuarioId}`
                );


                const dadosFormatados =
                    response.data.map(
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


                setHistorico(dadosFormatados);


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


        carregarHistorico();

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


    return (

        <Layout>

            <div>

                <h1 className="mb-2 text-4xl font-bold">
                    Minha Evolução
                </h1>

                <p className="mb-8 text-gray-500">
                    Acompanhe sua evolução de cargas nos treinos.
                </p>


                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">


                    <div className="rounded-2xl bg-white p-6 shadow-md">

                        <div className="mb-4 flex items-center gap-3">

                            <div className="rounded-xl bg-purple-100 p-3 text-purple-700">

                                <Dumbbell size={24} />

                            </div>

                            <h2 className="text-lg font-semibold">
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


                    <div className="rounded-2xl bg-white p-6 shadow-md">

                        <div className="mb-4 flex items-center gap-3">

                            <div className="rounded-xl bg-green-100 p-3 text-green-700">

                                <TrendingUp size={24} />

                            </div>

                            <h2 className="text-lg font-semibold">
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

                </div>


                <div className="rounded-2xl bg-white p-6 shadow-md">

                    <h2 className="mb-6 text-2xl font-bold">
                        Evolução das Cargas
                    </h2>


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
                                        stroke="#7e22ce"
                                        strokeWidth={3}
                                    />

                                </LineChart>

                            </ResponsiveContainer>

                        </div>

                    )}

                </div>


                <div className="mt-8 rounded-2xl bg-white p-6 shadow-md">

                    <h2 className="mb-5 text-2xl font-bold">
                        Histórico
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