import Layout from "../../components/Layout/Layout";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import {
    ArrowLeft,
    User,
    Calendar,
    Weight,
    Ruler,
    FileText
} from "lucide-react";


export default function EditarAvaliacao() {

    const navigate = useNavigate();
    const { id } = useParams();

    const [alunos, setAlunos] = useState([]);

    const [usuarioId, setUsuarioId] = useState("");
    const [dataAvaliacao, setDataAvaliacao] = useState("");
    const [peso, setPeso] = useState("");
    const [altura, setAltura] = useState("");
    const [observacoes, setObservacoes] = useState("");

    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);


    // =========================================
    // CARREGAR DADOS
    // =========================================

    useEffect(() => {

        async function carregarDados() {

            try {

                const [
                    responseAvaliacao,
                    responseAlunos
                ] = await Promise.all([

                    axios.get(
                        `http://localhost:5000/avaliacao/${id}`
                    ),

                    axios.get(
                        "http://localhost:5000/user/list"
                    )

                ]);


                const avaliacao =
                    responseAvaliacao.data;


                const usuarios =
                    Array.isArray(responseAlunos.data)
                        ? responseAlunos.data
                        : [];


                const apenasAlunos =
                    usuarios.filter(
                        (usuario) =>
                            usuario.tipo_usuario === "aluno"
                    );


                setAlunos(
                    apenasAlunos
                );


                setUsuarioId(
                    String(avaliacao.usuario_id)
                );


                setPeso(
                    avaliacao.peso ?? ""
                );


                setAltura(
                    avaliacao.altura ?? ""
                );


                setDataAvaliacao(
                    avaliacao.data_avaliacao
                        ? avaliacao.data_avaliacao.split("T")[0]
                        : ""
                );


                setObservacoes(
                    avaliacao.observacoes || ""
                );


            } catch (error) {

                console.error(error);


                if (error.response) {

                    alert(
                        error.response.data.message ||
                        "Erro ao carregar avaliação!"
                    );

                } else {

                    alert(
                        "Não foi possível conectar ao servidor."
                    );

                }


                navigate(
                    "/avaliacoes"
                );


            } finally {

                setCarregando(false);

            }

        }


        carregarDados();

    }, [id, navigate]);


    // =========================================
    // ATUALIZAR AVALIAÇÃO
    // =========================================

    async function handleAtualizarAvaliacao(e) {

        e.preventDefault();


        if (!usuarioId) {

            alert(
                "Selecione um aluno!"
            );

            return;

        }


        if (!dataAvaliacao) {

            alert(
                "Informe a data da avaliação!"
            );

            return;

        }


        if (!peso) {

            alert(
                "Informe o peso!"
            );

            return;

        }


        if (!altura) {

            alert(
                "Informe a altura!"
            );

            return;

        }


        const pesoNumero =
            Number(peso);

        const alturaNumero =
            Number(altura);


        if (
            Number.isNaN(pesoNumero) ||
            pesoNumero <= 0
        ) {

            alert(
                "Informe um peso válido!"
            );

            return;

        }


        if (
            Number.isNaN(alturaNumero) ||
            alturaNumero <= 0
        ) {

            alert(
                "Informe uma altura válida!"
            );

            return;

        }


        try {

            setSalvando(true);


            const response = await axios.post(
                "http://localhost:5000/avaliacao/update",
                {
                    id:
                        Number(id),

                    usuario_id:
                        Number(usuarioId),

                    peso:
                        pesoNumero,

                    altura:
                        alturaNumero,

                    data_avaliacao:
                        dataAvaliacao,

                    observacoes:
                        observacoes.trim()
                }
            );


            alert(
                response.data.message
            );


            navigate(
                "/avaliacoes"
            );


        } catch (error) {

            console.error(error);


            if (error.response) {

                alert(
                    error.response.data.message ||
                    "Erro ao atualizar avaliação!"
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
    // IMC PREVISTO
    // =========================================

    const pesoNumero =
        Number(peso);

    const alturaNumero =
        Number(altura);


    const imcPrevisto =
        peso &&
        altura &&
        pesoNumero > 0 &&
        alturaNumero > 0
            ? (
                pesoNumero /
                (alturaNumero * alturaNumero)
            ).toFixed(2)
            : null;


    // =========================================
    // CARREGANDO
    // =========================================

    if (carregando) {

        return (

            <Layout>

                <p className="text-gray-500">
                    Carregando avaliação...
                </p>

            </Layout>

        );

    }


    // =========================================
    // TELA
    // =========================================

    return (

        <Layout>


            <button
                type="button"
                onClick={() =>
                    navigate(
                        "/avaliacoes"
                    )
                }
                disabled={salvando}
                className="mb-6 flex cursor-pointer items-center gap-2 text-purple-700 transition hover:text-purple-900 disabled:cursor-not-allowed disabled:opacity-50"
            >

                <ArrowLeft size={20} />

                Voltar para Avaliações

            </button>


            <div>

                <h1 className="text-4xl font-bold">
                    Editar Avaliação
                </h1>


                <p className="mt-2 mb-8 text-gray-500">
                    Atualize os dados da avaliação física.
                </p>


                <form
                    onSubmit={
                        handleAtualizarAvaliacao
                    }
                    className="space-y-6 rounded-2xl bg-white p-8 shadow-md"
                >


                    {/* ALUNO */}

                    <div>

                        <label className="mb-2 block font-medium text-gray-700">

                            Aluno

                        </label>


                        <div className="relative">

                            <User
                                size={18}
                                className="absolute top-4 left-4 text-gray-400"
                            />


                            <select
                                value={usuarioId}
                                onChange={(e) =>
                                    setUsuarioId(
                                        e.target.value
                                    )
                                }
                                disabled={salvando}
                                className="w-full rounded-xl border border-gray-300 py-3 pr-4 pl-11 focus:ring-2 focus:ring-purple-600 focus:outline-none disabled:bg-gray-100"
                            >

                                <option value="">
                                    Selecione um aluno
                                </option>


                                {alunos.map(
                                    (aluno) => (

                                        <option
                                            key={
                                                aluno.id
                                            }
                                            value={
                                                aluno.id
                                            }
                                        >

                                            {aluno.nome}

                                        </option>

                                    )
                                )}

                            </select>

                        </div>

                    </div>


                    {/* DATA */}

                    <div>

                        <label className="mb-2 block font-medium text-gray-700">

                            Data da Avaliação

                        </label>


                        <div className="relative">

                            <Calendar
                                size={18}
                                className="absolute top-4 left-4 text-gray-400"
                            />


                            <input
                                type="date"
                                value={
                                    dataAvaliacao
                                }
                                onChange={(e) =>
                                    setDataAvaliacao(
                                        e.target.value
                                    )
                                }
                                disabled={salvando}
                                className="w-full rounded-xl border border-gray-300 py-3 pr-4 pl-11 focus:ring-2 focus:ring-purple-600 focus:outline-none disabled:bg-gray-100"
                            />

                        </div>

                    </div>


                    {/* PESO E ALTURA */}

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">


                        <div>

                            <label className="mb-2 block font-medium text-gray-700">

                                Peso (kg)

                            </label>


                            <div className="relative">

                                <Weight
                                    size={18}
                                    className="absolute top-4 left-4 text-gray-400"
                                />


                                <input
                                    type="number"
                                    step="0.01"
                                    min="1"
                                    value={peso}
                                    onChange={(e) =>
                                        setPeso(
                                            e.target.value
                                        )
                                    }
                                    disabled={salvando}
                                    placeholder="Ex: 80.50"
                                    className="w-full rounded-xl border border-gray-300 py-3 pr-4 pl-11 focus:ring-2 focus:ring-purple-600 focus:outline-none disabled:bg-gray-100"
                                />

                            </div>

                        </div>


                        <div>

                            <label className="mb-2 block font-medium text-gray-700">

                                Altura (m)

                            </label>


                            <div className="relative">

                                <Ruler
                                    size={18}
                                    className="absolute top-4 left-4 text-gray-400"
                                />


                                <input
                                    type="number"
                                    step="0.01"
                                    min="0.50"
                                    value={altura}
                                    onChange={(e) =>
                                        setAltura(
                                            e.target.value
                                        )
                                    }
                                    disabled={salvando}
                                    placeholder="Ex: 1.75"
                                    className="w-full rounded-xl border border-gray-300 py-3 pr-4 pl-11 focus:ring-2 focus:ring-purple-600 focus:outline-none disabled:bg-gray-100"
                                />

                            </div>

                        </div>

                    </div>


                    {/* OBSERVAÇÕES */}

                    <div>

                        <label className="mb-2 block font-medium text-gray-700">

                            Observações

                        </label>


                        <div className="relative">

                            <FileText
                                size={18}
                                className="absolute top-4 left-4 text-gray-400"
                            />


                            <textarea
                                rows="4"
                                value={
                                    observacoes
                                }
                                onChange={(e) =>
                                    setObservacoes(
                                        e.target.value
                                    )
                                }
                                disabled={salvando}
                                placeholder="Digite observações da avaliação..."
                                className="w-full rounded-xl border border-gray-300 py-3 pr-4 pl-11 focus:ring-2 focus:ring-purple-600 focus:outline-none disabled:bg-gray-100"
                            />

                        </div>

                    </div>


                    {/* IMC */}

                    <div className="rounded-xl border border-purple-100 bg-purple-50 p-4">

                        <p className="text-sm text-purple-800">

                            O IMC será recalculado automaticamente com base no peso e na altura.

                        </p>


                        {imcPrevisto && (

                            <p className="mt-2 text-lg font-bold text-purple-900">

                                IMC previsto:{" "}
                                {imcPrevisto}

                            </p>

                        )}

                    </div>


                    {/* BOTÕES */}

                    <div className="flex justify-end gap-4 border-t pt-8">

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/avaliacoes"
                                )
                            }
                            disabled={salvando}
                            className="cursor-pointer rounded-xl border border-gray-300 px-8 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >

                            Cancelar

                        </button>


                        <button
                            type="submit"
                            disabled={salvando}
                            className="cursor-pointer rounded-xl bg-purple-700 px-8 py-3 font-semibold text-white transition hover:bg-purple-800 disabled:cursor-not-allowed disabled:bg-purple-400"
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