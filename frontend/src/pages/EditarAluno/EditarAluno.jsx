// useState armazena os dados do formulário.
// useEffect executa a busca dos dados ao abrir ou trocar o aluno.
import { useEffect, useState } from "react";

// useNavigate permite mudar de página.
// useParams obtém o ID do aluno presente na URL.
import { useNavigate, useParams } from "react-router-dom";

// Biblioteca para fazer requisições HTTP ao backend.
import axios from "axios";

// Layout compartilhado pelas páginas do sistema.
import Layout from "../../components/Layout/Layout";

// Ícones utilizados nos campos e botões.
import {
    ArrowLeft,
    User,
    Lock,
    Calendar,
    Ruler,
    Weight,
    Target,
    Phone,
    Activity
} from "lucide-react";

// Estilização compartilhada pelos inputs e selects.
const estiloCampo =
    "w-full min-w-0 border border-gray-300 rounded-xl py-3 pl-11 pr-4 " +
    "focus:outline-none focus:ring-2 focus:ring-purple-600";

// Posiciona os ícones dentro dos campos.
const estiloIcone =
    "absolute left-4 top-1/2 -translate-y-1/2 text-gray-400";

// =========================================
// COMPONENTE REUTILIZÁVEL DE CAMPO
// =========================================

// Recebe pelas props:
// id: identificador do input ou select.
// titulo: texto do rótulo.
// icone: componente do ícone, renomeado para Icone.
// ajuda: orientação opcional.
// children: input ou select colocado dentro de Campo.
function Campo({ id, titulo, icone: Icone, ajuda, children }) {
    return (
        <div className="min-w-0">
            {/* Associa o rótulo ao campo com o mesmo id. */}
            <label
                htmlFor={id}
                className="block text-gray-700 font-medium mb-2"
            >
                {titulo}
            </label>

            {/* Serve de referência para posicionar o ícone. */}
            <div className="relative">
                <Icone
                    size={18}
                    className={estiloIcone}
                    aria-hidden="true"
                />

                {/* Renderiza o campo recebido pelo componente. */}
                {children}
            </div>

            {/* Exibe a orientação somente quando foi informada. */}
            {ajuda && (
                <p
                    id={`${id}-ajuda`}
                    className="text-sm text-gray-500 mt-2"
                >
                    {ajuda}
                </p>
            )}
        </div>
    );
}

// =========================================
// COMPONENTE DE EDIÇÃO DO ALUNO
// =========================================

