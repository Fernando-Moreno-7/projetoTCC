import { Trash2 } from "lucide-react";

export default function ExercicioItem() {

    return (

        <div className="border border-gray-200 rounded-xl p-5">

            <div className="flex justify-between items-center mb-4">

                <h3 className="font-semibold text-lg">

                    Exercício

                </h3>

                <button
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition"
                >

                    <Trash2 size={18} />

                </button>

            </div>

            <div className="grid grid-cols-3 gap-4">

                <input
                    type="text"
                    placeholder="Nome do exercício"
                    className="border border-gray-300 rounded-lg p-3"
                />

                <input
                    type="number"
                    placeholder="Séries"
                    className="border border-gray-300 rounded-lg p-3"
                />

                <input
                    type="number"
                    placeholder="Repetições"
                    className="border border-gray-300 rounded-lg p-3"
                />

            </div>

        </div>

    );

}