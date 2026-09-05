import Layout from "../../components/Layout/Layout";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
    ArrowLeft,
    User,
    Calendar,
    Weight,
    Ruler,
    FileText
} from "lucide-react";


export default function CadastrarAvaliacao() {

    const navigate = useNavigate();

    const [alunos, setAlunos] = useState([]);

    const [usuarioId, setUsuarioId] = useState("");
    const [dataAvaliacao, setDataAvaliacao] = useState("");
    const [peso, setPeso] = useState("");
    const [altura, setAltura] = useState("");
    const [observacoes, setObservacoes] = useState("");

    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);


    useEffect(() => {

        async function carregarAlunos() {

            try {

                const response = await axios.get(
                    "http://localhost:5000/user/list"
                );

                setAlunos(response.data);

            } catch (error) {

                console.error(error);

                if (error.response) {

                    alert(
                        error.response.data.message ||
                        "Erro ao carregar alunos!"
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


        carregarAlunos();

    }, []);


    async function handleSalvarAvaliacao(e) {

        e.preventDefault();


        if (!usuarioId) {

            alert("Selecione um aluno!");

            return;

        }


        if (!dataAvaliacao) {

            alert("Informe a data da avaliação!");

            return;

        }


        if (!peso) {

            alert("Informe o peso!");

            return;

        }


        if (!altura) {

            alert("Informe a altura!");

            return;

        }


        try {

            setSalvando(true);


            const response = await axios.post(
                "http://localhost:5000/avaliacao/create",
                {
                    usuario_id: usuarioId,
                    peso,
                    altura,
                    data_avaliacao: dataAvaliacao,
                    observacoes
                }
            );


            alert(response.data.message);

            navigate("/avaliacoes");


        } catch (error) {

            console.error(error);


            if (error.response) {

                alert(
                    error.response.data.message ||
                    "Erro ao cadastrar avaliação!"
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


                <form
                    onSubmit={handleSalvarAvaliacao}
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



                    {/* DATA */}

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
                                value={dataAvaliacao}
                                onChange={(e) =>
                                    setDataAvaliacao(e.target.value)
                                }
                                className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                            />

                        </div>

                    </div>



                    {/* PESO E ALTURA */}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


                        <div>

                            <label className="block text-gray-700 font-medium mb-2">

                                Peso (kg)

                            </label>


                            <div className="relative">

                                <Weight
                                    size={18}
                                    className="absolute left-4 top-4 text-gray-400"
                                />


                                <input
                                    type="number"
                                    step="0.01"
                                    min="1"
                                    value={peso}
                                    onChange={(e) =>
                                        setPeso(e.target.value)
                                    }
                                    placeholder="Ex: 80.50"
                                    className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                />

                            </div>

                        </div>


                        <div>

                            <label className="block text-gray-700 font-medium mb-2">

                                Altura (m)

                            </label>


                            <div className="relative">

                                <Ruler
                                    size={18}
                                    className="absolute left-4 top-4 text-gray-400"
                                />


                                <input
                                    type="number"
                                    step="0.01"
                                    min="0.50"
                                    value={altura}
                                    onChange={(e) =>
                                        setAltura(e.target.value)
                                    }
                                    placeholder="Ex: 1.75"
                                    className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                />

                            </div>

                        </div>

                    </div>



                    {/* OBSERVAÇÕES */}

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
                                value={observacoes}
                                onChange={(e) =>
                                    setObservacoes(e.target.value)
                                }
                                placeholder="Digite observações da avaliação..."
                                className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                            />

                        </div>

                    </div>



                    {/* INFORMAÇÃO DO IMC */}

                    <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">

                        <p className="text-sm text-purple-800">

                            O IMC será calculado automaticamente
                            com base no peso e na altura.

                        </p>

                    </div>



                    {/* BOTÕES */}

                    <div className="flex justify-end gap-4 pt-8 border-t">


                        <button
                            type="button"
                            onClick={() =>
                                navigate("/avaliacoes")
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
                                : "Salvar Avaliação"}

                        </button>


                    </div>


                </form>


            </div>


        </Layout>

    );

}