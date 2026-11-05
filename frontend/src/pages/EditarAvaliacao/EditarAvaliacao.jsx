// Layout padrão do EvolutionFit.
import Layout from "../../components/Layout/Layout";

// Hooks para controlar estados e carregar os dados.
import { useEffect, useState } from "react";

// Permitem navegar e capturar o ID informado na URL.
import { useNavigate, useParams } from "react-router-dom";

// Realiza as requisições HTTP para a API.
import axios from "axios";

// Ícones utilizados nos campos e botões.
import {
    ArrowLeft,
    User,
    Calendar,
    Weight,
    Ruler,
    FileText
} from "lucide-react";


// Converte uma entrada para número.
// Aceita vírgula como separador decimal.
// Campo vazio retorna NaN, em vez de virar zero.
function converterNumero(valor) {
    const texto = String(valor).trim();

    if (texto === "") {
        return NaN;
    }

    return Number(texto.replace(",", "."));
}


// Confere identificadores antes das requisições.
function idValido(valor) {
    return (
        (typeof valor === "string" || typeof valor === "number") &&
        Number.isSafeInteger(Number(valor)) &&
        Number(valor) > 0
    );
}


// Estilos compartilhados pelos campos.
const estiloCampo =
    "w-full min-w-0 rounded-xl border border-gray-300 " +
    "py-3 pr-4 pl-11 focus:ring-2 focus:ring-purple-600 " +
    "focus:outline-none disabled:bg-gray-100";

// Posiciona os ícones sem bloquear o clique nos campos.
const estiloIcone =
    "pointer-events-none absolute top-4 left-4 text-gray-400";


