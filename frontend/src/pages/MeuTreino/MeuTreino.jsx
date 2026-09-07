import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Layout from "../../components/Layout/Layout";

import {
    Dumbbell,
    Play,
    CalendarDays
} from "lucide-react";


export default function MeuTreino() {

    const navigate = useNavigate();

    const [treino, setTreino] = useState(null);
    const [agenda, setAgenda] = useState(null);
    const [exercicios, setExercicios] = useState([]);
    const [carregando, setCarregando] = useState(true);


    useEffect(() => {

        async function carregarTreino() {

            try {

                const usuarioId =
                    localStorage.getItem("userId");


                if (!usuarioId) {

                    alert(
                        "Usuário não identificado. Faça login novamente."
                    );

                    navigate("/");

                    return;

                }


                const response = await axios.get(
                    `http://localhost:5000/agenda/usuario/${usuarioId}`
                );


                setAgenda(response.data.agenda);
                setTreino(response.data.treino);
                setExercicios(
                    response.data.exercicios || []
                );


            } catch (error) {

                console.error(error);


                if (error.response?.status === 404) {

                    setTreino(null);
                    setAgenda(null);
                    setExercicios([]);

                } else {

                    alert(
                        error.response?.data?.message ||
                        "Erro ao carregar treino!"
                    );

                }

            } finally {

                setCarregando(false);

            }

        }


        carregarTreino();

    }, [navigate]);


    function formatarData(data) {

        if (!data) {
            return "Não informada";
        }


        return new Date(data).toLocaleDateString(
            "pt-BR",
            {
                timeZone: "UTC"
            }
        );

    }


    if (carregando) {

        return (

            <Layout>

                <p className="text-gray-500">
                    Carregando seu treino...
                </p>

            </Layout>

        );

    }


    return (

        <Layout>

            <div>

                <h1 className="mb-2 text-4xl font-bold">
                    Meu Treino
                </h1>

                <p className="mb-8 text-gray-500">
                    Veja os exercícios do seu treino.
                </p>


                {!treino ? (

                    <div className="rounded-2xl bg-white p-8 shadow-md">

                        <Dumbbell
                            size={38}
                            className="mb-4 text-purple-700"
                        />

                        <h2 className="text-2xl font-bold">
                            Nenhum treino encontrado
                        </h2>

                        <p className="mt-2 text-gray-500">
                            Você ainda não possui um treino agendado.
                        </p>

                    </div>

                ) : (

                    <>

                        <div className="mb-6 rounded-2xl bg-white p-6 shadow-md">

                            <div className="flex items-start justify-between gap-4">

                                <div>

                                    <div className="mb-2 flex items-center gap-3">

                                        <Dumbbell
                                            size={28}
                                            className="text-purple-700"
                                        />

                                        <h2 className="text-2xl font-bold">
                                            {treino.nome}
                                        </h2>

                                    </div>


                                    {treino.descricao && (

                                        <p className="text-gray-500">
                                            {treino.descricao}
                                        </p>

                                    )}

                                </div>


                                {agenda?.status && (

                                    <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-semibold text-purple-700">

                                        {agenda.status}

                                    </span>

                                )}

                            </div>


                            <div className="mt-5 flex items-center gap-2 text-gray-600">

                                <CalendarDays size={18} />

                                <span>
                                    Data:{" "}
                                    {formatarData(
                                        agenda?.data
                                    )}
                                </span>

                            </div>

                        </div>


                        <div className="rounded-2xl bg-white p-6 shadow-md">

                            <h2 className="mb-5 text-2xl font-bold">
                                Exercícios
                            </h2>


                            {exercicios.length === 0 ? (

                                <p className="text-gray-500">
                                    Nenhum exercício cadastrado neste treino.
                                </p>

                            ) : (

                                <div className="space-y-4">

                                    {exercicios.map(
                                        (item, index) => (

                                            <div
                                                key={item.id}
                                                className="rounded-xl border border-gray-200 p-5"
                                            >

                                                <div className="flex items-start justify-between gap-4">

                                                    <div>

                                                        <p className="mb-1 text-sm font-semibold text-purple-700">
                                                            Exercício{" "}
                                                            {index + 1}
                                                        </p>

                                                        <h3 className="text-xl font-bold">
                                                            {item.nome}
                                                        </h3>


                                                        {item.grupo_muscular && (

                                                            <p className="mt-1 text-gray-500">
                                                                {item.grupo_muscular}
                                                            </p>

                                                        )}

                                                    </div>


                                                    <div className="text-right">

                                                        <p className="font-semibold">
                                                            {item.series} ×{" "}
                                                            {item.repeticoes}
                                                        </p>

                                                        <p className="text-sm text-gray-500">
                                                            séries × repetições
                                                        </p>

                                                    </div>

                                                </div>


                                                {item.ultima_carga && (

                                                    <div className="mt-4">

                                                        <span className="text-sm text-gray-500">
                                                            Última carga:
                                                        </span>

                                                        <span className="ml-2 font-semibold">
                                                            {item.ultima_carga} kg
                                                        </span>

                                                    </div>

                                                )}


                                                {item.descricao && (

                                                    <p className="mt-4 text-gray-600">
                                                        {item.descricao}
                                                    </p>

                                                )}

                                            </div>

                                        )
                                    )}

                                </div>

                            )}


                            {exercicios.length > 0 &&
                                agenda?.status !==
                                "concluido" && (

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            "/iniciar-treino"
                                        )
                                    }
                                    className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-purple-700 py-3 font-semibold text-white transition hover:bg-purple-800"
                                >

                                    <Play size={20} />

                                    Iniciar Treino

                                </button>

                            )}

                        </div>

                    </>

                )}

            </div>

        </Layout>

    );

}