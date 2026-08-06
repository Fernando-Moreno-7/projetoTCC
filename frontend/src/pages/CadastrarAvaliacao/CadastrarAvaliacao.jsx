import Layout from "../../components/Layout/Layout";
import { useNavigate } from "react-router-dom";

import {
    ArrowLeft,
    User,
    Calendar,
    Weight,
    Ruler,
    Activity,
    FileText
} from "lucide-react";

export default function CadastrarAvaliacao() {

    const navigate = useNavigate();

    return (

        <Layout>

            <button
                onClick={() => navigate("/avaliacoes")}
                className="flex items-center gap-2 text-purple-700 hover:text-purple-900 mb-6 transition"
            >

                <ArrowLeft size={20} />

                Voltar para Avaliações

            </button>

            <div>

                <h1 className="text-4xl font-bold">

                    Nova Avaliação

                </h1>

                <p className="text-gray-500 mt-2 mb-8">

                    Cadastre uma nova avaliação física.

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
        Data da Avaliação
    </label>

    <div className="relative">

        <Calendar
            size={18}
            className="absolute left-4 top-4 text-gray-400"
        />

        <input
            type="date"
            className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
        />

    </div>

</div>

<div className="grid grid-cols-2 gap-6">

    <div>

        <label className="block text-gray-700 font-medium mb-2">
            Peso
        </label>

        <div className="relative">

            <Weight
                size={18}
                className="absolute left-4 top-4 text-gray-400"
            />

            <input
                type="text"
                placeholder="80 kg"
                className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />

        </div>

    </div>

    <div>

        <label className="block text-gray-700 font-medium mb-2">
            Altura
        </label>

        <div className="relative">

            <Ruler
                size={18}
                className="absolute left-4 top-4 text-gray-400"
            />

            <input
                type="text"
                placeholder="1.75 m"
                className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />

        </div>

    </div>

</div>

<div className="grid grid-cols-2 gap-6">

    <div>

        <label className="block text-gray-700 font-medium mb-2">
            Percentual de Gordura
        </label>

        <div className="relative">

            <Activity
                size={18}
                className="absolute left-4 top-4 text-gray-400"
            />

            <input
                type="text"
                placeholder="18%"
                className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />

        </div>

    </div>

    <div>

        <label className="block text-gray-700 font-medium mb-2">
            IMC
        </label>

        <div className="relative">

            <Activity
                size={18}
                className="absolute left-4 top-4 text-gray-400"
            />

            <input
                type="text"
                placeholder="24.3"
                className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />

        </div>

    </div>

</div>

<div>

    <label className="block text-gray-700 font-medium mb-2">
        Observações
    </label>

    <div className="relative">

        <FileText
            size={18}
            className="absolute left-4 top-4 text-gray-400"
        />

        <textarea
            rows="4"
            placeholder="Digite observações da avaliação..."
            className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
        />

    </div>

</div>

<div className="flex justify-end gap-4 pt-8 border-t">

    <button
        onClick={() => navigate("/avaliacoes")}
        className="border border-gray-300 text-gray-700 hover:bg-gray-100 px-8 py-3 rounded-xl font-semibold transition"
    >

        Cancelar

    </button>

    <button
        className="bg-purple-700 hover:bg-purple-800 text-white px-8 py-3 rounded-xl font-semibold transition"
    >

        Salvar Avaliação

    </button>

</div>

                </div>

            </div>

        </Layout>

    );

}