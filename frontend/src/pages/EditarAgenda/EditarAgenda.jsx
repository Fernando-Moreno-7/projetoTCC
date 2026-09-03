import Layout from "../../components/Layout/Layout";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import {
    ArrowLeft,
    User,
    Dumbbell,
    CalendarDays
} from "lucide-react";


export default function EditarAgenda() {

    const navigate = useNavigate();

    const { id } = useParams();


    const [alunos, setAlunos] = useState([]);

    const [treinos, setTreinos] = useState([]);


    const [usuarioId, setUsuarioId] = useState("");

    const [treinoId, setTreinoId] = useState("");

    const [data, setData] = useState("");

    const [status, setStatus] = useState("pendente");


    const [carregando, setCarregando] = useState(true);

    const [salvando, setSalvando] = useState(false);


    // =========================================
    // CARREGAR DADOS DO AGENDAMENTO
    // =========================================

    useEffect(() => {

        async function carregarDados() {

            try {

                const [
                    responseAgenda,
                    responseAlunos,
                    responseTreinos
                ] = await Promise.all([

                    axios.get(
                        `http://localhost:5000/agenda/${id}`
                    ),

                    axios.get(
                        "http://localhost:5000/user/list"
                    ),

                    axios.get(
                        "http://localhost:5000/treino/list"
                    )

                ]);


                const agenda = responseAgenda.data;


                setAlunos(responseAlunos.data);

                setTreinos(responseTreinos.data);


                setUsuarioId(
                    String(agenda.usuario_id || "")
                );


                setTreinoId(
                    String(agenda.treino_id || "")
                );


                if (agenda.data) {

                    setData(
                        agenda.data.split("T")[0]
                    );

                }


                setStatus(
                    agenda.status || "pendente"
                );


            } catch (error) {

                console.error(error);


                if (error.response) {

                    alert(
                        error.response.data.message ||
                        "Erro ao carregar agendamento!"
                    );

                } else {

                    alert(
                        "Não foi possível conectar ao servidor."
                    );

                }


                navigate("/agenda");

            } finally {

                setCarregando(false);

            }

        }


        carregarDados();

    }, [id, navigate]);


    // =========================================
    // SALVAR ALTERAÇÕES
    // =========================================

    async function handleEditarAgenda(e) {

        e.preventDefault();


        if (!usuarioId) {

            alert("Selecione um aluno!");

            return;

        }


        if (!treinoId) {

            alert("Selecione um treino!");

            return;

        }


        if (!data) {

            alert("Informe a data do treino!");

            return;

        }


        if (!status) {

            alert("Informe o status!");

            return;

        }


        try {

            setSalvando(true);


            const response = await axios.post(
                "http://localhost:5000/agenda/update",
                {

                    id,

                    usuario_id: usuarioId,

                    treino_id: treinoId,

                    data,

                    status

                }
            );


            alert(response.data.message);


            navigate("/agenda");


        } catch (error) {

            console.error(error);


            if (error.response) {

                alert(
                    error.response.data.message ||
                    "Erro ao atualizar agendamento!"
                );

            } else {

                alert(
                    "Não foi possível conectar ao servidor."
                );

            }

        } finally {

            setSalvando(false);

        }

    }


    // =========================================
    // CARREGANDO
    // =========================================

    if (carregando) {

        return (

            <Layout>

                <div className="bg-white rounded-2xl shadow-md p-8">

                    <p className="text-gray-500 text-center">

                        Carregando agendamento...

                    </p>

                </div>

            </Layout>

        );

    }


    return (

        <Layout>


            {/* VOLTAR */}

            <button
                onClick={() => navigate("/agenda")}
                className="flex items-center gap-2 text-purple-700 hover:text-purple-900 mb-6 transition"
            >

                <ArrowLeft size={20} />

                Voltar para Agenda

            </button>



            <div>


                {/* TÍTULO */}

                <h1 className="text-4xl font-bold">

                    Editar Agendamento

                </h1>


                <p className="text-gray-500 mt-2 mb-8">

                    Altere as informações do agendamento.

                </p>



                <form
                    onSubmit={handleEditarAgenda}
                    className="bg-white rounded-2xl shadow-md p-8 space-y-6"
                >


                    {/* ALUNO */}

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
                                value={usuarioId}
                                onChange={(e) =>
                                    setUsuarioId(e.target.value)
                                }
                                className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                            >

                                <option value="">

                                    Selecione um aluno

                                </option>


                                {alunos.map((aluno) => (

                                    <option
                                        key={aluno.id}
                                        value={aluno.id}
                                    >

                                        {aluno.nome}

                                    </option>

                                ))}

                            </select>

                        </div>

                    </div>



                    {/* TREINO */}

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
                                value={treinoId}
                                onChange={(e) =>
                                    setTreinoId(e.target.value)
                                }
                                className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                            >

                                <option value="">

                                    Selecione um treino

                                </option>


                                {treinos.map((treino) => (

                                    <option
                                        key={treino.id}
                                        value={treino.id}
                                    >

                                        {treino.nome}

                                    </option>

                                ))}

                            </select>

                        </div>

                    </div>



                    {/* DATA */}

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
                                value={data}
                                onChange={(e) =>
                                    setData(e.target.value)
                                }
                                className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                            />

                        </div>

                    </div>



                    {/* STATUS */}

                    <div>

                        <label className="block text-gray-700 font-medium mb-2">

                            Status

                        </label>


                        <select
                            value={status}
                            onChange={(e) =>
                                setStatus(e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                        >

                            <option value="pendente">

                                Pendente

                            </option>


                            <option value="concluido">

                                Concluído

                            </option>

                        </select>

                    </div>



                    {/* BOTÕES */}

                    <div className="flex justify-end gap-4 pt-8 border-t">


                        <button
                            type="button"
                            onClick={() =>
                                navigate("/agenda")
                            }
                            className="border border-gray-300 text-gray-700 hover:bg-gray-100 px-8 py-3 rounded-xl font-semibold transition"
                        >

                            Cancelar

                        </button>


                        <button
                            type="submit"
                            disabled={salvando}
                            className="bg-purple-700 hover:bg-purple-800 disabled:bg-purple-400 text-white px-8 py-3 rounded-xl font-semibold transition"
                        >

                            {salvando
                                ? "Salvando..."
                                : "Salvar Alterações"}

                        </button>


                    </div>


                </form>


            </div>


        </Layout>

    );

}