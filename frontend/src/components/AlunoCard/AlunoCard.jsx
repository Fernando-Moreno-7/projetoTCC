import {
    User,
    Mail,
    Phone,
    Pencil,
    Trash2
} from "lucide-react";

export default function AlunoCard({
    nome,
    email,
    telefone,
    status,
    onEditar,
    onExcluir
}) {

    return (

        <div className="bg-white rounded-2xl shadow-md p-6 flex justify-between items-center">

            <div>

                <div className="flex items-center gap-3 mb-3">

                    <div className="bg-purple-100 p-3 rounded-full">

                        <User
                            size={22}
                            className="text-purple-700"
                        />

                    </div>

                    <div>

                        <h2 className="text-xl font-bold">
                            {nome}
                        </h2>

                        <span className="text-green-600 font-medium">
                            {status}
                        </span>

                    </div>

                </div>

                <p className="flex items-center gap-2 text-gray-600">

                    <Mail size={16} />

                    {email}

                </p>

                <p className="flex items-center gap-2 text-gray-600 mt-2">

                    <Phone size={16} />

                    {telefone}

                </p>

            </div>

            <div className="flex gap-3">

                <button
                    onClick={onEditar}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-xl transition"
                >
                    <Pencil size={18} />
                </button>

                <button
                    onClick={onExcluir}
                    className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl transition"
                >
                    <Trash2 size={18} />
                </button>

            </div>

        </div>

    );

}