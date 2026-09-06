import {
    Play,
    Dumbbell,
    CheckCircle
} from "lucide-react";

import { useNavigate } from "react-router-dom";


export default function TreinoHoje({ treino }) {

    const navigate = useNavigate();


    if (!treino) {

        return (
            <div className="bg-white rounded-2xl shadow-md p-6">

                <div className="flex items-center gap-3 mb-6">

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


    const exercicios = treino.exercicios || [];

    const treinoConcluido =
        treino.status === "concluido";


    function iniciarTreino() {

        if (treinoConcluido) {
            return;
        }

        navigate("/iniciar-treino");
    }


    return (

        <div className="bg-white rounded-2xl shadow-md p-6">

            <div className="flex items-center gap-3 mb-6">

                <Dumbbell
                    className="text-purple-700"
                    size={28}
                />

                <h2 className="text-2xl font-bold">
                    Treino de Hoje
                </h2>

            </div>


            <div className="space-y-2">

                <div className="flex items-center gap-3">

                    <h3 className="text-xl font-semibold">
                        {treino.nome}
                    </h3>


                    {treinoConcluido && (

                        <span className="bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full">

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
                        className="flex items-center justify-between bg-gray-50 rounded-xl p-4"
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


            {exercicios.length > 0 && (

                <div className="mt-8">

                    {treinoConcluido ? (

                        <div className="w-full bg-green-100 text-green-700 font-semibold py-3 rounded-xl flex items-center justify-center gap-2">

                            <CheckCircle size={20} />

                            Treino concluído

                        </div>

                    ) : (

                        <button
                            type="button"
                            onClick={iniciarTreino}
                            className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-3 rounded-xl transition duration-300 shadow-md hover:shadow-lg cursor-pointer"
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