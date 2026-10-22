
// Importa o Layout, responsável pela estrutura visual da página.
import Layout from "../../components/Layout/Layout";

// Importa os hooks do React.
// useState: armazena e atualiza estados.
// useEffect: executa efeitos, como buscar dados no backend.
import { useEffect, useState } from "react";

// useNavigate: permite navegar entre páginas.
// useParams: captura parâmetros da URL, como o ID da avaliação.
import { useNavigate, useParams } from "react-router-dom";

// Axios é utilizado para fazer requisições HTTP ao backend.
import axios from "axios";

// Importa ícones utilizados na interface.
import {
    ArrowLeft,
    User,
    Calendar,
    Weight,
    Ruler,
    FileText
} from "lucide-react";

// Componente responsável pela edição de uma avaliação física.
export default function EditarAvaliacao() {

    // Função utilizada para navegar entre as rotas do aplicativo.
    const navigate = useNavigate();

    // Captura o ID da avaliação informado na URL.
    const { id } = useParams();

    // Armazena a lista de alunos recebida do backend.
    const [alunos, setAlunos] = useState([]);

    // Estados que armazenam os dados preenchidos no formulário.
    const [usuarioId, setUsuarioId] = useState("");
    const [dataAvaliacao, setDataAvaliacao] = useState("");
    const [peso, setPeso] = useState("");
    const [altura, setAltura] = useState("");
    const [observacoes, setObservacoes] = useState("");

    // Controla se os dados iniciais ainda estão sendo carregados.
    const [carregando, setCarregando] = useState(true);

    // Controla se a avaliação está sendo salva no backend.
    const [salvando, setSalvando] = useState(false);

    // =========================================
    // CARREGAR DADOS
    // =========================================

    // Executa a busca dos dados quando a página é carregada
    // ou quando alguma dependência do efeito muda.
    useEffect(() => {

        // Função assíncrona que busca os dados necessários.
        async function carregarDados() {
            try {

                // Promise.all executa as duas requisições
                // de forma concorrente e aguarda ambas.
                const [
                    responseAvaliacao,
                    responseAlunos
                ] = await Promise.all([

                    // Busca a avaliação específica pelo ID da URL.
                    axios.get(
                        `http://localhost:5000/avaliacao/${id}`
                    ),

                    // Busca a lista de usuários cadastrados.
                    axios.get(
                        "http://localhost:5000/user/list"
                    )
                ]);

                // Extrai os dados da avaliação retornados pelo backend.
                const avaliacao = responseAvaliacao.data;

                // Verifica se a resposta de usuários é um array.
                // Se não for, utiliza uma lista vazia.
                const usuarios =
                    Array.isArray(responseAlunos.data)
                        ? responseAlunos.data
                        : [];

                // Filtra a lista para manter apenas usuários
                // cujo tipo seja "aluno".
                const apenasAlunos =
                    usuarios.filter(
                        (usuario) =>
                            usuario.tipo_usuario === "aluno"
                    );

                // Armazena os alunos filtrados no estado.
                setAlunos(apenasAlunos);

                // Converte o ID do aluno para string,
                // compatível com o valor do campo select.
                setUsuarioId(
                    String(avaliacao.usuario_id)
                );

                // Preenche o peso.
                // O operador ?? usa "" se o valor for
                // null ou undefined.
                setPeso(
                    avaliacao.peso ?? ""
                );

                // Preenche a altura com a mesma proteção.
                setAltura(
                    avaliacao.altura ?? ""
                );

                // Separa a data do horário.
                // Exemplo: "2026-10-22T14:30:00"
                // torna-se "2026-10-22".
                setDataAvaliacao(
                    avaliacao.data_avaliacao
                        ? avaliacao.data_avaliacao.split("T")[0]
                        : ""
                );

                // Preenche as observações.
                // Se o valor for falsy, utiliza texto vazio.
                setObservacoes(
                    avaliacao.observacoes || ""
                );

            } catch (error) {

                // Registra o erro no console para depuração.
                console.error(error);

                // Verifica se o servidor retornou uma resposta de erro.
                if (error.response) {
                    alert(
                        error.response.data.message ||
                        "Erro ao carregar avaliação!"
                    );
                } else {

                    // Exibe uma mensagem quando não há resposta
                    // HTTP do servidor.
                    alert(
                        "Não foi possível conectar ao servidor."
                    );
                }

                // Retorna à listagem caso não consiga carregar.
                navigate("/avaliacoes");

            } finally {

                // Encerra o estado de carregamento,
                // independentemente do sucesso ou erro.
                setCarregando(false);
            }
        }

        // Chama a função responsável por buscar os dados.
        carregarDados();

        // Dependências: o efeito pode executar novamente
        // se o ID ou a referência de navigate mudar.
    }, [id, navigate]);

    // =========================================
    // ATUALIZAR AVALIAÇÃO
    // =========================================

    // Função executada ao enviar o formulário.
    async function handleAtualizarAvaliacao(e) {

        // Impede o recarregamento padrão da página.
        e.preventDefault();

        // Valida se um aluno foi selecionado.
        if (!usuarioId) {
            alert("Selecione um aluno!");
            return;
        }

        // Verifica se a data foi informada.
        if (!dataAvaliacao) {
            alert("Informe a data da avaliação!");
            return;
        }

        // Verifica se o peso foi preenchido.
        if (!peso) {
            alert("Informe o peso!");
            return;
        }

        // Verifica se a altura foi preenchida.
        if (!altura) {
            alert("Informe a altura!");
            return;
        }

        // Converte os valores recebidos dos campos
        // para o tipo numérico.
        const pesoNumero = Number(peso);
        const alturaNumero = Number(altura);

        // Impede peso inválido, zero ou negativo.
        // Number.isNaN verifica se o valor é NaN.
        // || significa OU.
        if (
            Number.isNaN(pesoNumero) ||
            pesoNumero <= 0
        ) {
            alert("Informe um peso válido!");
            return;
        }

        // Impede altura inválida, zero ou negativa.
        if (
            Number.isNaN(alturaNumero) ||
            alturaNumero <= 0
        ) {
            alert("Informe uma altura válida!");
            return;
        }

        try {

            // Indica que o processo de salvamento começou.
            // Isso desabilita os campos e botões.
            setSalvando(true);

            // Envia os dados atualizados ao backend
            // utilizando uma requisição HTTP POST.
            const response = await axios.post(
                "http://localhost:5000/avaliacao/update",
                {
                    // ID da avaliação que será atualizada.
                    id: Number(id),

                    // ID do aluno selecionado.
                    usuario_id: Number(usuarioId),

                    // Valores numéricos validados.
                    peso: pesoNumero,
                    altura: alturaNumero,

                    // Data informada no formulário.
                    data_avaliacao: dataAvaliacao,

                    // Remove espaços desnecessários
                    // do início e do final do texto.
                    observacoes: observacoes.trim()
                }
            );

            // Mostra a mensagem retornada pelo backend.
            alert(response.data.message);

            // Volta para a listagem de avaliações.
            navigate("/avaliacoes");

        } catch (error) {

            // Registra detalhes do erro no console.
            console.error(error);

            // Trata erros que possuem resposta HTTP.
            if (error.response) {
                alert(
                    error.response.data.message ||
                    "Erro ao atualizar avaliação!"
                );
            } else {

                // Trata situações sem resposta do servidor.
                alert(
                    "Não foi possível conectar ao servidor."
                );
            }

        } finally {

            // Libera os campos e botões novamente,
            // independentemente do resultado.
            setSalvando(false);
        }
    }

    // =========================================
    // IMC PREVISTO
    // =========================================

    // Converte os valores atuais do formulário para números.
    const pesoNumero = Number(peso);
    const alturaNumero = Number(altura);

    // Calcula o IMC quando peso e altura estão preenchidos
    // e possuem valores maiores que zero.
    //
    // Fórmula: IMC = peso / (altura * altura)
    //
    // toFixed(2) formata o resultado com duas casas decimais.
    // Se as condições não forem atendidas, retorna null.
    const imcPrevisto =
        peso &&
        altura &&
        pesoNumero > 0 &&
        alturaNumero > 0
            ? (
                pesoNumero /
                (alturaNumero * alturaNumero)
            ).toFixed(2)
            : null;

    // =========================================
    // CARREGANDO
    // =========================================

    // Enquanto a busca inicial estiver acontecendo,
    // mostra uma mensagem no lugar do formulário.
    if (carregando) {
        return (
            <Layout>
                <p className="text-gray-500">
                    Carregando avaliação...
                </p>
            </Layout>
        );
    }

    // =========================================
    // TELA
    // =========================================

    // Retorna a interface visual de edição da avaliação.
    return (
        <Layout>

            {/* Botão para voltar à listagem de avaliações. */}
            <button
                type="button"
                onClick={() =>
                    navigate("/avaliacoes")
                }
                disabled={salvando}
                className="mb-6 flex cursor-pointer items-center gap-2 text-purple-700 transition hover:text-purple-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {/* Ícone de seta para a esquerda. */}
                <ArrowLeft size={20} />
                Voltar para Avaliações
            </button>

            <div>

                {/* Título e descrição da página. */}
                <h1 className="text-4xl font-bold">
                    Editar Avaliação
                </h1>

                <p className="mt-2 mb-8 text-gray-500">
                    Atualize os dados da avaliação física.
                </p>

                {/* Formulário de edição.
                    onSubmit executa a função de atualização. */}
                <form
                    onSubmit={handleAtualizarAvaliacao}
                    className="space-y-6 rounded-2xl bg-white p-8 shadow-md"
                >

                    {/* =====================================
                        SELEÇÃO DO ALUNO
                    ===================================== */}

                    <div>
                        <label className="mb-2 block font-medium text-gray-700">
                            Aluno
                        </label>

                        <div className="relative">

                            {/* Ícone de usuário. */}
                            <User
                                size={18}
                                className="absolute top-4 left-4 text-gray-400"
                            />

                            {/* Campo de seleção controlado pelo estado usuarioId.
                                onChange atualiza o aluno selecionado.
                                disabled impede mudanças durante o salvamento. */}
                            <select
                                value={usuarioId}
                                onChange={(e) =>
                                    setUsuarioId(
                                        e.target.value
                                    )
                                }
                                disabled={salvando}
                                className="w-full rounded-xl border border-gray-300 py-3 pr-4 pl-11 focus:ring-2 focus:ring-purple-600 focus:outline-none disabled:bg-gray-100"
                            >

                                {/* Opção inicial sem aluno selecionado. */}
                                <option value="">
                                    Selecione um aluno
                                </option>

                                {/* map percorre a lista de alunos
                                    e cria uma opção para cada um. */}
                                {alunos.map(
                                    (aluno) => (
                                        <option
                                            // key identifica cada elemento para o React.
                                            key={aluno.id}

                                            // value representa o ID selecionado.
                                            value={aluno.id}
                                        >
                                            {/* Nome exibido na lista. */}
                                            {aluno.nome}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>
                    </div>

                    {/* =====================================
                        DATA DA AVALIAÇÃO
                    ===================================== */}

                    <div>
                        <label className="mb-2 block font-medium text-gray-700">
                            Data da Avaliação
                        </label>

                        <div className="relative">

                            {/* Ícone de calendário. */}
                            <Calendar
                                size={18}
                                className="absolute top-4 left-4 text-gray-400"
                            />

                            {/* Campo HTML próprio para datas.
                                value mostra a data armazenada no estado.
                                onChange atualiza a data escolhida. */}
                            <input
                                type="date"
                                value={dataAvaliacao}
                                onChange={(e) =>
                                    setDataAvaliacao(
                                        e.target.value
                                    )
                                }
                                disabled={salvando}
                                className="w-full rounded-xl border border-gray-300 py-3 pr-4 pl-11 focus:ring-2 focus:ring-purple-600 focus:outline-none disabled:bg-gray-100"
                            />
                        </div>
                    </div>

                    {/* =====================================
                        PESO E ALTURA
                    ===================================== */}

                    {/* Grid responsivo:
                        uma coluna em telas menores
                        e duas colunas a partir de md. */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                        {/* Campo de peso. */}
                        <div>
                            <label className="mb-2 block font-medium text-gray-700">
                                Peso (kg)
                            </label>

                            <div className="relative">

                                {/* Ícone representando o peso. */}
                                <Weight
                                    size={18}
                                    className="absolute top-4 left-4 text-gray-400"
                                />

                                {/* type number recebe valores numéricos.
                                    step 0.01 permite incrementos decimais.
                                    min 1 define o mínimo do campo.
                                    onChange atualiza o estado peso. */}
                                <input
                                    type="number"
                                    step="0.01"
                                    min="1"
                                    value={peso}
                                    onChange={(e) =>
                                        setPeso(
                                            e.target.value
                                        )
                                    }
                                    disabled={salvando}
                                    placeholder="Ex: 80.50"
                                    className="w-full rounded-xl border border-gray-300 py-3 pr-4 pl-11 focus:ring-2 focus:ring-purple-600 focus:outline-none disabled:bg-gray-100"
                                />
                            </div>
                        </div>

                        {/* Campo de altura. */}
                        <div>
                            <label className="mb-2 block font-medium text-gray-700">
                                Altura (m)
                            </label>

                            <div className="relative">

                                {/* Ícone representando altura. */}
                                <Ruler
                                    size={18}
                                    className="absolute top-4 left-4 text-gray-400"
                                />

                                {/* Campo numérico para altura em metros.
                                    step 0.01 permite valores como 1.75.
                                    min 0.50 define o mínimo do campo. */}
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0.50"
                                    value={altura}
                                    onChange={(e) =>
                                        setAltura(
                                            e.target.value
                                        )
                                    }
                                    disabled={salvando}
                                    placeholder="Ex: 1.75"
                                    className="w-full rounded-xl border border-gray-300 py-3 pr-4 pl-11 focus:ring-2 focus:ring-purple-600 focus:outline-none disabled:bg-gray-100"
                                />
                            </div>
                        </div>
                    </div>

                    {/* =====================================
                        OBSERVAÇÕES
                    ===================================== */}

                    <div>
                        <label className="mb-2 block font-medium text-gray-700">
                            Observações
                        </label>

                        <div className="relative">

                            {/* Ícone representando anotações. */}
                            <FileText
                                size={18}
                                className="absolute top-4 left-4 text-gray-400"
                            />

                            {/* textarea permite digitar textos maiores.
                                O valor fica armazenado em observacoes. */}
                            <textarea
                                rows="4"
                                value={observacoes}
                                onChange={(e) =>
                                    setObservacoes(
                                        e.target.value
                                    )
                                }
                                disabled={salvando}
                                placeholder="Digite observações da avaliação..."
                                className="w-full rounded-xl border border-gray-300 py-3 pr-4 pl-11 focus:ring-2 focus:ring-purple-600 focus:outline-none disabled:bg-gray-100"
                            />
                        </div>
                    </div>

                    {/* =====================================
                        EXIBIÇÃO DO IMC PREVISTO
                    ===================================== */}

                    <div className="rounded-xl border border-purple-100 bg-purple-50 p-4">

                        {/* Informa como o IMC é calculado. */}
                        <p className="text-sm text-purple-800">
                            O IMC será recalculado automaticamente com base no peso e na altura.
                        </p>

                        {/* Renderização condicional com &&:
                            o resultado aparece somente quando
                            imcPrevisto possui um valor válido. */}
                        {imcPrevisto && (
                            <p className="mt-2 text-lg font-bold text-purple-900">
                                IMC previsto:{" "}
                                {imcPrevisto}
                            </p>
                        )}
                    </div>

                    {/* =====================================
                        BOTÕES DO FORMULÁRIO
                    ===================================== */}

                    <div className="flex justify-end gap-4 border-t pt-8">

                        {/* Botão Cancelar:
                            retorna à lista sem enviar o formulário. */}
                        <button
                            type="button"
                            onClick={() =>
                                navigate("/avaliacoes")
                            }
                            disabled={salvando}
                            className="cursor-pointer rounded-xl border border-gray-300 px-8 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancelar
                        </button>

                        {/* Botão de envio:
                            type submit executa o onSubmit do formulário.
                            Fica desabilitado enquanto salvando for true. */}
                        <button
                            type="submit"
                            disabled={salvando}
                            className="cursor-pointer rounded-xl bg-purple-700 px-8 py-3 font-semibold text-white transition hover:bg-purple-800 disabled:cursor-not-allowed disabled:bg-purple-400"
                        >

                            {/* Operador ternário:
                                mostra "Salvando..." durante o envio
                                e "Salvar Alterações" no estado normal. */}
                            {salvando
                                ? "Salvando..."
                                : "Salvar Alterações"}
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}
