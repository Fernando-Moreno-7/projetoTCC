import Layout from "../../components/Layout/Layout";
import { useNavigate } from "react-router-dom";

import {
    CalendarDays,
    Plus,
    Search
} from "lucide-react";

export default function Agenda() {
    const navigate = useNavigate();

    return (

        <Layout>

            <div>

                <div className="flex justify-between items-center mb-8">

                    <div>

                        <h1 className="text-4xl font-bold">

                            Agenda

                        </h1>

                        <p className="text-gray-500 mt-2">

                            Gerencie os agendamentos de treinos.

                        </p>

                    </div>
                    <button
                        onClick={() => navigate("/cadastrar-agenda")}
                        className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition"
                    >
                     <Plus size={20} />
                                         Novo Agendamento
                    </button>

                    

                </div>

                <div className="relative mb-8">

                    <Search
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        type="text"
                        placeholder="Pesquisar agendamento..."
                        className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />

                </div>

                <div className="space-y-5">

                    <div className="bg-white rounded-2xl shadow-md p-6 flex justify-between items-center">

                        <div>

                            <h2 className="text-xl font-bold">

                                Fernando Moreno

                            </h2>

                            <p className="text-gray-500">

                                Treino A • 05/08/2026

                            </p>

                        </div>

                        <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-semibold">

                            Pendente

                        </span>

                    </div>

                    <div className="bg-white rounded-2xl shadow-md p-6 flex justify-between items-center">

                        <div>

                            <h2 className="text-xl font-bold">

                                João Silva

                            </h2>

                            <p className="text-gray-500">

                                Treino B • 06/08/2026

                            </p>

                        </div>

                        <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">

                            Concluído

                        </span>

                    </div>

                </div>

            </div>

        </Layout>

    );

}