export default function EditarAvaliacao() {
    // Permite retornar à listagem.
    const navigate = useNavigate();

    // Captura o ID da avaliação na URL.
    const { id } = useParams();

    // Lista de alunos disponíveis.
    const [alunos, setAlunos] = useState([]);

    // Dados apresentados nos campos controlados.
    const [usuarioId, setUsuarioId] = useState("");
    const [dataAvaliacao, setDataAvaliacao] = useState("");
    const [peso, setPeso] = useState("");
    const [altura, setAltura] = useState("");
    const [observacoes, setObservacoes] = useState("");

    // Identifica a avaliação efetivamente carregada.
    // Evita salvar dados antigos caso o ID da URL mude.
    const [idCarregado, setIdCarregado] = useState("");

    // Estados de carregamento, erro e salvamento.
    const [carregando, setCarregando] = useState(true);
    const [erroCarregamento, setErroCarregamento] = useState("");
    const [salvando, setSalvando] = useState(false);


    // =========================================
    // CARREGAR AVALIAÇÃO E ALUNOS
    // =========================================

    useEffect(() => {
        // Cancela as consultas ao sair da página
        // ou quando o ID da avaliação mudar.
        const controller = new AbortController();

        async function carregarDados() {
            setCarregando(true);
            setErroCarregamento("");
            setIdCarregado("");

            try {
                if (!idValido(id)) {
                    setErroCarregamento(
                        "O ID da avaliação é inválido."
                    );

                    return;
                }

                // As consultas são independentes e podem
                // acontecer ao mesmo tempo.
                const [
                    responseAvaliacao,
                    responseAlunos
                ] = await Promise.all([
                    axios.get(
                        `http://localhost:5000/avaliacao/${id}`,
                        {
                            signal: controller.signal
                        }
                    ),

                    axios.get(
                        "http://localhost:5000/user/list",
                        {
                            signal: controller.signal
                        }
                    )
                ]);

                if (controller.signal.aborted) {
                    return;
                }

                const avaliacao = responseAvaliacao.data;

                // Confere se a API retornou a avaliação esperada.
                if (
                    !avaliacao ||
                    !idValido(avaliacao.id) ||
                    Number(avaliacao.id) !== Number(id) ||
                    !idValido(avaliacao.usuario_id)
                ) {
                    throw new Error(
                        "O servidor retornou uma avaliação inválida."
                    );
                }

                if (!Array.isArray(responseAlunos.data)) {
                    throw new Error(
                        "O servidor retornou uma lista de alunos inválida."
                    );
                }

                // Mantém apenas contas com perfil de aluno.
                const apenasAlunos = responseAlunos.data.filter(
                    (usuario) => usuario.tipo_usuario === "aluno"
                );

                // Confere se o proprietário está disponível na lista.
                const proprietarioDisponivel = apenasAlunos.some(
                    (aluno) =>
                        Number(aluno.id) ===
                        Number(avaliacao.usuario_id)
                );

                if (!proprietarioDisponivel) {
                    throw new Error(
                        "O aluno desta avaliação não está disponível na lista."
                    );
                }

                setAlunos(apenasAlunos);

                // O select utiliza strings nos valores das opções.
                setUsuarioId(String(avaliacao.usuario_id));

                // O operador ?? preserva valores existentes,
                // usando texto vazio apenas para null ou undefined.
                setPeso(avaliacao.peso ?? "");

                // Após a migração do banco, a API retorna centímetros.
                // Não fazemos conversão automática nesta tela.
                setAltura(avaliacao.altura ?? "");

                // DATEONLY normalmente retorna AAAA-MM-DD.
                // split também aceita uma resposta com horário.
                setDataAvaliacao(
                    typeof avaliacao.data_avaliacao === "string"
                        ? avaliacao.data_avaliacao.split("T")[0]
                        : ""
                );

                setObservacoes(avaliacao.observacoes ?? "");

                // Somente agora o formulário corresponde ao ID da URL.
                setIdCarregado(String(id));

            } catch (error) {
                if (controller.signal.aborted) {
                    return;
                }

                console.error(error);

                setErroCarregamento(
                    error.response?.data?.message ||
                    (
                        error.response
                            ? "Erro ao carregar avaliação!"
                            : error.message ||
                              "Não foi possível carregar a avaliação."
                    )
                );

            } finally {
                if (!controller.signal.aborted) {
                    setCarregando(false);
                }
            }
        }

        carregarDados();

        return () => controller.abort();
    }, [id]);


    // =========================================
    // VALIDAÇÃO E PRÉVIA DO IMC
    // =========================================

    const pesoInformado = converterNumero(peso);
    const alturaNumero = converterNumero(altura);

    // Intervalo compatível com DECIMAL(6,2).
    const pesoValido =
        Number.isFinite(pesoInformado) &&
        pesoInformado >= 0.01 &&
        pesoInformado <= 9999.99;

    // A altura deve seguir o mesmo padrão dos usuários:
    // centímetros inteiros entre 50 e 300.
    const alturaValida =
        Number.isInteger(alturaNumero) &&
        alturaNumero >= 50 &&
        alturaNumero <= 300;

    // Usa o mesmo arredondamento adotado pelo backend.
    const pesoNumero = pesoValido
        ? Number(pesoInformado.toFixed(2))
        : null;

    // Converte centímetros para metros somente no cálculo.
    const alturaMetros = alturaNumero / 100;

    const imcCalculado =
        pesoValido && alturaValida
            ? Number(
                (
                    pesoNumero /
                    (alturaMetros * alturaMetros)
                ).toFixed(2)
            )
            : null;

    // O IMC precisa caber na coluna DECIMAL(5,2).
    const imcValido =
        imcCalculado !== null &&
        Number.isFinite(imcCalculado) &&
        imcCalculado > 0 &&
        imcCalculado <= 999.99;

    const imcPrevisto = imcValido
        ? imcCalculado.toFixed(2)
        : null;

    const dadosProntos =
        !carregando &&
        !erroCarregamento &&
        idCarregado === String(id);


    // =========================================
    // ATUALIZAR AVALIAÇÃO
    // =========================================

    async function handleAtualizarAvaliacao(e) {
        // Impede o recarregamento padrão da página.
        e.preventDefault();

        if (salvando || !dadosProntos) {
            return;
        }

        if (!idValido(id)) {
            alert("Informe um ID de avaliação válido!");
            return;
        }

        if (!idValido(usuarioId)) {
            alert("Selecione um aluno válido!");
            return;
        }

        if (!dataAvaliacao) {
            alert("Informe a data da avaliação!");
            return;
        }

        if (!pesoValido) {
            alert("Informe um peso entre 0,01 e 9999,99 kg!");
            return;
        }

        if (!alturaValida) {
            alert(
                "Informe a altura em centímetros inteiros, entre 50 e 300. Exemplo: 175 para 1,75 m."
            );
            return;
        }

        if (!imcValido) {
            alert(
                "O IMC calculado está fora do intervalo permitido. Confira o peso e a altura!"
            );
            return;
        }

        try {
            setSalvando(true);

            // Envia apenas os campos necessários.
            // Peso em kg; altura em centímetros.
            // O backend recalcula o IMC antes de salvar.
            const response = await axios.post(
                "http://localhost:5000/avaliacao/update",
                {
                    id: Number(id),
                    usuario_id: Number(usuarioId),
                    peso: pesoNumero,
                    altura: alturaNumero,
                    data_avaliacao: dataAvaliacao,
                    observacoes: observacoes.trim()
                }
            );

            alert(
                response.data.message ||
                "Avaliação atualizada com sucesso!"
            );

            navigate("/avaliacoes");

        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                (
                    error.response
                        ? "Erro ao atualizar avaliação!"
                        : "Não foi possível conectar ao servidor."
                )
            );

        } finally {
            setSalvando(false);
        }
    }


    // =========================================
    // CARREGAMENTO E FALHA NA CONSULTA
    // =========================================

    if (erroCarregamento) {
        return (
            <Layout>
                <p role="alert" className="mb-4 text-red-700">
                    {erroCarregamento}
                </p>

                <button
                    type="button"
                    onClick={() => navigate("/avaliacoes")}
                    className="cursor-pointer text-purple-700 underline"
                >
                    Voltar para Avaliações
                </button>
            </Layout>
        );
    }

    // Evita exibir um formulário vazio ou de outra avaliação
    // enquanto a consulta ainda não terminou.
    if (!dadosProntos) {
        return (
            <Layout>
                <p role="status" className="text-gray-500">
                    Carregando avaliação...
                </p>
            </Layout>
        );
    }


    // =========================================
    // FORMULÁRIO DE EDIÇÃO
    // =========================================

    return (
        <Layout>
            {/* Retorna à listagem sem enviar o formulário. */}
            <button
                type="button"
                onClick={() => navigate("/avaliacoes")}
                disabled={salvando}
                className="mb-6 flex cursor-pointer items-center gap-2 text-purple-700 transition hover:text-purple-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
                <ArrowLeft size={20} aria-hidden="true" />
                Voltar para Avaliações
            </button>

            <div>
                <h1 className="text-3xl font-bold sm:text-4xl">
                    Editar Avaliação
                </h1>

                <p className="mt-2 mb-8 text-gray-500">
                    Atualize os dados da avaliação física.
                </p>

                <form
                    onSubmit={handleAtualizarAvaliacao}
                    className="space-y-6 rounded-2xl bg-white p-4 shadow-md sm:p-8"
                >
                    {/* SELEÇÃO DO ALUNO */}
                    <div>
                        <label
                            htmlFor="editar-avaliacao-aluno"
                            className="mb-2 block font-medium text-gray-700"
                        >
                            Aluno
                        </label>

                        <div className="relative">
                            <User
                                size={18}
                                aria-hidden="true"
                                className={estiloIcone}
                            />

                            <select
                                id="editar-avaliacao-aluno"
                                value={usuarioId}
                                onChange={(e) =>
                                    setUsuarioId(e.target.value)
                                }
                                disabled={salvando}
                                required
                                className={estiloCampo}
                            >
                                <option value="">
                                    Selecione um aluno
                                </option>

                                {/* Cada opção representa um aluno. */}
                                {alunos.map((aluno) => (
                                    <option
                                        key={aluno.id}
                                        value={aluno.id}
                                    >
                                        {aluno.nome}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* DATA DA AVALIAÇÃO */}
                    <div>
                        <label
                            htmlFor="editar-avaliacao-data"
                            className="mb-2 block font-medium text-gray-700"
                        >
                            Data da Avaliação
                        </label>

                        <div className="relative">
                            <Calendar
                                size={18}
                                aria-hidden="true"
                                className={estiloIcone}
                            />

                            <input
                                id="editar-avaliacao-data"
                                type="date"
                                min="1000-01-01"
                                max="9999-12-31"
                                value={dataAvaliacao}
                                onChange={(e) =>
                                    setDataAvaliacao(e.target.value)
                                }
                                disabled={salvando}
                                required
                                className={estiloCampo}
                            />
                        </div>
                    </div>

                    {/* Uma coluna no celular e duas em telas maiores. */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* PESO EM QUILOGRAMAS */}
                        <div>
                            <label
                                htmlFor="editar-avaliacao-peso"
                                className="mb-2 block font-medium text-gray-700"
                            >
                                Peso (kg)
                            </label>

                            <div className="relative">
                                <Weight
                                    size={18}
                                    aria-hidden="true"
                                    className={estiloIcone}
                                />

                                <input
                                    id="editar-avaliacao-peso"
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    max="9999.99"
                                    value={peso}
                                    onChange={(e) =>
                                        setPeso(e.target.value)
                                    }
                                    disabled={salvando}
                                    placeholder="Ex.: 80,50"
                                    aria-describedby="editar-avaliacao-peso-ajuda"
                                    required
                                    className={estiloCampo}
                                />
                            </div>

                            <p
                                id="editar-avaliacao-peso-ajuda"
                                className="mt-2 text-sm text-gray-500"
                            >
                                Informe o peso em kg, com até duas
                                casas decimais.
                            </p>
                        </div>

                        {/* ALTURA EM CENTÍMETROS INTEIROS */}
                        <div>
                            <label
                                htmlFor="editar-avaliacao-altura"
                                className="mb-2 block font-medium text-gray-700"
                            >
                                Altura (cm)
                            </label>

                            <div className="relative">
                                <Ruler
                                    size={18}
                                    aria-hidden="true"
                                    className={estiloIcone}
                                />

                                <input
                                    id="editar-avaliacao-altura"
                                    type="number"
                                    step="1"
                                    min="50"
                                    max="300"
                                    value={altura}
                                    onChange={(e) =>
                                        setAltura(e.target.value)
                                    }
                                    disabled={salvando}
                                    placeholder="Ex.: 175"
                                    aria-describedby="editar-avaliacao-altura-ajuda"
                                    required
                                    className={estiloCampo}
                                />
                            </div>

                            <p
                                id="editar-avaliacao-altura-ajuda"
                                className="mt-2 text-sm text-gray-500"
                            >
                                Use centímetros inteiros: 175 para
                                representar 1,75 m.
                            </p>
                        </div>
                    </div>

                    {/* OBSERVAÇÕES OPCIONAIS */}
                    <div>
                        <label
                            htmlFor="editar-avaliacao-observacoes"
                            className="mb-2 block font-medium text-gray-700"
                        >
                            Observações
                        </label>

                        <div className="relative">
                            <FileText
                                size={18}
                                aria-hidden="true"
                                className={estiloIcone}
                            />

                            <textarea
                                id="editar-avaliacao-observacoes"
                                rows={4}
                                value={observacoes}
                                onChange={(e) =>
                                    setObservacoes(e.target.value)
                                }
                                disabled={salvando}
                                placeholder="Digite observações da avaliação..."
                                className={estiloCampo}
                            />
                        </div>
                    </div>

                    {/* O cálculo mostrado é uma prévia.
                        O valor definitivo é calculado pela API. */}
                    <div
                        aria-live="polite"
                        className="rounded-xl border border-purple-100 bg-purple-50 p-4"
                    >
                        <p className="text-sm text-purple-800">
                            O IMC será recalculado automaticamente
                            com base no peso e na altura.
                        </p>

                        {imcPrevisto !== null && (
                            <p className="mt-2 text-lg font-bold text-purple-900">
                                IMC previsto: {imcPrevisto}
                            </p>
                        )}

                        {pesoValido &&
                            alturaValida &&
                            !imcValido && (
                                <p className="mt-2 text-sm text-red-700">
                                    Confira as medidas: o IMC está
                                    fora do intervalo permitido.
                                </p>
                            )}
                    </div>

                    {/* Botões empilhados no celular. */}
                    <div className="flex flex-col gap-4 border-t pt-8 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={() => navigate("/avaliacoes")}
                            disabled={salvando}
                            className="cursor-pointer rounded-xl border border-gray-300 px-8 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={salvando}
                            className="cursor-pointer rounded-xl bg-purple-700 px-8 py-3 font-semibold text-white transition hover:bg-purple-800 disabled:cursor-not-allowed disabled:bg-purple-400"
                        >
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