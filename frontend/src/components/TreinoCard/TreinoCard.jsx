import { Dumbbell, Pencil, Trash2 } from "lucide-react";

export default function TreinoCard({

    nome,
    descricao,
    exercicios

}) {

    return (

        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300">

            <div className="flex justify-between items-start">

                <div>

                    <div className="flex items-center gap-3">

                        <Dumbbell
                            size={30}
                            className="text-purple-700"
                        />

                        <h2 className="text-2xl font-bold">

                            {nome}

                        </h2>

                    </div>

                    <p className="text-gray-500 mt-2">

                        {descricao}

                    </p>

                    <p className="text-sm text-gray-400 mt-4">

                        Exercícios: {exercicios}

                    </p>

                </div>

                <div className="flex gap-2">

                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition"
                    >

                        <Pencil size={18} />

                    </button>

                    <button
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition"
                    >

                        <Trash2 size={18} />

                    </button>

                </div>

            </div>

        </div>

    );

}