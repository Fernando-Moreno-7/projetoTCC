
/*
 * Componente Navbar
 *
 * Responsável por apresentar a barra
 * superior do aplicativo EvolutionFit.
 *
 * Exibe uma mensagem de boas-vindas
 * e um círculo com a inicial do usuário.
 *
 * Utiliza Tailwind CSS para estilização.
 */

// Exporta o componente Navbar para
// utilização em outras partes do sistema.
export default function Navbar() {

    // Retorna a estrutura visual da Navbar.
    return (

        // HEADER PRINCIPAL
        //
        // header: representa o cabeçalho.
        //
        // bg-white: fundo branco.
        // shadow: adiciona sombra.
        // px-8: espaçamento horizontal interno.
        // py-5: espaçamento vertical interno.
        //
        // flex: organiza os elementos com Flexbox.
        // justify-between: distribui os elementos
        // entre as extremidades do cabeçalho.
        // items-center: centraliza verticalmente.
        <header className="bg-white shadow px-8 py-5 flex justify-between items-center">

            {/* ÁREA DE BOAS-VINDAS */}

            {/* Agrupa o título e o parágrafo. */}
            <div>

                {/* h2: título da mensagem.
                    text-2xl: aumenta o tamanho.
                    font-bold: deixa em negrito.

                    Atualmente, o nome Fernando
                    está definido diretamente
                    no código. */}
                <h2 className="text-2xl font-bold">

                    Olá, Fernando 👋

                </h2>

                {/* p: parágrafo complementar.
                    text-gray-500: cor cinza. */}
                <p className="text-gray-500">

                    Bem-vindo ao EvolutionFit

                </p>

            </div>


            {/* IDENTIFICAÇÃO DO USUÁRIO */}

            {/* w-12: largura do elemento.
                h-12: altura do elemento.
                bg-purple-700: fundo roxo.
                rounded-full: formato circular.

                flex: utiliza Flexbox.
                items-center: centraliza verticalmente.
                justify-center: centraliza horizontalmente.

                text-white: texto branco.
                font-bold: texto em negrito. */}
            <div className="w-12 h-12 bg-purple-700 rounded-full flex items-center justify-center text-white font-bold">

                {/* Inicial fixa do usuário.
                    Futuramente, poderá ser
                    recebida dinamicamente. */}
                F

            </div>

        </header>

    );

}
