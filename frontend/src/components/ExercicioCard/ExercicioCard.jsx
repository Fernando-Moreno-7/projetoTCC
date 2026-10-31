
/*
 * Componente ExercicioCard
 *
 * Responsável por apresentar as informações
 * de um exercício cadastrado no EvolutionFit.
 *
 * Exibe nome, grupo muscular, descrição
 * e imagem, quando disponíveis.
 *
 * Também apresenta os botões de editar
 * e excluir o exercício.
 */

// Importa os ícones da biblioteca Lucide React.
import {
    Activity,
    Pencil,
    Trash2
} from "lucide-react";

// Exporta o componente para ser utilizado
// em outras partes da aplicação.
//
// As props recebem os dados do exercício
// e as funções dos botões.
export default function ExercicioCard({
    nome,
    grupoMuscular,
    descricao,
    imagem,
    onEditar,
    onExcluir
}) {

    // Retorna a estrutura visual do cartão.
    return (

        // Container principal do exercício.
        //
        // bg-white: fundo branco.
        // rounded-2xl: bordas arredondadas.
        // shadow-md: sombra padrão.
        // p-6: espaçamento interno.
        // hover:shadow-xl: aumenta a sombra no hover.
        // transition: suaviza as alterações visuais.
        // duration-300: duração de 300 milissegundos.
        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300">

            {/* Organiza os dados e os botões.
                flex: utiliza Flexbox.
                justify-between: separa os elementos.
                items-start: alinha na parte superior.
                gap-4: espaçamento entre os elementos. */}
            <div className="flex justify-between items-start gap-4">

                {/* ÁREA DAS INFORMAÇÕES DO EXERCÍCIO */}

                {/* flex-1 permite que esta área
                    ocupe o espaço flexível disponível. */}
                <div className="flex-1">

                    {/* Organiza o ícone e os textos. */}
                    <div className="flex items-center gap-3">

                        {/* Ícone de atividade física.
                            size define o tamanho.
                            className define a cor. */}
                        <Activity
                            size={30}
                            className="text-purple-700"
                        />

                        <div>

                            {/* Nome do exercício recebido
                                pela prop nome. */}
                            <h2 className="text-xl font-bold">
                                {nome}
                            </h2>

                            {/* Grupo muscular do exercício.
                                Exemplo: Peitoral, Costas,
                                Pernas ou Bíceps. */}
                            <p className="text-sm text-purple-700 font-medium">
                                {grupoMuscular}
                            </p>

                        </div>

                    </div>

                    {/* DESCRIÇÃO DO EXERCÍCIO */}

                    {/* Renderização condicional.
                        O operador && verifica se existe
                        uma descrição válida.

                        Caso exista, mostra o parágrafo.
                        Caso contrário, não o apresenta. */}
                    {descricao && (

                        <p className="text-gray-500 mt-4">
                            {descricao}
                        </p>

                    )}

                    {/* IMAGEM DO EXERCÍCIO */}

                    {/* A imagem só será apresentada
                        quando a prop imagem tiver valor. */}
                    {imagem && (

                        <div className="mt-4">

                            <img
                                // Define o endereço da imagem.
                                src={imagem}

                                // Texto alternativo para
                                // acessibilidade.
                                alt={nome}

                                // w-full: largura total.
                                // h-40: altura definida.
                                // object-cover: preenche
                                // a área mantendo a proporção,
                                // podendo cortar partes da imagem.
                                // rounded-xl: bordas arredondadas.
                                className="w-full h-40 object-cover rounded-xl"
                            />

                        </div>

                    )}

                </div>

                {/* ÁREA DOS BOTÕES */}

                {/* Organiza os botões lado a lado. */}
                <div className="flex gap-2">

                    {/* BOTÃO EDITAR */}

                    <button
                        // Executa a função recebida
                        // pela prop onEditar quando clicado.
                        onClick={onEditar}

                        // Fundo azul e efeito hover.
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition"
                    >

                        {/* Ícone de edição. */}
                        <Pencil size={18} />

                    </button>

                    {/* BOTÃO EXCLUIR */}

                    <button
                        // Executa a função recebida
                        // pela prop onExcluir quando clicado.
                        onClick={onExcluir}

                        // Fundo vermelho e efeito hover.
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition"
                    >

                        {/* Ícone de exclusão. */}
                        <Trash2 size={18} />

                    </button>

                </div>

            </div>

        </div>

    );
}
