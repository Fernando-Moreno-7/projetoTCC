// Model responsável pelas avaliações físicas
import Avaliacoes from "../models/Avaliacoes.js";

// Model responsável pelos usuários
import Usuarios from "../models/Usuarios.js";

// Logger utilizado para registrar erros internos
import Logger from "../db/logger.js";


// =============================================
// FUNÇÕES AUXILIARES
// =============================================

// Valida os identificadores recebidos nas requisições.
function idValido(valor) {
    if (
        typeof valor !== "string" &&
        typeof valor !== "number"
    ) {
        return false;
    }

    return Number.isSafeInteger(Number(valor)) &&
        Number(valor) > 0;
}


// Confere a sessão criada pelo middleware JWT.
// A identidade deve vir do middleware, não do formulário.
function verificarSessao(req, res) {
    if (!req.usuario || !idValido(req.usuario.id)) {
        res.status(401).json({
            message: "Faça login para continuar!"
        });

        return false;
    }

    if (
        req.usuario.tipo_usuario !== "personal" &&
        req.usuario.tipo_usuario !== "aluno"
    ) {
        res.status(403).json({
            message: "Perfil sem permissão de acesso!"
        });

        return false;
    }

    return true;
}


// Restringe as operações administrativas ao personal.
function verificarPersonal(req, res) {
    if (!verificarSessao(req, res)) {
        return false;
    }

    if (req.usuario.tipo_usuario !== "personal") {
        res.status(403).json({
            message: "Somente o personal pode realizar esta ação!"
        });

        return false;
    }

    return true;
}


// Converte uma entrada numérica.
// Aceita vírgula como separador decimal, por exemplo: "80,50".
// Entradas vazias ou de outros tipos retornam NaN.
function converterNumero(valor) {
    if (
        typeof valor !== "string" &&
        typeof valor !== "number"
    ) {
        return NaN;
    }

    const texto = String(valor).trim();

    if (texto === "") {
        return NaN;
    }

    return Number(texto.replace(",", "."));
}


// Valida os dados utilizados no cadastro e na atualização.
// Peso em quilogramas e altura em centímetros inteiros.
function validarDados(body, res) {
    const {
        usuario_id,
        peso,
        altura,
        data_avaliacao,
        observacoes
    } = body || {};

    if (!idValido(usuario_id)) {
        res.status(422).json({
            message: "Selecione um aluno válido!"
        });

        return null;
    }

    const pesoInformado = converterNumero(peso);
    const alturaNumero = converterNumero(altura);

    // DECIMAL(6,2) permite até 9999.99.
    // O peso precisa ser positivo e caber na coluna do banco.
    if (
        !Number.isFinite(pesoInformado) ||
        pesoInformado < 0.01 ||
        pesoInformado > 9999.99
    ) {
        res.status(422).json({
            message: "Informe um peso entre 0,01 e 9999,99 kg!"
        });

        return null;
    }

    // Armazena o peso com duas casas decimais.
    // O IMC será calculado usando esse mesmo valor.
    const pesoNumero = Number(pesoInformado.toFixed(2));

    // Mantém a mesma unidade e os mesmos limites
    // utilizados no cadastro de usuários.
    // Exemplo válido: 175 para representar 1,75 m.
    if (
        !Number.isInteger(alturaNumero) ||
        alturaNumero < 50 ||
        alturaNumero > 300
    ) {
        res.status(422).json({
            message:
                "Informe a altura em centímetros inteiros, entre 50 e 300. Exemplo: 175 para 1,75 m."
        });

        return null;
    }

    if (
        typeof data_avaliacao !== "string" ||
        data_avaliacao.trim() === ""
    ) {
        res.status(422).json({
            message: "Informe a data da avaliação!"
        });

        return null;
    }

    // Confere o formato e a existência da data no calendário.
    // Não permite que uma data inválida chegue ao MySQL.
    const dataTexto = data_avaliacao.trim();
    const dataConvertida = new Date(`${dataTexto}T00:00:00Z`);

    if (
        !/^\d{4}-\d{2}-\d{2}$/.test(dataTexto) ||
        Number.isNaN(dataConvertida.getTime()) ||
        dataConvertida.toISOString().slice(0, 10) !== dataTexto ||
        Number(dataTexto.slice(0, 4)) < 1000
    ) {
        res.status(422).json({
            message: "Informe uma data de avaliação válida!"
        });

        return null;
    }

    if (
        observacoes !== undefined &&
        observacoes !== null &&
        typeof observacoes !== "string"
    ) {
        res.status(422).json({
            message: "As observações devem ser um texto!"
        });

        return null;
    }

    // A altura é recebida e armazenada em centímetros.
    // Somente para o cálculo do IMC, convertemos para metros.
    const alturaMetros = alturaNumero / 100;

    // Fórmula: peso em kg dividido pela altura em metros ao quadrado.
    const imcCalculado = pesoNumero / (
        alturaMetros * alturaMetros
    );

    const imc = Number(imcCalculado.toFixed(2));

    // DECIMAL(5,2) permite até 999.99.
    // Também rejeita resultados que seriam arredondados para zero.
    if (
        !Number.isFinite(imc) ||
        imc <= 0 ||
        imc > 999.99
    ) {
        res.status(422).json({
            message:
                "O IMC calculado está fora do intervalo permitido. Confira o peso e a altura!"
        });

        return null;
    }

    // Retorna somente os campos permitidos.
    // O IMC enviado pelo frontend não é utilizado:
    // o backend calcula o valor a partir das medidas.
    return {
        usuario_id: Number(usuario_id),
        peso: pesoNumero,
        altura: alturaNumero,
        imc,
        data_avaliacao: dataTexto,
        observacoes: observacoes?.trim() || ""
    };
}


