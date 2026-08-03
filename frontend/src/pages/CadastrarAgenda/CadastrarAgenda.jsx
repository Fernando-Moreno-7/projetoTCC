import Layout from "../../components/Layout/Layout";
import { useNavigate } from "react-router-dom";

import {
    ArrowLeft,
    User,
    Dumbbell,
    CalendarDays
} from "lucide-react";

export default function CadastrarAgenda() {

    const navigate = useNavigate();

    return (

        <Layout>

            <button
                onClick={() => navigate("/agenda")}
                className="flex items-center gap-2 text-purple-700 hover:text-purple-900 mb-6 transition"
            >

                <ArrowLeft size={20} />

                Voltar para Agenda

            </button>

            <div>

                <h1 className="text-4xl font-bold">

                    Novo Agendamento

                </h1>

                <p className="text-gray-500 mt-2 mb-8">

                    Agende um treino para um aluno.

                </p>

                <div className="bg-white rounded-2xl shadow-md p-8 space-y-6">
                    <div>

    <label className="block text-gray-700 font-medium mb-2">
        Aluno
    </label>

    <div className="relative">

        <User
            size={18}
            className="absolute left-4 top-4 text-gray-400"
        />

        <select
            className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
        >

            <option>Fernando Moreno</option>
            <option>João Silva</option>
            <option>Maria Souza</option>

        </select>

    </div>

</div>

<div>

    <label className="block text-gray-700 font-medium mb-2">
        Treino
    </label>

    <div className="relative">

        <Dumbbell
            size={18}
            className="absolute left-4 top-4 text-gray-400"
        />

        <select
            className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
        >

            <option>Treino A</option>
            <option>Treino B</option>
            <option>Treino C</option>

        </select>

    </div>

</div>

<div>

    <label className="block text-gray-700 font-medium mb-2">
        Data do Treino
    </label>

    <div className="relative">

        <CalendarDays
            size={18}
            className="absolute left-4 top-4 text-gray-400"
        />

        <input
            type="date"
            className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
        />

    </div>

</div>

<div>

    <label className="block text-gray-700 font-medium mb-2">
        Status
    </label>

    <select
        className="w-full border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
    >

        <option>Pendente</option>
        <option>Concluído</option>

    </select>

</div>

<div className="flex justify-end gap-4 pt-8 border-t">

    <button
        onClick={() => navigate("/agenda")}
        className="border border-gray-300 text-gray-700 hover:bg-gray-100 px-8 py-3 rounded-xl font-semibold transition"
    >

        Cancelar

    </button>

    <button
        className="bg-purple-700 hover:bg-purple-800 text-white px-8 py-3 rounded-xl font-semibold transition"
    >

        Salvar Agendamento

    </button>

</div>

                </div>

            </div>

        </Layout>

    );

}