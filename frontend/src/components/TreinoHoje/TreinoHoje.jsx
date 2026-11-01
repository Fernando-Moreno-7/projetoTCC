
import {
    Play,        // Ícone para iniciar o treino
    Dumbbell,    // Ícone de musculação
    CheckCircle  // Ícone de treino concluído
} from "lucide-react";

// Hook utilizado para navegar entre páginas
import { useNavigate } from "react-router-dom";

// Componente que recebe os dados do treino através de props
export default function TreinoHoje({ treino }) {

    // Permite navegar para outras rotas do sistema
    const navigate = useNavigate();

    // =========================================
    // SEM TREINO
    // =========================================

    // Verifica se não existe um treino disponível
    if (!treino) {

        // Apresenta uma mensagem quando não existe treino
        return (

            <div className="rounded-2xl bg-white p-6 shadow-md">

                <div className="mb-6 flex items-center gap-3">

                    <Dumbbell
                        className="text-purple-700"
                        size={28}
                    />

                    <h2 className="text-2xl font-bold">
                        Treino de Hoje
                    </h2>

                </div>

                <p className="text-gray-500">
                    Nenhum treino agendado para hoje.
                </p>

            </div>

        );

    }

    // =========================================
    // DADOS
    // =========================================

    // Verifica se treino.exercicios é um array.
    // Se for, utiliza os exercícios recebidos.
    // Caso contrário, utiliza um array vazio.
    const exercicios =
        Array.isArray(treino.exercicios)
            ? treino.exercicios
            : [];

    // Verifica se o status do treino é "concluido".
    // Retorna true quando está concluído
    // e false quando não está.
    const treinoConcluido =
        treino.status === "concluido";

    // =========================================
    // INICIAR TREINO
    // =========================================

    function iniciarTreino() {

        // Impede a navegação caso o treino
        // já esteja concluído.
        if (treinoConcluido) {
            return;
        }

        // Direciona o aluno para a página
        // de iniciar treino.
        navigate(
            "/iniciar-treino"
        );

    }

    return (

        // Container principal do treino de hoje
        <div className="rounded-2xl bg-white p-6 shadow-md">

            {/* =====================================
                CABEÇALHO
            ===================================== */}

            <div className="mb-6 flex items-center gap-3">

                <Dumbbell
                    className="text-purple-700"
                    size={28}
                />

                <h2 className="text-2xl font-bold">
                    Treino de Hoje
                </h2>

            </div>

            {/* =====================================
                INFORMAÇÕES DO TREINO
            ===================================== */}

            <div className="space-y-2">

                <div className="flex items-center gap-3">

                    {/* Apresenta o nome do treino */}
                    <h3 className="text-xl font-semibold">
                        {treino.nome}
                    </h3>

                    {/* Apresenta o indicador verde
                        somente se o treino estiver concluído */}
                    {treinoConcluido && (

                        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                            Concluído
                        </span>

                    )}

                </div>

                {/* Apresenta a descrição somente
                    quando ela estiver disponível */}
                {treino.descricao && (

                    <p className="text-gray-500">
                        {treino.descricao}
                    </p>

                )}

            </div>

            {/* =====================================
                EXERCÍCIOS
            ===================================== */}

            <div className="mt-6 space-y-3">

                <h4 className="font-semibold text-gray-700">
                    Exercícios
                </h4>

                {/* Verifica se o array está vazio.
                    Se estiver, apresenta uma mensagem. */}
                {exercicios.length === 0 && (

                    <p className="text-gray-500">
                        Nenhum exercício cadastrado neste treino.
                    </p>

                )}

                {/* map percorre o array e cria
                    um elemento JSX para cada exercício */}
                {exercicios.map((item) => (

                    <div
                        // key identifica cada item da lista
                        // para ajudar o React na renderização
                        key={item.id}
                        className="flex items-center justify-between rounded-xl bg-gray-50 p-4"
                    >

                        <div className="flex items-center gap-3">

                            <Dumbbell
                                size={20}
                                className="text-purple-700"
                            />

                            <div>

                                {/* Optional chaining (?.)
                                    evita erro se item.exercicio
                                    for null ou undefined.

                                    || apresenta um texto alternativo
                                    caso o nome não esteja disponível. */}
                                <span className="font-medium">

                                    {item.exercicio?.nome ||
                                        "Exercício"}

                                </span>

                                {/* Apresenta o grupo muscular
                                    somente quando estiver disponível */}
                                {item.exercicio?.grupo_muscular && (

                                    <p className="text-sm text-gray-500">

                                        {
                                            item.exercicio
                                                .grupo_muscular
                                        }

                                    </p>

                                )}

                            </div>

                        </div>

                        {/* Apresenta a quantidade de séries
                            e repetições do exercício */}
                        <span className="text-gray-600">

                            {item.series} ×{" "}
                            {item.repeticoes}

                        </span>

                    </div>

                ))}

            </div>

            {/* =====================================
                AÇÃO DO TREINO
            ===================================== */}

            {/* Só apresenta a área de ação
                quando existem exercícios cadastrados */}
            {exercicios.length > 0 && (

                <div className="mt-8">

                    {/* Operador ternário:
                        se o treino estiver concluído,
                        apresenta a indicação verde.

                        Caso contrário, apresenta
                        o botão para iniciar o treino. */}
                    {treinoConcluido ? (

                        <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-100 py-3 font-semibold text-green-700">

                            <CheckCircle size={20} />

                            Treino concluído

                        </div>

                    ) : (

                        <button
                            type="button"

                            // Executa a função iniciarTreino
                            // quando o aluno clica no botão
                            onClick={iniciarTreino}

                            className="w-full cursor-pointer rounded-xl bg-purple-700 py-3 font-semibold text-white shadow-md transition duration-300 hover:bg-purple-800 hover:shadow-lg"
                        >

                            <div className="flex items-center justify-center gap-2">

                                <Play size={18} />

                                Iniciar Treino

                            </div>

                        </button>

                    )}

                </div>

            )}

        </div>

    );

}
