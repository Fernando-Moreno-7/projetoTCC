import { useNavigate } from "react-router-dom";

// Importa os ícones utilizados no menu lateral
import {
    LayoutDashboard,
    Dumbbell,
    CalendarDays,
    ClipboardCheck,
    Users,
    LogOut,
    Activity,
    Play,
    TrendingUp
} from "lucide-react";

// Componente responsável pelo menu lateral do EvolutionFit
export default function Sidebar() {
    // Permite navegar entre as páginas
    const navigate = useNavigate();

    // Recupera o tipo do usuário armazenado no navegador
    const tipoUsuario = localStorage.getItem("tipoUsuario");

    // Realiza o logout e retorna para a tela de login
    function sair() {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("tipoUsuario");

        navigate("/");
    }

    return (
        <aside className="flex h-screen w-64 flex-col bg-purple-800 text-white">

            {/* Cabeçalho com o nome do aplicativo */}
            <div className="border-b border-purple-700 p-6">
                <h1 className="text-3xl font-bold">
                    EvolutionFit
                </h1>
            </div>

            {/* Área de navegação do menu lateral */}
            <nav className="flex-1 p-5">
                <ul className="space-y-4">

                    {/* Opção disponível para todos os usuários */}
                    <li
                        onClick={() => navigate("/dashboard")}
                        className="flex cursor-pointer items-center gap-3 transition hover:text-purple-300"
                    >
                        <LayoutDashboard size={20} />
                        Painel
                    </li>

                    {/* Exibe estas opções somente para o personal */}
                    {tipoUsuario === "personal" && (
                        <>
                            <li
                                onClick={() => navigate("/alunos")}
                                className="flex cursor-pointer items-center gap-3 transition hover:text-purple-300"
                            >
                                <Users size={20} />
                                Alunos
                            </li>

                            <li
                                onClick={() => navigate("/treinos")}
                                className="flex cursor-pointer items-center gap-3 transition hover:text-purple-300"
                            >
                                <Dumbbell size={20} />
                                Treinos
                            </li>

                            <li
                                onClick={() => navigate("/exercicios")}
                                className="flex cursor-pointer items-center gap-3 transition hover:text-purple-300"
                            >
                                <Activity size={20} />
                                Exercícios
                            </li>

                            <li
                                onClick={() => navigate("/agenda")}
                                className="flex cursor-pointer items-center gap-3 transition hover:text-purple-300"
                            >
                                <CalendarDays size={20} />
                                Agenda
                            </li>

                            <li
                                onClick={() => navigate("/avaliacoes")}
                                className="flex cursor-pointer items-center gap-3 transition hover:text-purple-300"
                            >
                                <ClipboardCheck size={20} />
                                Avaliações
                            </li>
                        </>
                    )}

                    {/* Exibe estas opções somente para o aluno */}
                    {tipoUsuario === "aluno" && (
                        <>
                            <li
                                onClick={() => navigate("/meu-treino")}
                                className="flex cursor-pointer items-center gap-3 transition hover:text-purple-300"
                            >
                                <Dumbbell size={20} />
                                Meu Treino
                            </li>

                            <li
                                onClick={() => navigate("/iniciar-treino")}
                                className="flex cursor-pointer items-center gap-3 transition hover:text-purple-300"
                            >
                                <Play size={20} />
                                Iniciar Treino
                            </li>

                            <li
                                onClick={() => navigate("/minha-evolucao")}
                                className="flex cursor-pointer items-center gap-3 transition hover:text-purple-300"
                            >
                                <TrendingUp size={20} />
                                Minha Evolução
                            </li>
                        </>
                    )}

                </ul>
            </nav>

            {/* Botão para sair do aplicativo */}
            <div className="border-t border-purple-700 p-5">
                <button
                    type="button"
                    onClick={sair}
                    className="flex cursor-pointer items-center gap-3 transition hover:text-red-300"
                >
                    <LogOut size={20} />
                    Sair
                </button>
            </div>

        </aside>
    );
}
