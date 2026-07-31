import Layout from "../../components/Layout/Layout";
import AlunoCard from "../../components/AlunoCard/AlunoCard";
import { useNavigate } from "react-router-dom";

import {
    UserPlus,
    Search
} from "lucide-react";

export default function Alunos() {

    const navigate = useNavigate();

    return (

        <Layout>

            <div>

                <div className="flex justify-between items-center mb-8">

                    <div>

                        <h1 className="text-4xl font-bold">

                            Alunos

                        </h1>

                        <p className="text-gray-500 mt-2">

                            Gerencie todos os alunos cadastrados.

                        </p>

                    </div>

                    <button
                        onClick={() => navigate("/cadastrar-aluno")}
                        className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition"
                    >

                        <UserPlus size={20} />

                        Novo Aluno

                    </button>

                </div>

                <div className="relative mb-8">

                    <Search
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        type="text"
                        placeholder="Pesquisar aluno..."
                        className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />

                </div>

                <div className="space-y-5">

                    <AlunoCard
                        nome="Fernando Moreno"
                        email="fernando@email.com"
                        telefone="(11) 99999-9999"
                        status="Ativo"
                    />

                    <AlunoCard
                        nome="João Silva"
                        email="joao@email.com"
                        telefone="(11) 98888-8888"
                        status="Ativo"
                    />

                    <AlunoCard
                        nome="Maria Souza"
                        email="maria@email.com"
                        telefone="(11) 97777-7777"
                        status="Inativo"
                    />

                </div>

            </div>

        </Layout>

    );

}