
/*
 * Componente Button
 *
 * Componente reutilizável responsável
 * por padronizar os botões do EvolutionFit.
 *
 * Recebe:
 * children: conteúdo exibido dentro do botão.
 * type: tipo do botão, sendo "button" o padrão.
 * ...props: outras propriedades, como onClick,
 * disabled e id.
 */

export default function Button({
    children,
    type = "button",
    ...props
}) {

    // Retorna o elemento visual do botão.
    return (

        <button

            // Define o tipo do botão.
            // "button" não envia formulários automaticamente.
            // "submit" pode ser utilizado para enviar formulários.
            type={type}

            // Repassa as demais propriedades recebidas.
            // Exemplo: onClick, disabled e id.
            {...props}

            // Classes do Tailwind CSS:
            //
            // w-full: ocupa toda a largura disponível.
            // bg-purple-700: fundo roxo.
            // hover:bg-purple-800: escurece ao passar o mouse.
            // text-white: texto branco.
            // font-semibold: texto seminegrito.
            // py-3: espaçamento vertical interno.
            // rounded-xl: bordas arredondadas.
            // transition: suaviza mudanças visuais.
            // duration-300: transição de 300 milissegundos.
            // shadow-md: sombra padrão.
            // hover:shadow-lg: aumenta a sombra no hover.
            // cursor-pointer: mostra o cursor de clique.
            className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-3 rounded-xl transition duration-300 shadow-md hover:shadow-lg cursor-pointer"
        >

            {/* Exibe o conteúdo recebido por children.
                Pode ser texto, ícone ou outro elemento React. */}
            {children}

        </button>
    );
}
