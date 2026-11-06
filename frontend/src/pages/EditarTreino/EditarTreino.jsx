import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import Layout from "../../components/Layout/Layout";

import {
    ArrowLeft,
    Dumbbell,
    FileText,
    Plus,
    Trash2
} from "lucide-react";

export default function EditarTreino() {
    const navigate = useNavigate();
    const { id } = useParams();

    // Dados do formulário.
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");

    // Exercícios disponíveis e associados ao treino.
    const [exerciciosDisponiveis, setExerciciosDisponiveis] =
        useState([]);

    const [exerciciosTreino, setExerciciosTreino] = useState([]);

    // IDs das associações removidas pelo usuário.
    const [exerciciosRemovidos, setExerciciosRemovidos] =
        useState([]);

    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);

    // Carrega os dados ao abrir a página ou mudar o ID.
    // A função fica dentro do efeito para evitar a dependência ausente.
    useEffect(() => {
        let ativo = true;
        const controller = new AbortController();

        async function carregarDados() {
            setCarregando(true);

            try {
                const config = {
                    signal: controller.signal
                };

                const [
                    responseTreino,
                    responseExercicios,
                    responseTreinoExercicios
                ] = await Promise.all([
                    axios.get(
                        `http://localhost:5000/treino/${id}`,
                        config
                    ),
                    axios.get(
                        "http://localhost:5000/exercicio/list",
                        config
                    ),
                    axios.get(
                        `http://localhost:5000/treino-exercicio/list?treino_id=${id}`,
                        config
                    )
                ]);

                // Ignora respostas de um carregamento cancelado.
                if (!ativo) {
                    return;
                }

                setNome(responseTreino.data.nome || "");
                setDescricao(responseTreino.data.descricao || "");

                setExerciciosDisponiveis(responseExercicios.data);

                const exerciciosFormatados =
                    responseTreinoExercicios.data.map((item) => ({
                        id: item.id,
                        exercicio_id: item.exercicio_id,
                        series: item.series,
                        repeticoes: item.repeticoes,
                        novo: false
                    }));

                setExerciciosTreino(exerciciosFormatados);
                setExerciciosRemovidos([]);

            } catch (error) {
                if (!ativo || axios.isCancel(error)) {
                    return;
                }

                console.error(error);
                alert("Erro ao carregar os dados do treino!");
                navigate("/treinos");

            } finally {
                if (ativo) {
                    setCarregando(false);
                }
            }
        }

        carregarDados();

        // Cancela as consultas ao sair da página ou mudar o treino.
        return () => {
            ativo = false;
            controller.abort();
        };
    }, [id, navigate]);

    // Adiciona um exercício ainda não salvo.
    function adicionarExercicio() {
        setExerciciosTreino((listaAtual) => [
            ...listaAtual,
            {
                id: null,
                exercicio_id: "",
                series: "",
                repeticoes: "",
                novo: true
            }
        ]);
    }

    // Atualiza um campo do exercício selecionado.
    function alterarExercicio(index, campo, valor) {
        setExerciciosTreino((listaAtual) =>
            listaAtual.map((exercicio, posicao) =>
                posicao === index
                    ? { ...exercicio, [campo]: valor }
                    : exercicio
            )
        );
    }

    // Remove da interface e registra associações a excluir.
    function removerExercicio(index) {
        const exercicio = exerciciosTreino[index];

        if (
            !window.confirm(
                "Deseja realmente remover este exercício do treino?"
            )
        ) {
            return;
        }

        if (!exercicio.novo && exercicio.id) {
            setExerciciosRemovidos((listaAtual) => [
                ...listaAtual,
                exercicio.id
            ]);
        }

        setExerciciosTreino((listaAtual) =>
            listaAtual.filter((_, posicao) => posicao !== index)
        );
    }

    // Salva os dados usando as rotas existentes da aplicação.
    async function handleEditarTreino(event) {
        event.preventDefault();

        if (salvando) {
            return;
        }

        if (!nome.trim()) {
            alert("Digite o nome do treino!");
            return;
        }

        if (exerciciosTreino.length === 0) {
            alert("Adicione pelo menos um exercício ao treino!");
            return;
        }

        const exercicioInvalido = exerciciosTreino.some(
            (exercicio) =>
                !exercicio.exercicio_id ||
                !Number.isSafeInteger(Number(exercicio.series)) ||
                Number(exercicio.series) <= 0 ||
                !Number.isSafeInteger(Number(exercicio.repeticoes)) ||
                Number(exercicio.repeticoes) <= 0
        );

        if (exercicioInvalido) {
            alert(
                "Selecione todos os exercícios e informe séries " +
                "e repetições inteiras maiores que zero."
            );

            return;
        }

        const idsExercicios = exerciciosTreino.map(
            (exercicio) => Number(exercicio.exercicio_id)
        );

        if (new Set(idsExercicios).size !== idsExercicios.length) {
            alert(
                "Não é possível adicionar o mesmo exercício " +
                "mais de uma vez no treino."
            );

            return;
        }

        try {
            setSalvando(true);

            // Atualiza os dados principais.
            await axios.post(
                "http://localhost:5000/treino/update",
                {
                    idTreino: Number(id),
                    nome: nome.trim(),
                    descricao: descricao.trim()
                }
            );

            // Exclui as associações removidas.
            for (const idExercicioRemovido of exerciciosRemovidos) {
                await axios.delete(
                    "http://localhost:5000/treino-exercicio/delete",
                    {
                        data: {
                            id: idExercicioRemovido
                        }
                    }
                );
            }

            // Adiciona novos exercícios ou atualiza os existentes.
            for (const exercicio of exerciciosTreino) {
                if (exercicio.novo) {
                    await axios.post(
                        "http://localhost:5000/treino-exercicio/add",
                        {
                            treino_id: Number(id),
                            exercicio_id: Number(
                                exercicio.exercicio_id
                            ),
                            series: Number(exercicio.series),
                            repeticoes: Number(exercicio.repeticoes)
                        }
                    );
                } else {
                    await axios.post(
                        "http://localhost:5000/treino-exercicio/update",
                        {
                            id: exercicio.id,
                            series: Number(exercicio.series),
                            repeticoes: Number(exercicio.repeticoes)
                        }
                    );
                }
            }

            alert("Treino e exercícios atualizados com sucesso!");
            navigate("/treinos");

        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                (error.response
                    ? "Erro ao atualizar treino!"
                    : "Não foi possível conectar ao servidor.")
            );

        } finally {
            setSalvando(false);
        }
    }

    if (carregando) {
        return (
            <Layout>
                <p className="text-gray-500">
                    Carregando treino...
                </p>
            </Layout>
        );
    }

    return (
        <Layout>
            <button
                type="button"
                onClick={() => navigate("/treinos")}
                disabled={salvando}
                className="mb-6 flex items-center gap-2 text-purple-700 transition hover:text-purple-900 disabled:opacity-50"
            >
                <ArrowLeft size={20} />
                Voltar para Treinos
            </button>

            <div>
                <h1 className="mb-2 text-3xl font-bold sm:text-4xl">
                    Editar Treino
                </h1>

                <p className="mb-8 text-gray-500">
                    Atualize as informações e os exercícios do treino.
                </p>

                <form
                    onSubmit={handleEditarTreino}
                    className="space-y-6 rounded-2xl bg-white p-4 shadow-md sm:p-8"
                >
                    {/* Nome do treino */}
                    <div>
                        <label
                            htmlFor="nome-treino"
                            className="mb-2 block font-medium text-gray-700"
                        >
                            Nome do Treino
                        </label>

                        <div className="relative">
                            <Dumbbell
                                size={18}
                                aria-hidden="true"
                                className="absolute top-4 left-4 text-gray-400"
                            />

                            <input
                                id="nome-treino"
                                type="text"
                                value={nome}
                                onChange={(event) =>
                                    setNome(event.target.value)
                                }
                                disabled={salvando}
                                placeholder="Nome do treino"
                                className="w-full rounded-xl border border-gray-300 py-3 pr-4 pl-11 focus:ring-2 focus:ring-purple-600 focus:outline-none disabled:bg-gray-100"
                            />
                        </div>
                    </div>

                    {/* Descrição */}
                    <div>
                        <label
                            htmlFor="descricao-treino"
                            className="mb-2 block font-medium text-gray-700"
                        >
                            Descrição
                        </label>

                        <div className="relative">
                            <FileText
                                size={18}
                                aria-hidden="true"
                                className="absolute top-6 left-4 text-gray-400"
                            />

                            <textarea
                                id="descricao-treino"
                                rows={4}
                                value={descricao}
                                onChange={(event) =>
                                    setDescricao(event.target.value)
                                }
                                disabled={salvando}
                                placeholder="Descrição do treino"
                                className="w-full rounded-xl border border-gray-300 py-3 pr-4 pl-11 focus:ring-2 focus:ring-purple-600 focus:outline-none disabled:bg-gray-100"
                            />
                        </div>
                    </div>

                    {/* Exercícios associados */}
                    <div className="border-t pt-8">
                        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <h2 className="text-2xl font-bold">
                                Exercícios
                            </h2>

                            <button
                                type="button"
                                onClick={adicionarExercicio}
                                disabled={salvando}
                                className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-green-500 px-5 py-2 text-white transition hover:bg-green-600 disabled:opacity-50"
                            >
                                <Plus size={18} />
                                Adicionar Exercício
                            </button>
                        </div>

                        {exerciciosTreino.length === 0 ? (
                            <p className="text-gray-500">
                                Nenhum exercício adicionado ao treino.
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {exerciciosTreino.map(
                                    (exercicio, index) => (
                                        <div
                                            key={
                                                exercicio.id ||
                                                `novo-${index}`
                                            }
                                            className="rounded-xl border border-gray-200 p-5"
                                        >
                                            <div className="mb-4 flex items-center justify-between">
                                                <h3 className="font-semibold text-gray-700">
                                                    Exercício {index + 1}
                                                </h3>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removerExercicio(index)
                                                    }
                                                    disabled={salvando}
                                                    aria-label={`Remover exercício ${index + 1}`}
                                                    className="flex h-11 w-11 items-center justify-center text-red-500 transition hover:text-red-700 disabled:opacity-50"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                                <div>
                                                    <label
                                                        htmlFor={`exercicio-${index}`}
                                                        className="mb-2 block text-sm font-medium text-gray-600"
                                                    >
                                                        Exercício
                                                    </label>

                                                    <select
                                                        id={`exercicio-${index}`}
                                                        value={
                                                            exercicio.exercicio_id
                                                        }
                                                        disabled={
                                                            !exercicio.novo ||
                                                            salvando
                                                        }
                                                        onChange={(event) =>
                                                            alterarExercicio(
                                                                index,
                                                                "exercicio_id",
                                                                event.target.value
                                                            )
                                                        }
                                                        className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-purple-600 focus:outline-none disabled:bg-gray-100"
                                                    >
                                                        <option value="">
                                                            Selecione
                                                        </option>

                                                        {exerciciosDisponiveis.map(
                                                            (item) => (
                                                                <option
                                                                    key={item.id}
                                                                    value={item.id}
                                                                >
                                                                    {item.nome}
                                                                    {" - "}
                                                                    {item.grupo_muscular}
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label
                                                        htmlFor={`series-${index}`}
                                                        className="mb-2 block text-sm font-medium text-gray-600"
                                                    >
                                                        Séries
                                                    </label>

                                                    <input
                                                        id={`series-${index}`}
                                                        type="number"
                                                        min="1"
                                                        step="1"
                                                        value={exercicio.series}
                                                        disabled={salvando}
                                                        onChange={(event) =>
                                                            alterarExercicio(
                                                                index,
                                                                "series",
                                                                event.target.value
                                                            )
                                                        }
                                                        className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-purple-600 focus:outline-none disabled:bg-gray-100"
                                                    />
                                                </div>

                                                <div>
                                                    <label
                                                        htmlFor={`repeticoes-${index}`}
                                                        className="mb-2 block text-sm font-medium text-gray-600"
                                                    >
                                                        Repetições
                                                    </label>

                                                    <input
                                                        id={`repeticoes-${index}`}
                                                        type="number"
                                                        min="1"
                                                        step="1"
                                                        value={
                                                            exercicio.repeticoes
                                                        }
                                                        disabled={salvando}
                                                        onChange={(event) =>
                                                            alterarExercicio(
                                                                index,
                                                                "repeticoes",
                                                                event.target.value
                                                            )
                                                        }
                                                        className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-purple-600 focus:outline-none disabled:bg-gray-100"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </div>

                    {/* Ações do formulário */}
                    <div className="flex flex-col gap-4 border-t pt-8 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={() => navigate("/treinos")}
                            disabled={salvando}
                            className="rounded-xl border border-gray-300 px-8 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={salvando}
                            className="rounded-xl bg-purple-700 px-8 py-3 font-semibold text-white transition hover:bg-purple-800 disabled:bg-purple-400"
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