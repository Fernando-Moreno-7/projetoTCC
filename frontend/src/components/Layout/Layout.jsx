// Importa o componente responsável pelo menu lateral
import Sidebar from "../Sidebar/Sidebar";

// Importa o componente responsável pela barra superior
import Navbar from "../Navbar/Navbar";

// Cria e exporta o componente Layout
// children representa o conteúdo das páginas exibidas dentro do Layout
export default function Layout({ children }) {
    return (
        // Organiza os elementos com Flexbox, define a altura mínima
        // da tela e aplica um fundo cinza-claro
        <div className="flex min-h-screen bg-gray-100">

            {/* Exibe o menu lateral */}
            <Sidebar />

            {/* Ocupa o espaço disponível ao lado da Sidebar */}
            <div className="flex-1">

                {/* Exibe a barra superior */}
                <Navbar />

                {/* Área principal com espaçamento interno */}
                <main className="p-8">

                    {/* Exibe o conteúdo da página atual */}
                    {children}

                </main>
            </div>
        </div>
    );
}