import {
    Play,
    Dumbbell,
    CheckCircle
} from "lucide-react";

import { useNavigate } from "react-router-dom";


export default function TreinoHoje({ treino }) {

    const navigate = useNavigate();


    // =========================================
    // SEM TREINO
    // =========================================

    if (!treino) {

        return (

            <div className="rounded-2xl bg-white p-6 shadow-md">

                <div className="mb-6 flex items-center gap-3">

                    <Dumbbell
                        className="text-purple-700"
                        size={28}
                    />

                    <h2 className="text-2xl font-bold">

                        Treino de Hoje

                    </h2>

                </div>


                <p className="text-gray-500">

                    Nenhum treino agendado para hoje.

                </p>

            </div>

        );

    }


    // =========================================
    // DADOS
    // =========================================

    const exercicios =
        Array.isArray(treino.exercicios)
            ? treino.exercicios
            : [];


    const treinoConcluido =
        treino.status === "concluido";


    // =========================================
    // INICIAR TREINO
    // =========================================

    function iniciarTreino() {

        if (treinoConcluido) {
            return;
        }


        navigate(
            "/iniciar-treino"
        );

    }


    return (

        <div className="rounded-2xl bg-white p-6 shadow-md">


            {/* CABEÇALHO */}

            <div className="mb-6 flex items-center gap-3">

                <Dumbbell
                    className="text-purple-700"
                    size={28}
                />

                <h2 className="text-2xl font-bold">

                    Treino de Hoje

                </h2>

            </div>


            {/* INFORMAÇÕES DO TREINO */}

            <div className="space-y-2">

                <div className="flex items-center gap-3">

                    <h3 className="text-xl font-semibold">

                        {treino.nome}

                    </h3>


                    {treinoConcluido && (

                        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">

                            Concluído

                        </span>

                    )}

                </div>


                {treino.descricao && (

                    <p className="text-gray-500">

                        {treino.descricao}

                    </p>

                )}

            </div>


            {/* EXERCÍCIOS */}

            <div className="mt-6 space-y-3">

                <h4 className="font-semibold text-gray-700">

                    Exercícios

                </h4>


                {exercicios.length === 0 && (

                    <p className="text-gray-500">

                        Nenhum exercício cadastrado neste treino.

                    </p>

                )}


                {exercicios.map((item) => (

                    <div
                        key={item.id}
                        className="flex items-center justify-between rounded-xl bg-gray-50 p-4"
                    >

                        <div className="flex items-center gap-3">

                            <Dumbbell
                                size={20}
                                className="text-purple-700"
                            />


                            <div>

                                <span className="font-medium">

                                    {item.exercicio?.nome ||
                                        "Exercício"}

                                </span>


                                {item.exercicio?.grupo_muscular && (

                                    <p className="text-sm text-gray-500">

                                        {
                                            item.exercicio
                                                .grupo_muscular
                                        }

                                    </p>

                                )}

                            </div>

                        </div>


                        <span className="text-gray-600">

                            {item.series} ×{" "}
                            {item.repeticoes}

                        </span>

                    </div>

                ))}

            </div>


            {/* AÇÃO DO TREINO */}

            {exercicios.length > 0 && (

                <div className="mt-8">

                    {treinoConcluido ? (

                        <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-100 py-3 font-semibold text-green-700">

                            <CheckCircle size={20} />

                            Treino concluído

                        </div>

                    ) : (

                        <button
                            type="button"
                            onClick={iniciarTreino}
                            className="w-full cursor-pointer rounded-xl bg-purple-700 py-3 font-semibold text-white shadow-md transition duration-300 hover:bg-purple-800 hover:shadow-lg"
                        >

                            <div className="flex items-center justify-center gap-2">

                                <Play size={18} />

                                Iniciar Treino

                            </div>

                        </button>

                    )}

                </div>

            )}

        </div>

    );

}