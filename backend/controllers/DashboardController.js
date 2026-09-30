// Importa o operador Op do Sequelize
// Neste Controller ele é usado com Op.in para buscar valores dentro de uma lista
import { Op } from "sequelize";

// Importa os models utilizados pelo Dashboard
import Usuarios from "../models/Usuarios.js";
import Agenda_treinos from "../models/Agenda_treinos.js";
import Treinos from "../models/Treinos.js";
import Treino_exercicios from "../models/Treino_exercicios.js";
import Exercicios from "../models/Exercicios.js";
import Historico_cargas from "../models/Historico_cargas.js";
import Avaliacoes from "../models/Avaliacoes.js";

// Importa o Logger para registrar erros da aplicação
import Logger from "../db/logger.js";


export default class DashboardController {

    // =========================================
    // BUSCAR DADOS DO DASHBOARD
    // =========================================
    static async getDashboard(req, res) {

        // Recebe o ID do usuário através dos parâmetros da rota
        const { usuario_id } = req.params;


        try {

            // =========================================
            // USUÁRIO
            // =========================================

            // Busca o usuário pela chave primária
            const usuario =
                await Usuarios.findByPk(
                    usuario_id
                );


            // Verifica se o usuário existe
            if (!usuario) {

                return res.status(404).json({
                    message:
                        "Usuário não encontrado!"
                });

            }


            // =========================================
            // DATA DE HOJE
            // =========================================

            // Cria uma data referente ao momento atual
            const hoje =
                new Date();


            // Obtém o ano atual
            const ano =
                hoje.getFullYear();


            // Obtém o mês atual
            // getMonth() começa em 0, por isso somamos 1
            // padStart garante dois dígitos, exemplo: 09
            const mes =
                String(
                    hoje.getMonth() + 1
                ).padStart(2, "0");


            // Obtém o dia atual
            // padStart garante dois dígitos, exemplo: 05
            const dia =
                String(
                    hoje.getDate()
                ).padStart(2, "0");


            // Monta a data no formato AAAA-MM-DD
            const dataHoje =
                `${ano}-${mes}-${dia}`;


            // =========================================
            // AVALIAÇÃO MAIS RECENTE
            // =========================================

            // Busca a avaliação mais recente do usuário
            const ultimaAvaliacao =
                await Avaliacoes.findOne({

                    // Filtra pelo usuário
                    where: {
                        usuario_id
                    },

                    // DESC coloca os registros mais recentes primeiro
                    order: [
                        ["data_avaliacao", "DESC"],
                        ["id", "DESC"]
                    ]

                });


            // =========================================
            // TREINO DE HOJE
            // =========================================

            // Busca um treino agendado para o usuário
            // na data atual
            const agenda =
                await Agenda_treinos.findOne({

                    where: {
                        usuario_id,
                        data: dataHoje
                    },

                    // Caso existam registros, prioriza o maior ID
                    order: [
                        ["id", "DESC"]
                    ]

                });


            // Inicializa as variáveis que serão utilizadas
            // para montar os dados do Dashboard
            let treino = null;
            let exercicios = [];

            let maiorCarga = null;
            let ultimaCarga = null;

            let evolucaoCarga = [];


            // Só executa este bloco caso exista
            // um treino agendado para hoje
            if (agenda) {

                // Busca os dados do treino pela chave primária
                treino =
                    await Treinos.findByPk(
                        agenda.treino_id
                    );


                // Busca os exercícios associados ao treino
                const treinoExercicios =
                    await Treino_exercicios.findAll({

                        // Filtra pelo treino agendado
                        where: {
                            treino_id:
                                agenda.treino_id
                        },

                        // Traz também os dados relacionados
                        // do model Exercicios
                        include: [
                            {
                                model: Exercicios,

                                // Define quais dados do exercício
                                // serão retornados
                                attributes: [
                                    "id",
                                    "nome",
                                    "grupo_muscular"
                                ]
                            }
                        ],

                        // Ordena os registros pelo ID
                        // em ordem crescente
                        order: [
                            ["id", "ASC"]
                        ]

                    });


                // Percorre os registros e cria um novo array
                // com os dados necessários dos exercícios
                exercicios =
                    treinoExercicios.map(
                        (item) => ({

                            id:
                                item.id,

                            series:
                                item.series,

                            repeticoes:
                                item.repeticoes,

                            exercicio:
                                item.exercicio

                        })
                    );


                // Cria um novo array contendo somente
                // os IDs das relações treino/exercício
                const idsTreinoExercicios =
                    treinoExercicios.map(
                        (item) =>
                            item.id
                    );


                // =========================================
                // CARGAS DO USUÁRIO
                // =========================================

                // Só busca o histórico caso exista
                // pelo menos um exercício no treino
                if (
                    idsTreinoExercicios.length > 0
                ) {

                    // Busca os históricos de cargas do usuário
                    const historicos =
                        await Historico_cargas.findAll({

                            where: {

                                // Filtra pelo usuário
                                usuario_id,

                                // Op.in busca registros cujo
                                // treino_exercicios_id esteja
                                // dentro da lista de IDs
                                treino_exercicios_id: {
                                    [Op.in]:
                                        idsTreinoExercicios
                                }

                            },

                            // Ordena os históricos pela data
                            // e pelo ID em ordem crescente
                            order: [
                                ["data_inicial", "ASC"],
                                ["id", "ASC"]
                            ]

                        });


                    // Verifica se existem registros
                    // no histórico de cargas
                    if (
                        historicos.length > 0
                    ) {

                        // Como o histórico está em ordem crescente,
                        // o último elemento representa a carga
                        // registrada mais recentemente
                        ultimaCarga =
                            Number(
                                historicos[
                                    historicos.length - 1
                                ].peso
                            );


                        // Obtém a maior carga registrada
                        // Math.max retorna o maior número
                        maiorCarga =
                            Math.max(
                                ...historicos.map(
                                    (item) =>
                                        Number(
                                            item.peso
                                        )
                                )
                            );


                        // Cria um novo array contendo
                        // data e carga para mostrar
                        // a evolução das cargas
                        evolucaoCarga =
                            historicos.map(
                                (item) => ({

                                    data:
                                        item.data_inicial,

                                    carga:
                                        Number(
                                            item.peso
                                        )

                                })
                            );

                    }

                }

            }


            // =========================================
            // ESTATÍSTICAS DOS TREINOS
            // =========================================

            // Conta todos os treinos agendados
            // daquele usuário
            const quantidadeTreinos =
                await Agenda_treinos.count({

                    where: {
                        usuario_id
                    }

                });


            // Conta somente os treinos que
            // possuem status "concluido"
            const quantidadeTreinosConcluidos =
                await Agenda_treinos.count({

                    where: {

                        usuario_id,

                        status:
                            "concluido"

                    }

                });


            // =========================================
            // RESPOSTA
            // =========================================

            // Retorna para o frontend todos os dados
            // necessários para montar o Dashboard
            return res.status(200).json({

                // Dados do usuário
                usuario: {

                    id:
                        usuario.id,

                    nome:
                        usuario.nome,

                    // Se existir uma avaliação recente,
                    // utiliza o peso dessa avaliação.
                    // Caso contrário, utiliza o peso do usuário.
                    peso:
                        ultimaAvaliacao
                            ? Number(
                                ultimaAvaliacao.peso
                            )
                            : usuario.peso,

                    // Utiliza a altura da última avaliação
                    // quando ela estiver disponível
                    altura:
                        ultimaAvaliacao
                            ? Number(
                                ultimaAvaliacao.altura
                            )
                            : usuario.altura,

                    objetivo:
                        usuario.objetivo,

                    // Utiliza o IMC da última avaliação
                    // quando ela estiver disponível
                    imc:
                        ultimaAvaliacao
                            ? Number(
                                ultimaAvaliacao.imc
                            )
                            : usuario.imc

                },


                // Se existir treino e agenda para hoje,
                // retorna os dados do treino.
                // Caso contrário, retorna null.
                treino_hoje:
                    treino && agenda
                        ? {

                            // Converte os dados do treino
                            // para objeto e adiciona suas propriedades
                            ...treino.toJSON(),

                            agenda_id:
                                agenda.id,

                            status:
                                agenda.status,

                            exercicios

                        }
                        : null,


                // Estatísticas apresentadas no Dashboard
                estatisticas: {

                    treinos_agendados:
                        quantidadeTreinos,

                    treinos_concluidos:
                        quantidadeTreinosConcluidos,

                    exercicios_no_treino:
                        exercicios.length,

                    maior_carga:
                        maiorCarga,

                    ultima_carga:
                        ultimaCarga

                },


                // Dados utilizados para mostrar
                // a evolução das cargas
                evolucao_carga:
                    evolucaoCarga

            });


        } catch (error) {

            // Registra o erro no Logger
            Logger.error(
                `Erro ao carregar dashboard: ${error}`
            );


            // Retorna erro interno do servidor
            return res.status(500).json({

                message:
                    "Erro ao carregar dashboard!"

            });

        }

    }

}