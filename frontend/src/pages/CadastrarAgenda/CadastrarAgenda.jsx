import Layout from "../../components/Layout/Layout";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
    ArrowLeft,
    User,
    Dumbbell,
    CalendarDays
} from "lucide-react";

export default function CadastrarAgenda() {

    const navigate = useNavigate();

    const [alunos, setAlunos] = useState([]);
    const [treinos, setTreinos] = useState([]);

    const [usuarioId, setUsuarioId] = useState("");
    const [treinoId, setTreinoId] = useState("");
    const [data, setData] = useState("");
    const [status, setStatus] = useState("pendente");

    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);


    useEffect(() => {

        async function carregarDados() {

            try {

                const [responseAlunos, responseTreinos] =
                    await Promise.all([

                        axios.get(
                            "http://localhost:5000/user/list"
                        ),

                        axios.get(
                            "http://localhost:5000/treino/list"
                        )

                    ]);


                setAlunos(responseAlunos.data);

                setTreinos(responseTreinos.data);


            } catch (error) {

                console.error(error);

                alert(
                    "Erro ao carregar alunos e treinos!"
                );

            } finally {

                setCarregando(false);

            }

        }


        carregarDados();

    }, []);


    async function handleSalvarAgenda(e) {

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

            alert("Selecione a data do treino!");

            return;

        }


        try {

            setSalvando(true);


            const response = await axios.post(
                "http://localhost:5000/agenda/create",
                {

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
                    "Erro ao criar agendamento!"
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


                <form
                    onSubmit={handleSalvarAgenda}
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
                                disabled={carregando}
                                className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                            >

                                <option value="">

                                    {carregando
                                        ? "Carregando alunos..."
                                        : "Selecione um aluno"}

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
                                disabled={carregando}
                                className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                            >

                                <option value="">

                                    {carregando
                                        ? "Carregando treinos..."
                                        : "Selecione um treino"}

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
                            disabled={salvando || carregando}
                            className="bg-purple-700 hover:bg-purple-800 disabled:bg-purple-400 text-white px-8 py-3 rounded-xl font-semibold transition"
                        >

                            {salvando
                                ? "Salvando..."
                                : "Salvar Agendamento"}

                        </button>

                    </div>

                </form>

            </div>

        </Layout>

    );

}