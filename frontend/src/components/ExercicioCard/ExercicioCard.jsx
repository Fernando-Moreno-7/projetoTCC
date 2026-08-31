import {
    Activity,
    Pencil,
    Trash2
} from "lucide-react";

export default function ExercicioCard({
    nome,
    grupoMuscular,
    descricao,
    imagem,
    onEditar,
    onExcluir
}) {

    return (

        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300">

            <div className="flex justify-between items-start gap-4">

                <div className="flex-1">

                    <div className="flex items-center gap-3">

                        <Activity
                            size={30}
                            className="text-purple-700"
                        />

                        <div>

                            <h2 className="text-xl font-bold">
                                {nome}
                            </h2>

                            <p className="text-sm text-purple-700 font-medium">
                                {grupoMuscular}
                            </p>

                        </div>

                    </div>

                    {descricao && (

                        <p className="text-gray-500 mt-4">
                            {descricao}
                        </p>

                    )}

                    {imagem && (

                        <div className="mt-4">

                            <img
                                src={imagem}
                                alt={nome}
                                className="w-full h-40 object-cover rounded-xl"
                            />

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