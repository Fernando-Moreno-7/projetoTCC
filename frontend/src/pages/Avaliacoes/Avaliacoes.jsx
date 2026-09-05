import Layout from "../../components/Layout/Layout";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
    Search,
    Plus,
    Trash2,
    Pencil
} from "lucide-react";


export default function Avaliacoes() {

    const navigate = useNavigate();

    const [avaliacoes, setAvaliacoes] = useState([]);
    const [pesquisa, setPesquisa] = useState("");
    const [carregando, setCarregando] = useState(true);


    useEffect(() => {

        carregarAvaliacoes();

    }, []);


    async function carregarAvaliacoes() {

        try {

            const response = await axios.get(
                "http://localhost:5000/avaliacao/list"
            );

            setAvaliacoes(response.data);

        } catch (error) {

            console.error(error);

            if (error.response) {

                alert(
                    error.response.data.message ||
                    "Erro ao carregar avaliações!"
                );

            } else {

                alert("Não foi possível conectar ao servidor.");

            }

        } finally {

            setCarregando(false);

        }

    }


    async function excluirAvaliacao(id) {

        const confirmar = window.confirm(
            "Tem certeza que deseja excluir esta avaliação?"
        );

        if (!confirmar) {
            return;
        }


        try {

            const response = await axios.delete(
                "http://localhost:5000/avaliacao/delete",
                {
                    data: {
                        id
                    }
                }
            );

            alert(response.data.message);


            setAvaliacoes((avaliacoesAtuais) =>
                avaliacoesAtuais.filter(
                    (avaliacao) => avaliacao.id !== id
                )
            );

        } catch (error) {

            console.error(error);

            if (error.response) {

                alert(
                    error.response.data.message ||
                    "Erro ao excluir avaliação!"
                );

            } else {

                alert("Não foi possível conectar ao servidor.");

            }

        }

    }


    function formatarData(data) {

        if (!data) {
            return "";
        }

        const partes = data.split("-");

        return `${partes[2]}/${partes[1]}/${partes[0]}`;

    }


    const avaliacoesFiltradas = avaliacoes.filter((avaliacao) => {

        const nomeAluno =
            avaliacao.usuario?.nome?.toLowerCase() || "";

        const textoPesquisa = pesquisa.toLowerCase();

        return nomeAluno.includes(textoPesquisa);

    });


    return (

        <Layout>

            <div>


                {/* CABEÇALHO */}

                <div className="flex justify-between items-center mb-8">

                    <div>

                        <h1 className="text-4xl font-bold">
                            Avaliações
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Gerencie as avaliações físicas dos alunos.
                        </p>

                    </div>


                    <button
                        onClick={() =>
                            navigate("/cadastrar-avaliacao")
                        }
                        className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition"
                    >

                        <Plus size={20} />

                        Nova Avaliação

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
                        placeholder="Pesquisar aluno..."
                        className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />

                </div>


                {/* CARREGANDO */}

                {carregando && (

                    <p className="text-gray-500">
                        Carregando avaliações...
                    </p>

                )}


                {/* NENHUMA AVALIAÇÃO */}

                {!carregando &&
                    avaliacoesFiltradas.length === 0 && (

                        <div className="bg-white rounded-2xl shadow-md p-8 text-center">

                            <p className="text-gray-500">
                                Nenhuma avaliação encontrada.
                            </p>

                        </div>

                    )}


                {/* LISTAGEM */}

                {!carregando && (

                    <div className="space-y-5">

                        {avaliacoesFiltradas.map((avaliacao) => (

                            <div
                                key={avaliacao.id}
                                className="bg-white rounded-2xl shadow-md p-6 flex flex-col md:flex-row md:justify-between md:items-center gap-6"
                            >


                                {/* DADOS DA AVALIAÇÃO */}

                                <div>

                                    <h2 className="text-xl font-bold">

                                        {avaliacao.usuario?.nome ||
                                            "Aluno não encontrado"}

                                    </h2>


                                    <p className="text-gray-500 mt-2">

                                        Peso: {avaliacao.peso} kg

                                    </p>


                                    <p className="text-gray-500">

                                        Altura: {avaliacao.altura} m

                                    </p>


                                    <p className="text-gray-500">

                                        IMC: {avaliacao.imc}

                                    </p>


                                    {avaliacao.observacoes && (

                                        <p className="text-gray-500 mt-2">

                                            Observações:{" "}
                                            {avaliacao.observacoes}

                                        </p>

                                    )}

                                </div>


                                {/* DATA E BOTÕES */}

                                <div className="flex flex-col md:items-end gap-4">

                                    <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold">

                                        {formatarData(
                                            avaliacao.data_avaliacao
                                        )}

                                    </span>


                                    <div className="flex gap-4">


                                        {/* EDITAR */}

                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/editar-avaliacao/${avaliacao.id}`
                                                )
                                            }
                                            className="flex items-center gap-2 text-purple-700 hover:text-purple-900 transition"
                                        >

                                            <Pencil size={18} />

                                            Editar

                                        </button>


                                        {/* EXCLUIR */}

                                        <button
                                            onClick={() =>
                                                excluirAvaliacao(
                                                    avaliacao.id
                                                )
                                            }
                                            className="flex items-center gap-2 text-red-600 hover:text-red-800 transition"
                                        >

                                            <Trash2 size={18} />

                                            Excluir

                                        </button>


                                    </div>

                                </div>


                            </div>

                        ))}

                    </div>

                )}


            </div>

        </Layout>

    );

}
