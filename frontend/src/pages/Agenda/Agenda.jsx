import Layout from "../../components/Layout/Layout";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
    CalendarDays,
    Plus,
    Search
} from "lucide-react";

export default function Agenda() {

    const navigate = useNavigate();

    const [agendamentos, setAgendamentos] = useState([]);
    const [pesquisa, setPesquisa] = useState("");
    const [carregando, setCarregando] = useState(true);


    useEffect(() => {

        buscarAgenda();

    }, []);


    async function buscarAgenda() {

        try {

            setCarregando(true);

            const response = await axios.get(
                "http://localhost:5000/agenda/list"
            );

            setAgendamentos(response.data);

        } catch (error) {

            console.error(error);

            if (error.response) {

                alert(
                    error.response.data.message ||
                    "Erro ao buscar agenda!"
                );

            } else {

                alert(
                    "Não foi possível conectar ao servidor."
                );

            }

        } finally {

            setCarregando(false);

        }

    }


    function formatarData(data) {

        if (!data) {
            return "";
        }

        const somenteData = data.split("T")[0];

        const [ano, mes, dia] = somenteData.split("-");

        return `${dia}/${mes}/${ano}`;
    }


    function formatarStatus(status) {

        if (status === "concluido") {
            return "Concluído";
        }

        if (status === "pendente") {
            return "Pendente";
        }

        return status;
    }


    function classeStatus(status) {

        if (status === "concluido") {

            return "bg-green-100 text-green-700";

        }

        if (status === "pendente") {

            return "bg-yellow-100 text-yellow-700";

        }

        return "bg-gray-100 text-gray-700";
    }


    const agendamentosFiltrados = agendamentos.filter(
        (agendamento) => {

            const textoPesquisa =
                pesquisa.toLowerCase();

            const nomeAluno =
                agendamento.usuario?.nome
                    ?.toLowerCase() || "";

            const nomeTreino =
                agendamento.treino?.nome
                    ?.toLowerCase() || "";

            const status =
                formatarStatus(
                    agendamento.status
                ).toLowerCase();

            const data =
                formatarData(
                    agendamento.data
                ).toLowerCase();


            return (

                nomeAluno.includes(textoPesquisa) ||

                nomeTreino.includes(textoPesquisa) ||

                status.includes(textoPesquisa) ||

                data.includes(textoPesquisa)

            );

        }
    );


    return (

        <Layout>

            <div>

                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">

                    <div>

                        <h1 className="text-4xl font-bold">

                            Agenda

                        </h1>

                        <p className="text-gray-500 mt-2">

                            Gerencie os agendamentos de treinos.

                        </p>

                    </div>


                    <button
                        onClick={() =>
                            navigate("/cadastrar-agenda")
                        }
                        className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition"
                    >

                        <Plus size={20} />

                        Novo Agendamento

                    </button>

                </div>



                {/* PESQUISA */}

                <div className="relative mb-8">

                    <Search
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        type="text"
                        value={pesquisa}
                        onChange={(e) =>
                            setPesquisa(e.target.value)
                        }
                        placeholder="Pesquisar por aluno, treino, data ou status..."
                        className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />

                </div>



                {/* CARREGANDO */}

                {carregando ? (

                    <div className="bg-white rounded-2xl shadow-md p-8 text-center">

                        <p className="text-gray-500">

                            Carregando agenda...

                        </p>

                    </div>

                ) : agendamentosFiltrados.length === 0 ? (

                    <div className="bg-white rounded-2xl shadow-md p-8 text-center">

                        <CalendarDays
                            size={40}
                            className="mx-auto text-gray-400 mb-3"
                        />

                        <p className="text-gray-500">

                            Nenhum agendamento encontrado.

                        </p>

                    </div>

                ) : (

                    <div className="space-y-5">

                        {agendamentosFiltrados.map(
                            (agendamento) => (

                                <div
                                    key={agendamento.id}
                                    className="bg-white rounded-2xl shadow-md p-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4"
                                >

                                    <div>

                                        <h2 className="text-xl font-bold">

                                            {
                                                agendamento.usuario
                                                    ?.nome ||
                                                "Aluno não encontrado"
                                            }

                                        </h2>

                                        <p className="text-gray-500 mt-1">

                                            {
                                                agendamento.treino
                                                    ?.nome ||
                                                "Treino não encontrado"
                                            }

                                            {" • "}

                                            {
                                                formatarData(
                                                    agendamento.data
                                                )
                                            }

                                        </p>

                                    </div>


                                    <span
                                        className={`
                                            px-4
                                            py-2
                                            rounded-full
                                            font-semibold
                                            text-sm
                                            ${classeStatus(
                                                agendamento.status
                                            )}
                                        `}
                                    >

                                        {
                                            formatarStatus(
                                                agendamento.status
                                            )
                                        }

                                    </span>

                                </div>

                            )
                        )}

                    </div>

                )}

            </div>

        </Layout>

    );

}