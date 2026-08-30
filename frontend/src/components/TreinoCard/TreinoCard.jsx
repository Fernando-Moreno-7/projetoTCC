import {
    Dumbbell,
    Pencil,
    Trash2
} from "lucide-react";

export default function TreinoCard({
    nome,
    descricao,
    exercicios = [],
    onEditar,
    onExcluir
}) {

    return (

        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300">

            <div className="flex justify-between items-start gap-4">

                <div className="flex-1">

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

                    <div className="mt-4">

                        <p className="text-sm font-semibold text-gray-600">
                            {exercicios.length}{" "}
                            {exercicios.length === 1
                                ? "exercício"
                                : "exercícios"
                            }
                        </p>

                    </div>

                    {exercicios.length > 0 && (

                        <div className="mt-4 space-y-3">

                            {exercicios.map((item) => (

                                <div
                                    key={item.id}
                                    className="bg-gray-50 border border-gray-200 rounded-xl p-4"
                                >

                                    <div className="flex justify-between items-center gap-4">

                                        <div>

                                            <p className="font-semibold text-gray-800">
                                                {item.exercicio?.nome || "Exercício"}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                {item.exercicio?.grupo_muscular || "Grupo muscular não informado"}
                                            </p>

                                        </div>

                                        <div className="text-sm text-gray-600 whitespace-nowrap">

                                            <span className="font-semibold">
                                                {item.series}
                                            </span>{" "}
                                            séries x{" "}
                                            <span className="font-semibold">
                                                {item.repeticoes}
                                            </span>{" "}
                                            repetições

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

                <div className="flex gap-2">

                    <button
                        onClick={onEditar}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition"
                    >
                        <Pencil size={18} />
                    </button>

                    <button
                        onClick={onExcluir}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition"
                    >
                        <Trash2 size={18} />
                    </button>

                </div>

            </div>

        </div>

    );
}