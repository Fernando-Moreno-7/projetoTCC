import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Layout from "../../components/Layout/Layout";

import {
    Dumbbell,
    FileText,
    ArrowLeft,
    Trash2,
    Plus
} from "lucide-react";

export default function CadastrarTreino() {

    const navigate = useNavigate();

    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");

    const [exerciciosDisponiveis, setExerciciosDisponiveis] = useState([]);

    const [exerciciosSelecionados, setExerciciosSelecionados] = useState([
        {
            exercicio_id: "",
            series: "",
            repeticoes: ""
        }
    ]);

    const [carregando, setCarregando] = useState(false);
    const [carregandoExercicios, setCarregandoExercicios] = useState(true);

    useEffect(() => {

        buscarExercicios();

    }, []);

    async function buscarExercicios() {

        try {

            const response = await axios.get(
                "http://localhost:5000/exercicio/list"
            );

            setExerciciosDisponiveis(response.data);

        } catch (error) {

            console.error(error);

            alert("Erro ao buscar exercícios!");

        } finally {

            setCarregandoExercicios(false);

        }
    }

    function adicionarExercicio() {

        setExerciciosSelecionados([
            ...exerciciosSelecionados,
            {
                exercicio_id: "",
                series: "",
                repeticoes: ""
            }
        ]);
    }

    function removerExercicio(index) {

        if (exerciciosSelecionados.length === 1) {
            return;
        }

        const novaLista = exerciciosSelecionados.filter(
            (_, i) => i !== index
        );

        setExerciciosSelecionados(novaLista);
    }

    function alterarExercicio(index, campo, valor) {

        const novaLista = [...exerciciosSelecionados];

        novaLista[index][campo] = valor;

        setExerciciosSelecionados(novaLista);
    }

    async function handleSalvarTreino(e) {

        e.preventDefault();

        if (!nome) {

            alert("Digite o nome do treino!");

            return;
        }

        const exerciciosInvalidos = exerciciosSelecionados.some(
            (exercicio) =>
                !exercicio.exercicio_id ||
                !exercicio.series ||
                !exercicio.repeticoes
        );

        if (exerciciosInvalidos) {

            alert(
                "Selecione o exercício e informe séries e repetições."
            );

            return;
        }

        try {

            setCarregando(true);

            const responseTreino = await axios.post(
                "http://localhost:5000/treino/create",
                {
                    nome,
                    descricao
                }
            );

            const treinoId = responseTreino.data.treinoId;

            if (!treinoId) {

                alert(
                    "O treino foi criado, mas o backend não retornou o ID do treino."
                );

                return;
            }

            for (const exercicio of exerciciosSelecionados) {

                await axios.post(
                    "http://localhost:5000/treino-exercicio/add",
                    {
                        treino_id: treinoId,
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
            }

            alert(
                "Treino e exercícios cadastrados com sucesso!"
            );

            navigate("/treinos");

        } catch (error) {

            console.error(error);

            if (error.response) {

                alert(
                    error.response.data.message ||
                    "Erro ao cadastrar treino!"
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
                    Cadastrar Treino
                </h1>

                <p className="text-gray-500 mt-2 mb-8">
                    Cadastre um novo treino para seus alunos.
                </p>

                <form
                    onSubmit={handleSalvarTreino}
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
                                placeholder="Ex.: Treino A"
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
                                placeholder="Descreva o treino..."
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

                        {carregandoExercicios ? (

                            <p className="text-gray-500">
                                Carregando exercícios...
                            </p>

                        ) : exerciciosDisponiveis.length === 0 ? (

                            <p className="text-red-500">
                                Nenhum exercício cadastrado.
                            </p>

                        ) : (

                            <div className="space-y-4">

                                {exerciciosSelecionados.map(
                                    (exercicio, index) => (

                                        <div
                                            key={index}
                                            className="border border-gray-200 rounded-xl p-5"
                                        >

                                            <div className="flex justify-between items-center mb-4">

                                                <h3 className="font-semibold text-gray-700">
                                                    Exercício {index + 1}
                                                </h3>

                                                {exerciciosSelecionados.length > 1 && (

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removerExercicio(index)
                                                        }
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>

                                                )}

                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                                <div>

                                                    <label className="block text-sm font-medium text-gray-600 mb-2">
                                                        Exercício
                                                    </label>

                                                    <select
                                                        value={exercicio.exercicio_id}
                                                        onChange={(e) =>
                                                            alterarExercicio(
                                                                index,
                                                                "exercicio_id",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
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
                                                        value={exercicio.series}
                                                        onChange={(e) =>
                                                            alterarExercicio(
                                                                index,
                                                                "series",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Ex.: 4"
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
                                                        value={exercicio.repeticoes}
                                                        onChange={(e) =>
                                                            alterarExercicio(
                                                                index,
                                                                "repeticoes",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Ex.: 12"
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
                            disabled={
                                carregando ||
                                carregandoExercicios ||
                                exerciciosDisponiveis.length === 0
                            }
                            className="bg-purple-700 hover:bg-purple-800 disabled:bg-purple-400 text-white px-8 py-3 rounded-xl font-semibold transition"
                        >
                            {carregando
                                ? "Salvando..."
                                : "Salvar Treino"
                            }
                        </button>

                    </div>

                </form>

            </div>

        </Layout>

    );
}