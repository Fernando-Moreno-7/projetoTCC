
/*
 * Componente Card
 *
 * Componente reutilizável responsável
 * por apresentar informações em cartões
 * dentro do EvolutionFit.
 *
 * Props:
 * titulo: título exibido no cartão.
 * valor: informação ou número apresentado.
 * icone: ícone relacionado à informação.
 * cor: cor de fundo do ícone.
 */

export default function Card({

    // Recebe o título do cartão.
    titulo,

    // Recebe o valor que será apresentado.
    valor,

    // Recebe o ícone do cartão.
    icone,

    // Define a cor roxa como padrão.
    // Caso nenhuma cor seja informada,
    // utiliza bg-purple-600.
    cor = "bg-purple-600"

}) {

    // Retorna a estrutura visual do cartão.
    return (

        // Container principal do Card.
        //
        // bg-white: fundo branco.
        // rounded-2xl: bordas arredondadas.
        // shadow-md: sombra padrão.
        // p-6: espaçamento interno.
        // flex: organiza os elementos com Flexbox.
        // justify-between: separa texto e ícone.
        // items-center: alinha verticalmente.
        // hover:shadow-xl: aumenta a sombra no hover.
        // transition: suaviza as mudanças visuais.
        <div className="bg-white rounded-2xl shadow-md p-6 flex justify-between items-center hover:shadow-xl transition">

            {/* ÁREA DAS INFORMAÇÕES */}

            <div>

                {/* Exibe o título recebido pelas props.
                    text-gray-500: texto cinza.
                    text-sm: tamanho pequeno. */}
                <p className="text-gray-500 text-sm">

                    {titulo}

                </p>

                {/* Exibe o valor recebido pelas props.
                    text-3xl: texto grande.
                    font-bold: negrito.
                    mt-2: margem superior. */}
                <h2 className="text-3xl font-bold mt-2">

                    {valor}

                </h2>

            </div>

            {/* ÁREA DO ÍCONE */}

            {/* As crases permitem criar uma string
                com classes CSS dinâmicas.

                ${cor} utiliza a cor recebida pela prop.

                w-14: largura do elemento.
                h-14: altura do elemento.
                rounded-xl: bordas arredondadas.
                flex: ativa o Flexbox.
                items-center: centraliza verticalmente.
                justify-center: centraliza horizontalmente.
                text-white: cor branca para o ícone. */}
            <div className={`${cor} w-14 h-14 rounded-xl flex items-center justify-center text-white`}>

                {/* Exibe o ícone recebido pelas props. */}
                {icone}

            </div>

        </div>

    );

}
