// Model responsável pelos usuários
import Usuarios from "../models/Usuarios.js";

// Logger utilizado para registrar erros
import Logger from "../db/logger.js";

// Biblioteca utilizada para gerar o hash das senhas
import bcrypt from "bcrypt";

// Model responsável pela agenda de treinos
import Agenda_treinos from "../models/Agenda_treinos.js";

export default class UserController {

    // =========================================
    // CADASTRAR USUÁRIO
    // =========================================

    static async register(req, res) {

        // Recebe os dados enviados no corpo da requisição
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

        // Valida os campos obrigatórios
        if (!nome) {
            return res.status(422).json({
                message: "O nome de usuário é obrigatório!"
            });
        }

        if (!email) {
            return res.status(422).json({
                message: "O e-mail é obrigatório!"
            });
        }

        if (!senha) {
            return res.status(422).json({
                message: "A senha é obrigatória!"
            });
        }

        if (!confSenha) {
            return res.status(422).json({
                message: "A confirmação da senha é obrigatória!"
            });
        }

        // Verifica se a senha e a confirmação são iguais
        if (senha !== confSenha) {
            return res.status(422).json({
                message: "As senhas não conferem!"
            });
        }

        try {

            // Procura um usuário que já possua o e-mail informado
            const usuarioExists = await Usuarios.findOne({
                where: {
                    email
                }
            });

            // Impede o cadastro de e-mails duplicados
            if (usuarioExists) {
                return res.status(422).json({
                    message: "Este e-mail já foi cadastrado!"
                });
            }

            // Gera o salt e o hash da senha utilizando bcrypt
            const salt = await bcrypt.genSalt(12);

            const passwordHash = await bcrypt.hash(
                senha,
                salt
            );

            // O IMC começa como nulo
            let imc = null;

            // Calcula o IMC somente se peso e altura forem informados
            if (peso && altura) {

                imc =
                    peso /
                    (
                        (altura / 100) *
                        (altura / 100)
                    );

                // Limita o IMC a duas casas decimais
                imc = Number(
                    imc.toFixed(2)
                );
            }

            // Cria o usuário no banco de dados
            await Usuarios.create({
                nome,
                email,

                // Armazena o hash em vez da senha original
                senha: passwordHash,

                peso,
                altura,
                genero,
                idade,
                objetivo,

                // Caso não tenha telefone, salva null
                telefone: telefone || null,

                // Caso não tenha status, define como Ativo
                status: status || "Ativo",

                imc
            });

            // Retorna sucesso para o frontend
            return res.status(200).json({
                message: "Usuário cadastrado com sucesso!"
            });

        } catch (error) {

            // Registra o erro no logger
            Logger.error(error);

            return res.status(500).json({
                message: "Erro ao criar usuário!"
            });
        }
    }


    // =========================================
    // ATUALIZAR USUÁRIO
    // =========================================

