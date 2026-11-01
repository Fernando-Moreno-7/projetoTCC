
/*
 * Componente Input
 *
 * Responsável por criar campos de entrada
 * reutilizáveis no EvolutionFit.
 *
 * Pode ser utilizado em formulários
 * de login, cadastro e outras telas.
 *
 * Recebe propriedades para personalizar
 * o texto, tipo, placeholder e ícone.
 */

// Exporta o componente Input para
// utilização em outras partes do sistema.
export default function Input({

    // Texto que identifica o campo.
    // Exemplo: Nome, E-mail ou Senha.
    label,

    // Define o tipo do campo.
    // Exemplos: text, email e password.
    type,

    // Texto de orientação exibido
    // antes de o usuário digitar.
    placeholder,

    // Ícone apresentado dentro do campo.
    icon

}) {

    // Retorna os elementos visuais
    // que compõem o campo de entrada.
    return (

        // Container principal do componente.
        <div>

            {/* LABEL DO CAMPO */}

            {/* block: apresenta o label como bloco.
                text-gray-700: define a cor do texto.
                font-medium: define o peso da fonte.
                mb-2: adiciona margem inferior. */}
            <label className="block text-gray-700 font-medium mb-2">

                {/* Apresenta o texto recebido
                    pela propriedade label. */}
                {label}

            </label>


            {/* CONTAINER DO INPUT */}

            {/* relative: cria uma referência
                para posicionar o ícone. */}
            <div className="relative">

                {/* ÍCONE */}

                {/* absolute: posicionamento absoluto.
                    left-4: distância da esquerda.
                    top-4: distância do topo.
                    text-gray-400: cor cinza. */}
                <span className="absolute left-4 top-4 text-gray-400">

                    {/* Exibe o ícone recebido
                        pela propriedade icon. */}
                    {icon}

                </span>


                {/* CAMPO DE ENTRADA */}

                <input

                    // Define o tipo do campo.
                    // Exemplo: email ou password.
                    type={type}

                    // Apresenta o texto de orientação.
                    placeholder={placeholder}

                    // Classes de estilização Tailwind CSS.
                    //
                    // w-full: ocupa toda a largura disponível.
                    // rounded-xl: arredonda as bordas.
                    // border: adiciona uma borda.
                    // border-gray-300: cor cinza da borda.
                    //
                    // py-3: espaçamento vertical interno.
                    // pl-11: espaço à esquerda para o ícone.
                    // pr-4: espaçamento interno à direita.
                    //
                    // focus:outline-none: remove o contorno
                    // padrão quando o campo recebe foco.
                    //
                    // focus:ring-2: adiciona um destaque
                    // ao redor do campo quando selecionado.
                    //
                    // focus:ring-purple-600: define a
                    // cor roxa desse destaque.
                    className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"

                />

            </div>

        </div>

    );

}