export default class AvaliacaoController {

    // =========================================
    // CRIAR AVALIAÇÃO
    // Somente personal
    // =========================================

    static async create(req, res) {
        if (!verificarPersonal(req, res)) {
            return;
        }

        const dados = validarDados(req.body, res);

        if (!dados) {
            return;
        }

        try {
            const usuario = await Usuarios.findByPk(
                dados.usuario_id
            );

            if (!usuario) {
                return res.status(404).json({
                    message: "Usuário não encontrado!"
                });
            }

            // Avaliações devem pertencer a contas de aluno.
            if (usuario.tipo_usuario !== "aluno") {
                return res.status(422).json({
                    message: "A avaliação deve pertencer a um aluno!"
                });
            }

            const avaliacao = await Avaliacoes.create(dados);

            return res.status(201).json({
                message: "Avaliação cadastrada com sucesso!",
                avaliacao
            });

        } catch (error) {
            Logger.error(`Erro ao cadastrar avaliação: ${error}`);

            return res.status(500).json({
                message: "Erro ao cadastrar avaliação!"
            });
        }
    }


    // =========================================
    // LISTAR TODAS AS AVALIAÇÕES
    // Somente personal
    // =========================================

    static async list(req, res) {
        if (!verificarPersonal(req, res)) {
            return;
        }

        try {
            const avaliacoes = await Avaliacoes.findAll({
                include: [
                    {
                        model: Usuarios,

                        // Retorna apenas os dados necessários do usuário.
                        // O hash da senha não é incluído.
                        attributes: ["id", "nome", "email"]
                    }
                ],

                // Mostra as avaliações mais recentes primeiro.
                order: [
                    ["data_avaliacao", "DESC"],
                    ["id", "DESC"]
                ]
            });

            return res.status(200).json(avaliacoes);

        } catch (error) {
            Logger.error(`Erro ao listar avaliações: ${error}`);

            return res.status(500).json({
                message: "Erro ao listar avaliações!"
            });
        }
    }


    // =========================================
    // BUSCAR AVALIAÇÃO PELO ID
    // Personal ou aluno proprietário do registro
    // =========================================

    static async getById(req, res) {
        if (!verificarSessao(req, res)) {
            return;
        }

        const { id } = req.params;

        if (!idValido(id)) {
            return res.status(422).json({
                message: "Informe um ID de avaliação válido!"
            });
        }

        const where = {
            id: Number(id)
        };

        // O aluno só encontra avaliações que pertencem a ele.
        // A identidade utilizada vem da sessão autenticada.
        if (req.usuario.tipo_usuario === "aluno") {
            where.usuario_id = Number(req.usuario.id);
        }

        try {
            const avaliacao = await Avaliacoes.findOne({
                where,

                include: [
                    {
                        model: Usuarios,
                        attributes: ["id", "nome", "email"]
                    }
                ]
            });

            // Uma avaliação de outro aluno também não é encontrada
            // pela consulta restrita ao proprietário.
            if (!avaliacao) {
                return res.status(404).json({
                    message: "Avaliação não encontrada!"
                });
            }

            return res.status(200).json(avaliacao);

        } catch (error) {
            Logger.error(`Erro ao buscar avaliação: ${error}`);

            return res.status(500).json({
                message: "Erro ao buscar avaliação!"
            });
        }
    }


