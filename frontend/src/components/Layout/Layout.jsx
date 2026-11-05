// Importa o menu de navegação.
import Sidebar from "../Sidebar/Sidebar";

// Importa a barra superior.
import Navbar from "../Navbar/Navbar";

// children representa o conteúdo da página atual.
export default function Layout({ children }) {
    return (
        // No celular, organiza menu e conteúdo em coluna.
        // A partir de 1024 px, posiciona o menu ao lado do conteúdo.
        <div className="flex min-h-screen flex-col bg-gray-100 lg:flex-row">

            {/* Menu adaptado para celular e computador */}
            <Sidebar />

            {/* min-w-0 permite que o conteúdo encolha dentro do Flexbox */}
            <div className="min-w-0 flex-1">

                {/* Barra superior da aplicação */}
                <Navbar />

                {/* Usa menos espaçamento nas telas pequenas */}
                <main className="min-w-0 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}