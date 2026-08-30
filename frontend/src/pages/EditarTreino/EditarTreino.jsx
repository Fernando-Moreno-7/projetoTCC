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

    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");

    const [exerciciosDisponiveis, setExerciciosDisponiveis] = useState([]);
    const [exerciciosTreino, setExerciciosTreino] = useState([]);

    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);

    useEffect(() => {

        carregarDados();

    }, [id]);

    async function carregarDados() {

        try {

            setCarregando(true);

            const responseTreino = await axios.get(
                `http://localhost:5000/treino/${id}`
            );

            setNome(responseTreino.data.nome || "");
            setDescricao(responseTreino.data.descricao || "");

            const responseExercicios = await axios.get(
                "http://localhost:5000/exercicio/list"
            );

            setExerciciosDisponiveis(responseExercicios.data);

            const responseTreinoExercicios = await axios.get(
                `http://localhost:5000/treino-exercicio/list?treino_id=${id}`
            );

            const exerciciosFormatados =
                responseTreinoExercicios.data.map((item) => ({
                    id: item.id,
                    exercicio_id: item.exercicio_id,
                    series: item.series,
                    repeticoes: item.repeticoes,
                    novo: false
                }));

            setExerciciosTreino(exerciciosFormatados);

        } catch (error) {

            console.error(error);

            alert("Erro ao carregar os dados do treino!");

            navigate("/treinos");

        } finally {

            setCarregando(false);

        }
    }

    function adicionarExercicio() {

        setExerciciosTreino([
            ...exerciciosTreino,
            {
                id: null,
                exercicio_id: "",
                series: "",
                repeticoes: "",
                novo: true
            }
        ]);
    }

    function alterarExercicio(index, campo, valor) {

        const novaLista = [...exerciciosTreino];

        novaLista[index][campo] = valor;

        setExerciciosTreino(novaLista);
    }

    async function removerExercicio(index) {

        const exercicio = exerciciosTreino[index];

        if (!exercicio.novo && exercicio.id) {

            const confirmar = window.confirm(
                "Deseja realmente remover este exercício do treino?"
            );

            if (!confirmar) {
                return;
            }

            try {

                await axios.delete(
                    "http://localhost:5000/treino-exercicio/delete",
                    {
                        data: {
                            id: exercicio.id
                        }
                    }
                );

            } catch (error) {

                console.error(error);

                if (error.response) {

                    alert(
                        error.response.data.message ||
                        "Erro ao remover exercício!"
                    );

                } else {

                    alert(
                        "Não foi possível conectar ao servidor."
                    );
                }

                return;
            }
        }

        const novaLista = exerciciosTreino.filter(
            (_, i) => i !== index
        );

        setExerciciosTreino(novaLista);
    }

    async function handleEditarTreino(e) {

        e.preventDefault();

        if (!nome) {

            alert("Digite o nome do treino!");

            return;
        }

        const exercicioInvalido = exerciciosTreino.some(
            (exercicio) =>
                !exercicio.exercicio_id ||
                !exercicio.series ||
                !exercicio.repeticoes
        );

        if (exercicioInvalido) {

            alert(
                "Selecione todos os exercícios e informe séries e repetições."
            );

            return;
        }

        try {

            setSalvando(true);

            await axios.post(
                "http://localhost:5000/treino/update",
                {
                    idTreino: Number(id),
                    nome,
                    descricao
                }
            );

            for (const exercicio of exerciciosTreino) {

                if (exercicio.novo) {

                    await axios.post(
                        "http://localhost:5000/treino-exercicio/add",
                        {
                            treino_id: Number(id),
                            exercicio_id: Number(
                                exercicio.exercicio_id
                            ),
                            series: Number(
                                exercicio.series
                            ),
                            repeticoes: Number(
                                exercicio.repeticoes
                            )
                        }
                    );

                } else {

                    await axios.post(
                        "http://localhost:5000/treino-exercicio/update",
                        {
                            id: exercicio.id,
                            series: Number(
                                exercicio.series
                            ),
                            repeticoes: Number(
                                exercicio.repeticoes
                            )
                        }
                    );
                }
            }

            alert(
                "Treino e exercícios atualizados com sucesso!"
            );

            navigate("/treinos");

        } catch (error) {

            console.error(error);

            if (error.response) {

                alert(
                    error.response.data.message ||
                    "Erro ao atualizar treino!"
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
                onClick={() => navigate("/treinos")}
                className="flex items-center gap-2 text-purple-700 hover:text-purple-900 mb-6 transition"
            >
                <ArrowLeft size={20} />

                <span>Voltar para Treinos</span>
            </button>

            <div>

                <h1 className="text-4xl font-bold">
                    Editar Treino
                </h1>

                <p className="text-gray-500 mt-2 mb-8">
                    Atualize os dados e exercícios do treino.
                </p>

                <form
                    onSubmit={handleEditarTreino}
                    className="bg-white rounded-2xl shadow-md p-8 space-y-6"
                >

                    <div>

                        <label className="block text-gray-700 font-medium mb-2">
                            Nome do Treino
                        </label>

                        <div className="relative">

                            <Dumbbell
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type="text"
                                value={nome}
                                onChange={(e) =>
                                    setNome(e.target.value)
                                }
                                placeholder="Nome do treino"
                                className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                            />

                        </div>

                    </div>

                    <div>

                        <label className="block text-gray-700 font-medium mb-2">
                            Descrição
                        </label>

                        <div className="relative">

                            <FileText
                                size={18}
                                className="absolute left-4 top-6 text-gray-400"
                            />

                            <textarea
                                rows="4"
                                value={descricao}
                                onChange={(e) =>
                                    setDescricao(e.target.value)
                                }
                                placeholder="Descrição do treino"
                                className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                            />

                        </div>

                    </div>

                    <div className="border-t pt-8">

                        <div className="flex justify-between items-center mb-6">

                            <h2 className="text-2xl font-bold">
                                Exercícios
                            </h2>

                            <button
                                type="button"
                                onClick={adicionarExercicio}
                                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-xl transition"
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
                                            className="border border-gray-200 rounded-xl p-5"
                                        >

                                            <div className="flex justify-between items-center mb-4">

                                                <h3 className="font-semibold text-gray-700">
                                                    Exercício {index + 1}
                                                </h3>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removerExercicio(index)
                                                    }
                                                    className="text-red-500 hover:text-red-700 transition"
                                                >
                                                    <Trash2 size={20} />
                                                </button>

                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                                <div>

                                                    <label className="block text-sm font-medium text-gray-600 mb-2">
                                                        Exercício
                                                    </label>

                                                    <select
                                                        value={
                                                            exercicio.exercicio_id
                                                        }
                                                        disabled={
                                                            !exercicio.novo
                                                        }
                                                        onChange={(e) =>
                                                            alterarExercicio(
                                                                index,
                                                                "exercicio_id",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-600"
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
                                                                    {item.nome} - {item.grupo_muscular}
                                                                </option>

                                                            )
                                                        )}

                                                    </select>

                                                </div>

                                                <div>

                                                    <label className="block text-sm font-medium text-gray-600 mb-2">
                                                        Séries
                                                    </label>

                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={
                                                            exercicio.series
                                                        }
                                                        onChange={(e) =>
                                                            alterarExercicio(
                                                                index,
                                                                "series",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                                    />

                                                </div>

                                                <div>

                                                    <label className="block text-sm font-medium text-gray-600 mb-2">
                                                        Repetições
                                                    </label>

                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={
                                                            exercicio.repeticoes
                                                        }
                                                        onChange={(e) =>
                                                            alterarExercicio(
                                                                index,
                                                                "repeticoes",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                                    />

                                                </div>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </div>

                    <div className="flex justify-end gap-4 pt-8 border-t">

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/treinos")
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
                                : "Salvar Alterações"
                            }
                        </button>

                    </div>

                </form>

            </div>

        </Layout>

    );
}