    // =========================================
    // LISTAR AVALIAÇÕES DE UM ALUNO
    // Personal ou o próprio aluno
    // =========================================

    static async listByUsuario(req, res) {
        if (!verificarSessao(req, res)) {
            return;
        }

        const idInformado = req.params.usuario_id;

        if (!idValido(idInformado)) {
            return res.status(422).json({
                message: "Informe um ID de aluno válido!"
            });
        }

        const aluno = req.usuario.tipo_usuario === "aluno";

        // Impede que um aluno altere o ID da URL
        // para consultar avaliações de outra pessoa.
        if (
            aluno &&
            Number(idInformado) !== Number(req.usuario.id)
        ) {
            return res.status(403).json({
                message:
                    "Você não pode consultar as avaliações de outro usuário!"
            });
        }

        // Para o aluno, a identidade da consulta vem da sessão.
        // O personal pode consultar o aluno informado na URL.
        const usuarioId = aluno
            ? Number(req.usuario.id)
            : Number(idInformado);

        try {
            const usuario = await Usuarios.findByPk(usuarioId);

            if (!usuario) {
                return res.status(404).json({
                    message: "Usuário não encontrado!"
                });
            }

            if (usuario.tipo_usuario !== "aluno") {
                return res.status(422).json({
                    message: "O usuário informado não é um aluno!"
                });
            }

            const avaliacoes = await Avaliacoes.findAll({
                where: {
                    usuario_id: usuarioId
                },

                order: [
                    ["data_avaliacao", "DESC"],
                    ["id", "DESC"]
                ]
            });

            return res.status(200).json(avaliacoes);

        } catch (error) {
            Logger.error(
                `Erro ao buscar avaliações do aluno: ${error}`
            );

            return res.status(500).json({
                message: "Erro ao buscar avaliações do aluno!"
            });
        }
    }


    // =========================================
    // ATUALIZAR AVALIAÇÃO
    // Somente personal
    // =========================================

    static async update(req, res) {
        if (!verificarPersonal(req, res)) {
            return;
        }

        const { id } = req.body || {};

        if (!idValido(id)) {
            return res.status(422).json({
                message: "Informe um ID de avaliação válido!"
            });
        }

        // Valida novamente as medidas e recalcula o IMC.
        const dados = validarDados(req.body, res);

        if (!dados) {
            return;
        }

        try {
            const avaliacao = await Avaliacoes.findByPk(
                Number(id)
            );

            if (!avaliacao) {
                return res.status(404).json({
                    message: "Avaliação não encontrada!"
                });
            }

            const usuario = await Usuarios.findByPk(
                dados.usuario_id
            );

            if (!usuario) {
                return res.status(404).json({
                    message: "Usuário não encontrado!"
                });
            }

            if (usuario.tipo_usuario !== "aluno") {
                return res.status(422).json({
                    message: "A avaliação deve pertencer a um aluno!"
                });
            }

            // Salva somente os campos retornados pela validação.
            await avaliacao.update(dados);

            return res.status(200).json({
                message: "Avaliação atualizada com sucesso!"
            });

        } catch (error) {
            Logger.error(`Erro ao atualizar avaliação: ${error}`);

            return res.status(500).json({
                message: "Erro ao atualizar avaliação!"
            });
        }
    }


    // =========================================
    // EXCLUIR AVALIAÇÃO
    // Somente personal
    // =========================================

    static async delete(req, res) {
        if (!verificarPersonal(req, res)) {
            return;
        }

        const { id } = req.body || {};

        if (!idValido(id)) {
            return res.status(422).json({
                message: "Informe um ID de avaliação válido!"
            });
        }

        try {
            const removidos = await Avaliacoes.destroy({
                where: {
                    id: Number(id)
                }
            });

            if (!removidos) {
                return res.status(404).json({
                    message: "Avaliação não encontrada!"
                });
            }

            return res.status(200).json({
                message: "Avaliação excluída com sucesso!"
            });

        } catch (error) {
            Logger.error(`Erro ao excluir avaliação: ${error}`);

            return res.status(500).json({
                message: "Erro ao excluir avaliação!"
            });
        }
    }
}