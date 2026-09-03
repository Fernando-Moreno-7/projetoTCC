import Layout from "../../components/Layout/Layout";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
    CalendarDays,
    Plus,
    Search,
    Pencil,
    Trash2,
    CheckCircle
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


    async function handleFinalizarTreino(id) {

        const confirmar = window.confirm(
            "Deseja marcar este treino como concluído?"
        );

        if (!confirmar) {
            return;
        }


        try {

            const response = await axios.post(
                "http://localhost:5000/agenda/finalizar",
                {
                    id
                }
            );


            alert(response.data.message);


            setAgendamentos(
                (agendamentosAtuais) =>
                    agendamentosAtuais.map(
                        (agendamento) => {

                            if (agendamento.id === id) {

                                return {
                                    ...agendamento,
                                    status: "concluido"
                                };

                            }

                            return agendamento;

                        }
                    )
            );


        } catch (error) {

            console.error(error);


            if (error.response) {

                alert(
                    error.response.data.message ||
                    "Erro ao finalizar treino!"
                );

            } else {

                alert(
                    "Não foi possível conectar ao servidor."
                );

            }

        }

    }


    async function handleExcluirAgenda(id) {

        const confirmar = window.confirm(
            "Tem certeza que deseja excluir este agendamento?"
        );

        if (!confirmar) {
            return;
        }


        try {

            const response = await axios.delete(
                "http://localhost:5000/agenda/delete",
                {
                    data: {
                        id
                    }
                }
            );


            alert(response.data.message);


            setAgendamentos(
                (agendamentosAtuais) =>
                    agendamentosAtuais.filter(
                        (agendamento) =>
                            agendamento.id !== id
                    )
            );


        } catch (error) {

            console.error(error);


            if (error.response) {

                alert(
                    error.response.data.message ||
                    "Erro ao excluir agendamento!"
                );

            } else {

                alert(
                    "Não foi possível conectar ao servidor."
                );

            }

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


                                    <div className="flex flex-wrap items-center gap-3">


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


                                        {agendamento.status !== "concluido" && (

                                            <button
                                                onClick={() =>
                                                    handleFinalizarTreino(
                                                        agendamento.id
                                                    )
                                                }
                                                className="flex items-center gap-2 border border-green-600 text-green-600 hover:bg-green-50 px-4 py-2 rounded-xl font-semibold transition"
                                            >

                                                <CheckCircle size={18} />

                                                Concluir

                                            </button>

                                        )}


                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/editar-agenda/${agendamento.id}`
                                                )
                                            }
                                            className="flex items-center gap-2 border border-purple-700 text-purple-700 hover:bg-purple-50 px-4 py-2 rounded-xl font-semibold transition"
                                        >

                                            <Pencil size={18} />

                                            Editar

                                        </button>


                                        <button
                                            onClick={() =>
                                                handleExcluirAgenda(
                                                    agendamento.id
                                                )
                                            }
                                            className="flex items-center gap-2 border border-red-600 text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl font-semibold transition"
                                        >

                                            <Trash2 size={18} />

                                            Excluir

                                        </button>


                                    </div>


                                </div>

                            )
                        )}

                    </div>

                )}


            </div>

        </Layout>

    );

}