
/*
 * Componente Sidebar
 *
 * Responsável pelo menu lateral do EvolutionFit.
 *
 * Permite navegar entre as páginas do aplicativo,
 * apresenta opções diferentes para personal e aluno
 * e disponibiliza a função de logout.
 *
 * Utiliza:
 * - React Router para navegação.
 * - Lucide React para os ícones.
 * - Tailwind CSS para estilização.
 */

// Importa o hook responsável pela navegação.
import { useNavigate } from "react-router-dom";

// Importa os ícones utilizados no menu lateral.
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

// Exporta o componente Sidebar.
export default function Sidebar() {

    // =========================================
    // NAVEGAÇÃO
    // =========================================

    // useNavigate permite navegar entre
    // as páginas do EvolutionFit.
    const navigate = useNavigate();

    // =========================================
    // IDENTIFICAR TIPO DE USUÁRIO
    // =========================================

    // Recupera o tipo de usuário armazenado
    // no navegador após o login.
    //
    // Valores esperados:
    // "personal" ou "aluno".
    const tipoUsuario = localStorage.getItem("tipoUsuario");

    // =========================================
    // FUNÇÃO DE LOGOUT
    // =========================================

    // Executada quando o usuário clica em Sair.
    function sair() {

        // Remove o token armazenado no navegador.
        localStorage.removeItem("token");

        // Remove o ID do usuário.
        localStorage.removeItem("userId");

        // Remove o tipo de usuário.
        localStorage.removeItem("tipoUsuario");

        // Redireciona para a tela de login.
        navigate("/");
    }

    // =========================================
    // INTERFACE DO MENU LATERAL
    // =========================================

    return (

        // aside: representa a área lateral.
        //
        // sticky: mantém o menu posicionado
        // durante a rolagem, conforme o contêiner.
        //
        // top-0: posiciona no topo.
        // flex: utiliza Flexbox.
        // h-screen: altura da tela.
        // w-64: largura do menu.
        // shrink-0: impede que o menu encolha.
        // flex-col: organiza elementos em coluna.
        // overflow-y-auto: permite rolagem vertical.
        // bg-purple-800: fundo roxo.
        // text-white: texto branco.
        <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col overflow-y-auto bg-purple-800 text-white">

            {/* =====================================
                CABEÇALHO DO APLICATIVO
               ===================================== */}

            {/* border-b: adiciona borda inferior.
                border-purple-700: cor da borda.
                p-6: espaçamento interno. */}
            <div className="border-b border-purple-700 p-6">

                {/* Nome do aplicativo.
                    text-3xl: tamanho do texto.
                    font-bold: texto em negrito. */}
                <h1 className="text-3xl font-bold">

                    EvolutionFit

                </h1>

            </div>

            {/* =====================================
                ÁREA DE NAVEGAÇÃO
               ===================================== */}

            {/* nav: identifica a área de navegação.
                flex-1: ocupa o espaço disponível.
                p-5: espaçamento interno. */}
            <nav className="flex-1 p-5">

                {/* ul: lista não ordenada.
                    space-y-4: espaço vertical
                    entre os itens do menu. */}
                <ul className="space-y-4">

                    {/* =================================
                        PAINEL
                       ================================= */}

                    {/* Opção disponível no menu,
                        independentemente do tipo
                        de usuário identificado.

                        onClick: executa a navegação.
                        cursor-pointer: cursor de clique.
                        items-center: alinha os elementos.
                        gap-3: espaço entre ícone e texto.
                        transition: suaviza mudanças.
                        hover:text-purple-300: muda a cor
                        ao passar o mouse. */}
                    <li
                        onClick={() => navigate("/dashboard")}
                        className="flex cursor-pointer items-center gap-3 transition hover:text-purple-300"
                    >
                        {/* Ícone do painel.
                            size={20}: tamanho de 20px. */}
                        <LayoutDashboard size={20} />

                        Painel
                    </li>

                    {/* =================================
                        OPÇÕES DO PERSONAL
                       ================================= */}

                    {/* Renderização condicional.

                        As opções abaixo aparecem
                        somente quando tipoUsuario
                        é igual a "personal".

                        && significa que o conteúdo
                        será renderizado apenas
                        se a condição for verdadeira. */}
                    {tipoUsuario === "personal" && (

                        // Fragmento React.
                        // Agrupa vários elementos JSX
                        // sem criar uma div adicional.
                        <>

                            {/* ALUNOS */}

                            {/* Navega para a página
                                de gerenciamento de alunos. */}
                            <li
                                onClick={() => navigate("/alunos")}
                                className="flex cursor-pointer items-center gap-3 transition hover:text-purple-300"
                            >
                                <Users size={20} />

                                Alunos
                            </li>

                            {/* TREINOS */}

                            {/* Navega para a página
                                de gerenciamento de treinos. */}
                            <li
                                onClick={() => navigate("/treinos")}
                                className="flex cursor-pointer items-center gap-3 transition hover:text-purple-300"
                            >
                                <Dumbbell size={20} />

                                Treinos
                            </li>

                            {/* EXERCÍCIOS */}

                            {/* Navega para a página
                                de gerenciamento de exercícios. */}
                            <li
                                onClick={() => navigate("/exercicios")}
                                className="flex cursor-pointer items-center gap-3 transition hover:text-purple-300"
                            >
                                <Activity size={20} />

                                Exercícios
                            </li>

                            {/* AGENDA */}

                            {/* Navega para a agenda
                                de treinos do sistema. */}
                            <li
                                onClick={() => navigate("/agenda")}
                                className="flex cursor-pointer items-center gap-3 transition hover:text-purple-300"
                            >
                                <CalendarDays size={20} />

                                Agenda
                            </li>

                            {/* AVALIAÇÕES */}

                            {/* Navega para a página
                                de avaliações dos alunos. */}
                            <li
                                onClick={() => navigate("/avaliacoes")}
                                className="flex cursor-pointer items-center gap-3 transition hover:text-purple-300"
                            >
                                <ClipboardCheck size={20} />

                                Avaliações
                            </li>

                        </>

                    )}

                    {/* =================================
                        OPÇÕES DO ALUNO
                       ================================= */}

                    {/* As opções abaixo aparecem
                        somente quando tipoUsuario
                        é igual a "aluno". */}
                    {tipoUsuario === "aluno" && (

                        // Agrupa os itens sem adicionar
                        // elementos extras ao HTML.
                        <>

                            {/* MEU TREINO */}

                            {/* Permite ao aluno acessar
                                seus treinos. */}
                            <li
                                onClick={() => navigate("/meu-treino")}
                                className="flex cursor-pointer items-center gap-3 transition hover:text-purple-300"
                            >
                                <Dumbbell size={20} />

                                Meu Treino
                            </li>

                            {/* INICIAR TREINO */}

                            {/* Permite navegar para
                                a tela de execução do treino. */}
                            <li
                                onClick={() => navigate("/iniciar-treino")}
                                className="flex cursor-pointer items-center gap-3 transition hover:text-purple-300"
                            >
                                <Play size={20} />

                                Iniciar Treino
                            </li>

                            {/* MINHA EVOLUÇÃO */}

                            {/* Permite acessar a página
                                de acompanhamento da evolução. */}
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

            {/* =====================================
                BOTÃO DE SAIR
               ===================================== */}

            {/* border-t: borda superior.
                border-purple-700: cor da borda.
                p-5: espaçamento interno. */}
            <div className="border-t border-purple-700 p-5">

                {/* Botão responsável pelo logout.

                    type="button": botão comum.
                    onClick={sair}: executa a função sair.

                    hover:text-red-300: altera a cor
                    ao passar o mouse. */}
                <button
                    type="button"
                    onClick={sair}
                    className="flex cursor-pointer items-center gap-3 transition hover:text-red-300"
                >

                    {/* Ícone de saída. */}
                    <LogOut size={20} />

                    Sair

                </button>

            </div>

        </aside>

    );
}
