/*
 * Componente Sidebar
 *
 * Apresenta os links de navegação de cada perfil.
 * No celular, o menu pode ser aberto e fechado.
 * No computador, permanece visível na lateral.
 */

// Controla a abertura do menu no celular.
import { useState } from "react";

// NavLink cria links e identifica a página atual.
// useNavigate permite redirecionar após sair.
import { NavLink, useNavigate } from "react-router-dom";

// Ícones utilizados na navegação.
import {
    LayoutDashboard,
    Dumbbell,
    CalendarDays,
    ClipboardCheck,
    Users,
    LogOut,
    Activity,
    Play,
    TrendingUp,
    Menu,
    X
} from "lucide-react";

export default function Sidebar() {

    // Permite navegar para o login após o logout.
    const navigate = useNavigate();

    // O menu começa fechado no celular.
    const [menuAberto, setMenuAberto] = useState(false);

    // Define quais opções serão apresentadas.
    // A autorização das requisições continua sendo feita pela API.
    const tipoUsuario = localStorage.getItem("tipoUsuario");

    // O painel aparece para os dois perfis.
    const itensComuns = [
        {
            caminho: "/dashboard",
            titulo: "Painel",
            icone: LayoutDashboard
        }
    ];

    // Opções de gerenciamento do personal.
    const itensPersonal = [
        {
            caminho: "/alunos",
            titulo: "Alunos",
            icone: Users
        },
        {
            caminho: "/treinos",
            titulo: "Treinos",
            icone: Dumbbell
        },
        {
            caminho: "/exercicios",
            titulo: "Exercícios",
            icone: Activity
        },
        {
            caminho: "/agenda",
            titulo: "Agenda",
            icone: CalendarDays
        },
        {
            caminho: "/avaliacoes",
            titulo: "Avaliações",
            icone: ClipboardCheck
        }
    ];

    // Opções de acompanhamento e execução do aluno.
    const itensAluno = [
        {
            caminho: "/meu-treino",
            titulo: "Meu Treino",
            icone: Dumbbell
        },
        {
            caminho: "/iniciar-treino",
            titulo: "Iniciar Treino",
            icone: Play
        },
        {
            caminho: "/minha-evolucao",
            titulo: "Minha Evolução",
            icone: TrendingUp
        }
    ];

    // Seleciona somente os links do perfil identificado.
    const itensPerfil =
        tipoUsuario === "personal"
            ? itensPersonal
            : tipoUsuario === "aluno"
                ? itensAluno
                : [];

    // Reúne os links comuns e os links específicos do perfil.
    const itensMenu = [...itensComuns, ...itensPerfil];

    // Fecha o menu após selecionar uma página no celular.
    function fecharMenu() {
        setMenuAberto(false);
    }

    // Encerra a sessão armazenada no navegador.
    function sair() {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("tipoUsuario");

        fecharMenu();

        // replace evita manter a página atual no histórico imediato.
        navigate("/", { replace: true });
    }

    return (
        // No celular, ocupa a largura disponível acima do conteúdo.
        // No computador, utiliza largura fixa e altura da janela.
        <aside className="w-full shrink-0 bg-purple-800 text-white lg:sticky lg:top-0 lg:flex lg:h-dvh lg:w-64 lg:flex-col lg:overflow-y-auto">

            {/* Nome do aplicativo e botão do menu móvel */}
            <div className="flex items-center justify-between gap-3 border-b border-purple-700 p-4 lg:p-6">
                <h1 className="text-2xl font-bold lg:text-3xl">
                    EvolutionFit
                </h1>

                {/* Botão acessível por mouse, toque e teclado */}
                <button
                    type="button"
                    aria-label={
                        menuAberto
                            ? "Fechar menu de navegação"
                            : "Abrir menu de navegação"
                    }
                    aria-expanded={menuAberto}
                    aria-controls="menu-principal"
                    onClick={() =>
                        setMenuAberto((aberto) => !aberto)
                    }
                    className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg hover:bg-purple-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:hidden"
                >
                    {menuAberto ? (
                        <X size={24} aria-hidden="true" />
                    ) : (
                        <Menu size={24} aria-hidden="true" />
                    )}
                </button>
            </div>

            {/* No celular, aparece somente quando o menu está aberto.
                No computador, permanece visível. */}
            <div
                id="menu-principal"
                onKeyDown={(event) => {
                    // Escape fecha o menu e devolve o foco ao botão.
                    if (event.key === "Escape" && menuAberto) {
                        fecharMenu();

                        event.currentTarget
                            .previousElementSibling
                            ?.querySelector("button")
                            ?.focus();
                    }
                }}
                className={`${
                    menuAberto ? "flex" : "hidden"
                } flex-col lg:flex lg:min-h-0 lg:flex-1`}
            >

                {/* Links de navegação */}
                <nav
                    aria-label="Navegação principal"
                    className="flex-1 p-4 lg:p-5"
                >
                    <ul className="space-y-2">
                        {itensMenu.map((item) => {

                            // Cada item informa qual ícone será exibido.
                            const Icone = item.icone;

                            return (
                                <li key={item.caminho}>

                                    {/* NavLink permite navegação por teclado
                                        e marca a página atual com aria-current. */}
                                    <NavLink
                                        to={item.caminho}
                                        onClick={fecharMenu}
                                        className={({ isActive }) =>
                                            `flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                                                isActive
                                                    ? "bg-purple-700 font-semibold"
                                                    : "hover:bg-purple-700"
                                            }`
                                        }
                                    >
                                        <Icone
                                            size={20}
                                            aria-hidden="true"
                                            className="shrink-0"
                                        />

                                        <span>{item.titulo}</span>
                                    </NavLink>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Botão de saída ao final do menu */}
                <div className="border-t border-purple-700 p-4 lg:p-5">
                    <button
                        type="button"
                        onClick={sair}
                        className="flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-purple-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                        <LogOut
                            size={20}
                            aria-hidden="true"
                            className="shrink-0"
                        />

                        Sair
                    </button>
                </div>
            </div>
        </aside>
    );
}