export default function EditarAluno() {
    const navigate = useNavigate();

    // Exemplo: em uma rota com /:id, recebe o valor desse parâmetro.
    // Os parâmetros da URL chegam como texto.
    const { id } = useParams();

    // Estados que armazenam os dados apresentados nos campos.
    const [nome, setNome] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [idade, setIdade] = useState("");
    const [altura, setAltura] = useState("");
    const [peso, setPeso] = useState("");
    const [objetivo, setObjetivo] = useState("");
    const [telefone, setTelefone] = useState("");
    const [status, setStatus] = useState("Ativo");

    // Controla a busca inicial dos dados.
    const [carregando, setCarregando] = useState(true);

    // Controla o envio da atualização.
    const [salvando, setSalvando] = useState(false);

    // Armazena uma mensagem caso a busca falhe.
    const [erroCarregamento, setErroCarregamento] = useState("");

    // =========================================
    // BUSCAR OS DADOS DO ALUNO
    // =========================================

    // Executa ao montar o componente e sempre que id mudar.
    useEffect(() => {
        // Permite cancelar a requisição se a página for fechada
        // ou se o ID mudar antes da resposta.
        const controller = new AbortController();

        async function buscarAluno() {
            setCarregando(true);
            setErroCarregamento("");

            // As senhas nunca são carregadas do banco para a tela.
            setSenha("");
            setConfirmarSenha("");

            const idNumero = Number(id);

            // Verifica se o identificador é um inteiro positivo válido.
            if (!Number.isSafeInteger(idNumero) || idNumero <= 0) {
                setErroCarregamento("Identificador de aluno inválido.");
                setCarregando(false);
                return;
            }

            try {
                // GET consulta o aluno identificado na URL.
                // O signal conecta a requisição ao cancelamento.
                const response = await axios.get(
                    `http://localhost:5000/user/${idNumero}`,
                    { signal: controller.signal }
                );

                // Ignora a resposta se a busca já foi cancelada.
                if (controller.signal.aborted) return;

                const aluno = response.data;

                // ?? usa o valor alternativo somente para null ou undefined.
                // Assim, valores como zero não são apagados da tela.
                setNome(aluno.nome ?? "");
                setIdade(aluno.idade ?? "");
                setAltura(aluno.altura ?? "");
                setPeso(aluno.peso ?? "");
                setObjetivo(aluno.objetivo ?? "");
                setTelefone(aluno.telefone ?? "");
                setStatus(aluno.status ?? "Ativo");

            } catch (error) {
                // Cancelar a busca não representa uma falha para o usuário.
                if (controller.signal.aborted) return;

                console.error(error);

                // Usa a mensagem do servidor quando estiver disponível.
                setErroCarregamento(
                    error.response?.data?.message ||
                    "Não foi possível carregar os dados do aluno."
                );

            } finally {
                // Uma busca cancelada não deve atualizar o estado.
                if (!controller.signal.aborted) {
                    setCarregando(false);
                }
            }
        }

        buscarAluno();

        // Limpeza do efeito: cancela a busca anterior.
        return () => controller.abort();
    }, [id]);

    // =========================================
    // VALIDAR E SALVAR A EDIÇÃO
    // =========================================

    async function handleEditarAluno(e) {
        // Impede o recarregamento padrão do formulário.
        e.preventDefault();

        // Só permite salvar após carregar os dados com sucesso.
        // Também evita novo envio enquanto uma atualização está em andamento.
        if (salvando || carregando || erroCarregamento) return;

        if (!nome.trim()) {
            alert("Preencha o nome do aluno!");
            return;
        }

        // A alteração de senha é opcional.
        // Se um campo for preenchido, exige os dois.
        if (senha || confirmarSenha) {
            if (!senha || !confirmarSenha) {
                alert("Preencha a nova senha e a confirmação!");
                return;
            }

            if (senha !== confirmarSenha) {
                alert("As senhas não coincidem!");
                return;
            }
        }

        // Converte os campos preenchidos em números.
        // Campo vazio vira null, indicando dado não informado.
        const alturaNumero = altura === "" ? null : Number(altura);
        const pesoNumero = peso === "" ? null : Number(peso);
        const idadeNumero = idade === "" ? null : Number(idade);

        // A altura do cadastro utiliza centímetros inteiros.
        // O intervalo corresponde à validação do backend.
        if (
            alturaNumero !== null &&
            (
                !Number.isInteger(alturaNumero) ||
                alturaNumero < 50 ||
                alturaNumero > 300
            )
        ) {
            alert(
                "Informe a altura em centímetros inteiros, entre 50 e 300. " +
                "Exemplo: 175 para 1,75 m."
            );
            return;
        }

        // Rejeita valores inválidos, não positivos
        // ou maiores que o limite de DECIMAL(10,2).
        if (
            pesoNumero !== null &&
            (
                !Number.isFinite(pesoNumero) ||
                pesoNumero < 0.01 ||
                pesoNumero > 99999999.99
            )
        ) {
            alert("Informe um peso válido em quilogramas, maior que zero!");
            return;
        }

        // A idade deve ser inteira e não negativa.
        if (
            idadeNumero !== null &&
            (
                !Number.isSafeInteger(idadeNumero) ||
                idadeNumero < 0
            )
        ) {
            alert("Informe a idade em anos inteiros, sem valores negativos!");
            return;
        }

        // Objeto enviado no corpo da requisição.
        // O IMC é calculado pelo backend, não pelo formulário.
        const dados = {
            idUsuario: Number(id),
            nome: nome.trim(),
            idade: idadeNumero,
            altura: alturaNumero,
            peso: pesoNumero,
            objetivo: objetivo || null,
            telefone: telefone.trim() || null,
            status
        };

        // Só envia os campos de senha quando houver uma nova senha.
        if (senha) {
            dados.senha = senha;
            dados.confSenha = confirmarSenha;
        }

        try {
            setSalvando(true);

            // O projeto utiliza POST nesta rota de atualização.
            // await aguarda a resposta antes de continuar.
            const response = await axios.post(
                "http://localhost:5000/user/update",
                dados
            );

            alert(response.data.message);

            // Retorna à lista após a confirmação do servidor.
            navigate("/alunos");

        } catch (error) {
            console.error(error);

            // Diferencia erro respondido pelo servidor
            // de uma falha sem resposta.
            alert(
                error.response
                    ? error.response.data?.message || "Erro ao atualizar aluno!"
                    : "Não foi possível conectar ao servidor."
            );

        } finally {
            // Libera o botão após sucesso ou erro.
            setSalvando(false);
        }
    }

    // =========================================
    // ESTADOS DE CARREGAMENTO E ERRO
    // =========================================

    // Não apresenta o formulário antes de buscar os dados.
    if (carregando) {
        return (
            <Layout>
                <p className="text-gray-500" role="status">
                    Carregando aluno...
                </p>
            </Layout>
        );
    }

    // Evita editar um formulário vazio quando a consulta falha.
    if (erroCarregamento) {
        return (
            <Layout>
                <p className="text-red-600 mb-4" role="alert">
                    {erroCarregamento}
                </p>

                <button
                    type="button"
                    onClick={() => navigate("/alunos")}
                    className="text-purple-700 hover:text-purple-900"
                >
                    Voltar para Alunos
                </button>
            </Layout>
        );
    }

    // =========================================
    // INTERFACE DO FORMULÁRIO
    // =========================================

    return (
        <Layout>
            <button
                type="button"
                onClick={() => navigate("/alunos")}
                className="flex items-center gap-2 text-purple-700 hover:text-purple-900 mb-6 transition"
            >
                <ArrowLeft size={20} aria-hidden="true" />
                <span>Voltar para Alunos</span>
            </button>

            <div>
                <h1 className="text-3xl sm:text-4xl font-bold">
                    Editar Aluno
                </h1>

                <p className="text-gray-500 mt-2 mb-8">
                    Atualize os dados do aluno.
                </p>

                {/* onSubmit chama a função que valida e envia os dados.
                    aria-busy informa quando o formulário está ocupado. */}
                <form
                    onSubmit={handleEditarAluno}
                    className="bg-white rounded-2xl shadow-md p-4 sm:p-8 space-y-6"
                    aria-busy={salvando}
                >
                    <Campo id="nome" titulo="Nome Completo" icone={User}>
                        {/* value apresenta o estado.
                            onChange atualiza o estado com o texto digitado. */}
                        <input
                            id="nome"
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            placeholder="Digite o nome do aluno"
                            autoComplete="name"
                            maxLength={100}
                            required
                            className={estiloCampo}
                        />
                    </Campo>

                    {/* Uma coluna em telas pequenas e duas a partir de md. */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Campo id="senha" titulo="Nova Senha" icone={Lock}>
                            {/* Sem required: a troca de senha é opcional. */}
                            <input
                                id="senha"
                                type="password"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                placeholder="Deixe em branco para manter"
                                autoComplete="new-password"
                                aria-describedby="senha-ajuda"
                                className={estiloCampo}
                            />
                        </Campo>

                        <Campo
                            id="confirmarSenha"
                            titulo="Confirmar Senha"
                            icone={Lock}
                        >
                            <input
                                id="confirmarSenha"
                                type="password"
                                value={confirmarSenha}
                                onChange={(e) => setConfirmarSenha(e.target.value)}
                                placeholder="Confirme somente se alterar"
                                autoComplete="new-password"
                                aria-describedby="senha-ajuda"
                                className={estiloCampo}
                            />
                        </Campo>
                    </div>

                    {/* Os dois campos de senha referenciam esta orientação. */}
                    <p id="senha-ajuda" className="text-sm text-gray-500">
                        Deixe os campos de senha em branco caso não queira
                        alterar a senha do aluno.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Campo id="telefone" titulo="Telefone" icone={Phone}>
                            <input
                                id="telefone"
                                type="tel"
                                value={telefone}
                                onChange={(e) => setTelefone(e.target.value)}
                                placeholder="Ex.: (16) 99999-9999"
                                autoComplete="tel"
                                maxLength={20}
                                className={estiloCampo}
                            />
                        </Campo>

                        <Campo id="status" titulo="Status" icone={Activity}>
                            {/* Permite selecionar o status do cadastro. */}
                            <select
                                id="status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className={estiloCampo}
                            >
                                <option value="Ativo">Ativo</option>
                                <option value="Inativo">Inativo</option>
                            </select>
                        </Campo>
                    </div>

                    {/* As medidas ficam em três colunas a partir de md. */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Campo id="idade" titulo="Idade" icone={Calendar}>
                            <input
                                id="idade"
                                type="number"
                                min="0"
                                step="1"
                                value={idade}
                                onChange={(e) => setIdade(e.target.value)}
                                placeholder="Ex.: 23"
                                className={estiloCampo}
                            />
                        </Campo>

                        <Campo
                            id="altura"
                            titulo="Altura (cm)"
                            icone={Ruler}
                            ajuda="Use centímetros inteiros: 175 para 1,75 m."
                        >
                            {/* O navegador verifica mínimo, máximo e passo.
                                O backend mantém sua própria validação. */}
                            <input
                                id="altura"
                                type="number"
                                min="50"
                                max="300"
                                step="1"
                                value={altura}
                                onChange={(e) => setAltura(e.target.value)}
                                placeholder="Ex.: 175"
                                aria-describedby="altura-ajuda"
                                className={estiloCampo}
                            />
                        </Campo>

                        <Campo
                            id="peso"
                            titulo="Peso (kg)"
                            icone={Weight}
                            ajuda="Você pode informar até duas casas decimais."
                        >
                            {/* step="0.01" permite incrementos de 0,01 kg. */}
                            <input
                                id="peso"
                                type="number"
                                min="0.01"
                                max="99999999.99"
                                step="0.01"
                                value={peso}
                                onChange={(e) => setPeso(e.target.value)}
                                placeholder="Ex.: 80,50"
                                aria-describedby="peso-ajuda"
                                className={estiloCampo}
                            />
                        </Campo>
                    </div>

                    <Campo id="objetivo" titulo="Objetivo" icone={Target}>
                        <select
                            id="objetivo"
                            value={objetivo}
                            onChange={(e) => setObjetivo(e.target.value)}
                            className={estiloCampo}
                        >
                            <option value="">Selecione o objetivo</option>
                            <option value="Hipertrofia">Hipertrofia</option>
                            <option value="Emagrecimento">Emagrecimento</option>
                            <option value="Condicionamento">Condicionamento</option>
                            <option value="Definição">Definição</option>

                            {/* Preserva um objetivo antigo que não esteja
                                entre as opções predefinidas.
                                includes verifica se o valor pertence à lista. */}
                            {objetivo && ![
                                "Hipertrofia",
                                "Emagrecimento",
                                "Condicionamento",
                                "Definição"
                            ].includes(objetivo) && (
                                <option value={objetivo}>{objetivo}</option>
                            )}
                        </select>
                    </Campo>

                    {/* Botões empilhados em telas pequenas
                        e lado a lado a partir de sm. */}
                    <div className="flex flex-col sm:flex-row justify-end gap-4 pt-8 border-t">
                        {/* type="button" não envia o formulário. */}
                        <button
                            type="button"
                            onClick={() => navigate("/alunos")}
                            disabled={salvando}
                            className="border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 px-8 py-3 rounded-xl font-semibold transition"
                        >
                            Cancelar
                        </button>

                        {/* type="submit" dispara o envio.
                            disabled bloqueia o botão durante a requisição. */}
                        <button
                            type="submit"
                            disabled={salvando}
                            className="bg-purple-700 hover:bg-purple-800 disabled:bg-purple-400 text-white px-8 py-3 rounded-xl font-semibold transition"
                        >
                            {/* O ternário escolhe o texto pelo estado salvando. */}
                            {salvando ? "Salvando..." : "Salvar Alterações"}
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}