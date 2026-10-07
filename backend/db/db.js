// Importa o Sequelize, utilizado para fazer a conexão
import { Sequelize } from "sequelize";

// Importa o dotenv para acessar as variáveis do arquivo .env
import dotenv from "dotenv";

// Importa o Logger para registrar mensagens no terminal
import Logger from "./logger.js";

// Carrega as variáveis do arquivo .env para o process.env
dotenv.config();

// Acessa as configurações do banco armazenadas no .env
const dbUser = process.env.DB_USER;         
const dbPassword = process.env.DB_PASS;    
const dbName = process.env.DB_NAME;         
const dbHost = process.env.DB_HOST;         
const dbDialect = process.env.DB_DIALECT;   

// Cria a instância do Sequelize utilizando
// as configurações do banco de dados
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    dialect: dbDialect,
});

// Função responsável por testar a conexão com o banco
async function connectDB() {
    try {
        // Tenta autenticar/conectar ao banco de dados
        await sequelize.authenticate();

        // Se a conexão funcionar, registra a mensagem de sucesso
        Logger.info("DB Connected");

    } catch (err) {
        // Se ocorrer algum erro na conexão,
        // registra as mensagens de erro
        Logger.error("Could not connect to db");
        Logger.error(`Error: ${err}`);
    }
}

// Executa a função que testa a conexão com o banco
connectDB();

// Exporta a instância do Sequelize para ser utilizada
// em outros arquivos do backend, principalmente nos Models
export default sequelize;