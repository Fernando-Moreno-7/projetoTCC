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


            setAvaliacoes(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );


        } catch (error) {

            console.error(error);


            if (error.response) {

                alert(
                    error.response.data.message ||
                    "Erro ao carregar avaliações!"
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


            alert(
                response.data.message
            );


            setAvaliacoes(
                (avaliacoesAtuais) =>
                    avaliacoesAtuais.filter(
                        (avaliacao) =>
                            avaliacao.id !== id
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

                alert(
                    "Não foi possível conectar ao servidor."
                );

            }

        }

    }


    function formatarData(data) {

        if (!data) {
            return "Data não informada";
        }


        const dataSomente =
            data.split("T")[0];


        const partes =
            dataSomente.split("-");


        if (partes.length !== 3) {
            return data;
        }


        return `${partes[2]}/${partes[1]}/${partes[0]}`;

    }


    const textoPesquisa =
        pesquisa.trim().toLowerCase();


    const avaliacoesFiltradas =
        avaliacoes.filter(
            (avaliacao) => {

                const nomeAluno =
                    avaliacao.usuario?.nome
                        ?.toLowerCase() || "";


                return nomeAluno.includes(
                    textoPesquisa
                );

            }
        );


    return (

        <Layout>

            <div>


                {/* CABEÇALHO */}

                <div className="mb-8 flex items-center justify-between">

                    <div>

                        <h1 className="text-4xl font-bold">
                            Avaliações
                        </h1>

                        <p className="mt-2 text-gray-500">
                            Gerencie as avaliações físicas dos alunos.
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/cadastrar-avaliacao"
                            )
                        }
                        className="flex cursor-pointer items-center gap-2 rounded-xl bg-purple-700 px-6 py-3 text-white transition hover:bg-purple-800"
                    >

                        <Plus size={20} />

                        Nova Avaliação

                    </button>

                </div>


                {/* PESQUISA */}

                <div className="relative mb-8">

                    <Search
                        size={18}
                        className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
                    />


                    <input
                        type="text"
                        value={pesquisa}
                        onChange={(e) =>
                            setPesquisa(
                                e.target.value
                            )
                        }
                        placeholder="Pesquisar aluno..."
                        className="w-full rounded-xl border border-gray-300 py-3 pr-4 pl-11 focus:ring-2 focus:ring-purple-600 focus:outline-none"
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

                        <div className="rounded-2xl bg-white p-8 text-center shadow-md">

                            <p className="text-gray-500">
                                Nenhuma avaliação encontrada.
                            </p>

                        </div>

                    )}


                {/* LISTAGEM */}

                {!carregando && (

                    <div className="space-y-5">

                        {avaliacoesFiltradas.map(
                            (avaliacao) => (

                                <div
                                    key={
                                        avaliacao.id
                                    }
                                    className="flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-md md:flex-row md:items-center md:justify-between"
                                >


                                    {/* DADOS */}

                                    <div>

                                        <h2 className="text-xl font-bold">

                                            {avaliacao.usuario?.nome ||
                                                "Aluno não encontrado"}

                                        </h2>


                                        <p className="mt-2 text-gray-500">

                                            Peso:{" "}
                                            {avaliacao.peso} kg

                                        </p>


                                        <p className="text-gray-500">

                                            Altura:{" "}
                                            {avaliacao.altura} m

                                        </p>


                                        <p className="text-gray-500">

                                            IMC:{" "}
                                            {avaliacao.imc}

                                        </p>


                                        {avaliacao.observacoes && (

                                            <p className="mt-2 text-gray-500">

                                                Observações:{" "}
                                                {
                                                    avaliacao.observacoes
                                                }

                                            </p>

                                        )}

                                    </div>


                                    {/* DATA E BOTÕES */}

                                    <div className="flex flex-col gap-4 md:items-end">

                                        <span className="rounded-full bg-blue-100 px-4 py-2 font-semibold text-blue-700">

                                            {formatarData(
                                                avaliacao.data_avaliacao
                                            )}

                                        </span>


                                        <div className="flex gap-4">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    navigate(
                                                        `/editar-avaliacao/${avaliacao.id}`
                                                    )
                                                }
                                                className="flex cursor-pointer items-center gap-2 text-purple-700 transition hover:text-purple-900"
                                            >

                                                <Pencil size={18} />

                                                Editar

                                            </button>


                                            <button
                                                type="button"
                                                onClick={() =>
                                                    excluirAvaliacao(
                                                        avaliacao.id
                                                    )
                                                }
                                                className="flex cursor-pointer items-center gap-2 text-red-600 transition hover:text-red-800"
                                            >

                                                <Trash2 size={18} />

                                                Excluir

                                            </button>

                                        </div>

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