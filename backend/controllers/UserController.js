import Usuarios from "../models/Usuarios.js";
import Logger from "../db/logger.js";
import bcrypt from "bcrypt";
import Agenda_treinos from "../models/Agenda_treinos.js";

// Converte campos opcionais, aceitando ponto ou vírgula decimal.
// Campo vazio representa uma medida não informada.
function converterMedida(valor, campo) {
    if (
        valor === undefined ||
        valor === null ||
        (typeof valor === "string" && valor.trim() === "")
    ) {
        return null;
    }

    if (typeof valor !== "number" && typeof valor !== "string") {
        throw new Error(`${campo} deve ser um número válido!`);
    }

    const numero = Number(
        typeof valor === "string"
            ? valor.trim().replace(",", ".")
            : valor
    );

    if (!Number.isFinite(numero) || numero <= 0) {
        throw new Error(`${campo} deve ser um número maior que zero!`);
    }

    return numero;
}

// No cadastro de usuários, peso é informado em kg
// e altura em centímetros inteiros.
function validarMedidas(pesoInformado, alturaInformada) {
    let peso = converterMedida(pesoInformado, "O peso");
    const altura = converterMedida(alturaInformada, "A altura");

    if (peso !== null) {
        // Limite compatível com DECIMAL(10,2).
        if (peso > 99999999.99) {
            throw new Error("O peso informado excede o limite permitido!");
        }

        peso = Number(peso.toFixed(2));

        if (peso <= 0) {
            throw new Error("Informe um peso de pelo menos 0,01 kg!");
        }
    }

    if (
        altura !== null &&
        (
            !Number.isInteger(altura) ||
            altura < 50 ||
            altura > 300
        )
    ) {
        throw new Error(
            "Informe a altura em centímetros inteiros, entre 50 e 300. " +
            "Exemplo: 175 para 1,75 m."
        );
    }

    let imc = null;

    if (peso !== null && altura !== null) {
        const alturaMetros = altura / 100;

        imc = Number(
            (peso / (alturaMetros * alturaMetros)).toFixed(2)
        );

        if (imc > 99999999.99) {
            throw new Error(
                "As medidas informadas excedem o limite do cálculo!"
            );
        }
    }

    return { peso, altura, imc };
}

function idValido(valor) {
    if (
        typeof valor !== "string" &&
        typeof valor !== "number"
    ) {
        return false;
    }

    const numero = Number(valor);

    return Number.isSafeInteger(numero) && numero > 0;
}

export default class UserController {

    // =========================================
    // CADASTRAR USUÁRIO
    // O cadastro público sempre cria aluno.
    // =========================================

    static async register(req, res) {
        const {
            nome,
            email,
            senha,
            confSenha,
            peso,
            altura,
            genero,
            idade,
            objetivo,
            telefone,
            status
        } = req.body;

        if (typeof nome !== "string" || !nome.trim()) {
            return res.status(422).json({
                message: "O nome de usuário é obrigatório!"
            });
        }

        if (typeof email !== "string" || !email.trim()) {
            return res.status(422).json({
                message: "O e-mail é obrigatório!"
            });
        }

        if (typeof senha !== "string" || !senha) {
            return res.status(422).json({
                message: "A senha é obrigatória!"
            });
        }

        if (typeof confSenha !== "string" || !confSenha) {
            return res.status(422).json({
                message: "A confirmação da senha é obrigatória!"
            });
        }

        if (senha !== confSenha) {
            return res.status(422).json({
                message: "As senhas não conferem!"
            });
        }

        let medidas;

        try {
            medidas = validarMedidas(peso, altura);
        } catch (error) {
            return res.status(422).json({
                message: error.message
            });
        }

        try {
            const emailNormalizado = email.trim();

            const usuarioExists = await Usuarios.findOne({
                where: { email: emailNormalizado }
            });

            if (usuarioExists) {
                return res.status(422).json({
                    message: "Este e-mail já foi cadastrado!"
                });
            }

            const salt = await bcrypt.genSalt(12);
            const passwordHash = await bcrypt.hash(senha, salt);

            await Usuarios.create({
                nome: nome.trim(),
                email: emailNormalizado,
                senha: passwordHash,
                tipo_usuario: "aluno",
                peso: medidas.peso,
                altura: medidas.altura,
                imc: medidas.imc,
                genero,
                idade,
                objetivo,
                telefone: telefone || null,
                status: status || "Ativo"
            });

            return res.status(200).json({
                message: "Usuário cadastrado com sucesso!"
            });

        } catch (error) {
            Logger.error(error);

            // Trata também cadastros simultâneos com o mesmo e-mail.
            if (error.name === "SequelizeUniqueConstraintError") {
                return res.status(422).json({
                    message: "Este e-mail já foi cadastrado!"
                });
            }

            return res.status(500).json({
                message: "Erro ao criar usuário!"
            });
        }
    }

    // =========================================
    // ATUALIZAR USUÁRIO
    // A rota exige o perfil personal.
    // =========================================