    static async updateUser(req, res) {

        // Recebe os novos dados enviados na requisição
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

        // Verifica se um usuário foi selecionado
        if (!idUsuario) {
            return res.status(422).json({
                message: "Selecione um usuário!"
            });
        }

        // Valida o nome
        if (!nome) {
            return res.status(422).json({
                message: "O nome é obrigatório!"
            });
        }

        try {

            // Procura o usuário pela chave primária (ID)
            const usuario = await Usuarios.findByPk(
                idUsuario
            );

            // Retorna 404 caso o usuário não exista
            if (!usuario) {
                return res.status(404).json({
                    message: "Usuário não encontrado!"
                });
            }

            // =====================================
            // DADOS QUE SERÃO ATUALIZADOS
            // =====================================

            // Cria um objeto com os novos dados
            const dadosAtualizados = {
                nome,
                peso,
                altura,
                genero,
                idade,
                objetivo,
                telefone: telefone || null,
                status: status || "Ativo"
            };

            // =====================================
            // ATUALIZAR SENHA SOMENTE SE INFORMADA
            // =====================================

            // Executa este bloco caso senha ou confirmação
            // tenham sido informadas
            if (senha || confSenha) {

                // Exige os dois campos
                if (!senha || !confSenha) {
                    return res.status(422).json({
                        message:
                            "Preencha a nova senha e a confirmação!"
                    });
                }

                // Verifica se as senhas são iguais
                if (senha !== confSenha) {
                    return res.status(422).json({
                        message:
                            "As senhas não conferem!"
                    });
                }

                // Gera um novo hash para a nova senha
                const salt =
                    await bcrypt.genSalt(12);

                const passwordHash =
                    await bcrypt.hash(
                        senha,
                        salt
                    );

                // Adiciona a nova senha protegida
                // ao objeto de atualização
                dadosAtualizados.senha =
                    passwordHash;
            }

            // =====================================
            // CALCULAR IMC
            // =====================================

            let imc = null;

            // O cálculo só acontece se houver peso e altura
            if (peso && altura) {

                imc =
                    peso /
                    (
                        (altura / 100) *
                        (altura / 100)
                    );

                imc = Number(
                    imc.toFixed(2)
                );
            }

            // Adiciona o IMC aos dados que serão atualizados
            dadosAtualizados.imc = imc;

            // Atualiza o usuário correspondente ao ID informado
            await Usuarios.update(
                dadosAtualizados,
                {
                    where: {
                        id: idUsuario
                    }
                }
            );

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
    // =========================================

    static async deleteUser(req, res) {

        // Recebe o ID do usuário enviado na requisição
        const idUsuario =
            req.body.idUsuario;

        // Verifica se o ID foi informado
        if (!idUsuario) {
            return res.status(422).json({
                message: "Selecione um usuário!"
            });
        }

        try {

            // Procura o usuário pelo ID
            const usuario =
                await Usuarios.findOne({
                    where: {
                        id: idUsuario
                    }
                });

            // Verifica se o usuário existe
            if (!usuario) {
                return res.status(404).json({
                    message: "Usuário não encontrado!"
                });
            }

            // Exclui os registros da agenda relacionados ao usuário
            await Agenda_treinos.destroy({
                where: {
                    usuario_id: idUsuario
                }
            });

            // Exclui o usuário do banco de dados
            await Usuarios.destroy({
                where: {
                    id: idUsuario
                }
            });

            return res.status(200).json({
                message: "Usuário excluído com sucesso!"
            });

        } catch (error) {

            Logger.error(error);

            return res.status(500).json({
                message: "Erro ao excluir usuário!",
                error: error.message
            });
        }
    }


    // =========================================
    // LISTAR ALUNOS
    // =========================================

    static async getAllUsers(req, res) {

        try {

            // Busca todos os usuários do tipo aluno
            const usuarios =
                await Usuarios.findAll({

                    // Filtra somente usuários do tipo aluno
                    where: {
                        tipo_usuario: "aluno"
                    },

                    // Não retorna a senha na resposta
                    attributes: {
                        exclude: ["senha"]
                    },

                    // Ordena os alunos pelo nome em ordem crescente
                    order: [
                        ["nome", "ASC"]
                    ]
                });

            // Retorna a lista de alunos em JSON
            return res.status(200).json(
                usuarios
            );

        } catch (error) {

            Logger.error(error);

            return res.status(500).json({
                message: "Erro ao buscar alunos!"
            });
        }
    }


    // =========================================
    // BUSCAR USUÁRIO PELO ID
    // =========================================

    static async getUserById(req, res) {

        // Obtém o ID enviado como parâmetro na URL
    
        const idUsuario =
            req.params.id;

        try {

            // Busca o usuário pela chave primária (ID)
            const usuario =
                await Usuarios.findByPk(
                    idUsuario,
                    {
                        // Não retorna a senha
                        attributes: {
                            exclude: ["senha"]
                        }
                    }
                );

            // Retorna 404 caso o usuário não seja encontrado
            if (!usuario) {
                return res.status(404).json({
                    message: "Usuário não encontrado!"
                });
            }

            // Retorna os dados do usuário encontrado
            return res.status(200).json(
                usuario
            );

        } catch (error) {

            Logger.error(error);

            return res.status(500).json({
                message: "Erro ao buscar usuário!"
            });
        }
    }
}