    static async updateUser(req, res) {
        const {
            nome,
            senha,
            confSenha,
            idUsuario,
            peso,
            altura,
            genero,
            idade,
            objetivo,
            telefone,
            status
        } = req.body;

        if (!idValido(idUsuario)) {
            return res.status(422).json({
                message: "Selecione um usuário válido!"
            });
        }

        if (typeof nome !== "string" || !nome.trim()) {
            return res.status(422).json({
                message: "O nome é obrigatório!"
            });
        }

        try {
            const usuario = await Usuarios.findByPk(idUsuario);

            if (!usuario) {
                return res.status(404).json({
                    message: "Usuário não encontrado!"
                });
            }

            let medidas;

            try {
                // Campo omitido mantém o valor existente.
                // Campo vazio ou null remove a medida.
                medidas = validarMedidas(
                    peso === undefined ? usuario.peso : peso,
                    altura === undefined ? usuario.altura : altura
                );
            } catch (error) {
                return res.status(422).json({
                    message: error.message
                });
            }

            const dadosAtualizados = {
                nome: nome.trim(),
                peso: medidas.peso,
                altura: medidas.altura,
                imc: medidas.imc
            };

            // Atualiza somente campos efetivamente enviados.
            // O perfil não faz parte da lista permitida.
            if (genero !== undefined) {
                dadosAtualizados.genero = genero;
            }

            if (idade !== undefined) {
                dadosAtualizados.idade = idade;
            }

            if (objetivo !== undefined) {
                dadosAtualizados.objetivo = objetivo;
            }

            if (telefone !== undefined) {
                dadosAtualizados.telefone = telefone || null;
            }

            if (status !== undefined) {
                dadosAtualizados.status = status || "Ativo";
            }

            if (senha || confSenha) {
                if (
                    typeof senha !== "string" ||
                    typeof confSenha !== "string" ||
                    !senha ||
                    !confSenha
                ) {
                    return res.status(422).json({
                        message: "Preencha a nova senha e a confirmação!"
                    });
                }

                if (senha !== confSenha) {
                    return res.status(422).json({
                        message: "As senhas não conferem!"
                    });
                }

                const salt = await bcrypt.genSalt(12);

                dadosAtualizados.senha = await bcrypt.hash(
                    senha,
                    salt
                );
            }

            await Usuarios.update(dadosAtualizados, {
                where: { id: idUsuario }
            });

            return res.status(200).json({
                message: "Usuário atualizado com sucesso!"
            });

        } catch (error) {
            Logger.error(error);

            return res.status(500).json({
                message: "Erro ao atualizar usuário!"
            });
        }
    }

    // =========================================
    // EXCLUIR USUÁRIO
    // A rota exige o perfil personal.
    // =========================================

    static async deleteUser(req, res) {
        const { idUsuario } = req.body;

        if (!idValido(idUsuario)) {
            return res.status(422).json({
                message: "Selecione um usuário válido!"
            });
        }

        try {
            const usuario = await Usuarios.findByPk(idUsuario);

            if (!usuario) {
                return res.status(404).json({
                    message: "Usuário não encontrado!"
                });
            }

            // Reverte as exclusões se uma etapa falhar.
            await Usuarios.sequelize.transaction(
                async (transaction) => {
                    await Agenda_treinos.destroy({
                        where: { usuario_id: idUsuario },
                        transaction
                    });

                    await Usuarios.destroy({
                        where: { id: idUsuario },
                        transaction
                    });
                }
            );

            return res.status(200).json({
                message: "Usuário excluído com sucesso!"
            });

        } catch (error) {
            Logger.error(error);

            return res.status(500).json({
                message: "Erro ao excluir usuário!"
            });
        }
    }

    // =========================================
    // LISTAR ALUNOS
    // A rota exige o perfil personal.
    // =========================================

    static async getAllUsers(req, res) {
        try {
            const usuarios = await Usuarios.findAll({
                where: { tipo_usuario: "aluno" },
                attributes: { exclude: ["senha"] },
                order: [["nome", "ASC"]]
            });

            return res.status(200).json(usuarios);

        } catch (error) {
            Logger.error(error);

            return res.status(500).json({
                message: "Erro ao buscar alunos!"
            });
        }
    }

    // =========================================
    // BUSCAR USUÁRIO PELO ID
    // A rota verifica personal ou o próprio aluno.
    // =========================================

    static async getUserById(req, res) {
        const idUsuario = req.params.id;

        if (!idValido(idUsuario)) {
            return res.status(422).json({
                message: "Informe um usuário válido!"
            });
        }

        try {
            const usuario = await Usuarios.findByPk(idUsuario, {
                attributes: { exclude: ["senha"] }
            });

            if (!usuario) {
                return res.status(404).json({
                    message: "Usuário não encontrado!"
                });
            }

            return res.status(200).json(usuario);

        } catch (error) {
            Logger.error(error);

            return res.status(500).json({
                message: "Erro ao buscar usuário!"
            });
        }
    }
}