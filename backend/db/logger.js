// Importa o Winston, biblioteca utilizada para registrar e gerenciar logs
import winston from 'winston';

// Define os níveis de log e suas prioridades
const levels = {
    error: 0, 
    warn: 1,  
    info: 2,  
    http: 3,  
    debug: 4, 
};

// Define qual nível de log será utilizado
const level = () => {
    // Define que o sistema está em ambiente de desenvolvimento
    const isDevelopment = true;

    // Se estiver em desenvolvimento retorna "debug", caso contrário retorna "warn"
    return isDevelopment ? 'debug' : 'warn';
};

// Define uma cor para cada nível de log
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
};

// Adiciona as cores configuradas ao Winston
winston.addColors(colors);

// Define o formato em que os logs serão exibidos
const format = winston.format.combine(

    // Adiciona data e horário ao log
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),

    // Adiciona cores às mensagens de log
    winston.format.colorize({ all: true }),

    // Define como as informações do log serão organizadas e exibidas
    winston.format.printf(
        (info) => `${info.timestamp} - ${info.level}: ${info.message}`
    )
);

// Define para onde os logs serão enviados
const transports = [

    // Exibe os logs no console/terminal
    new winston.transports.Console(),

    // Salva os logs de erro no arquivo error.log
    new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
    }),

    // Salva os logs no arquivo all.log
    new winston.transports.File({
        filename: 'logs/all.log'
    }),
];

// Cria e configura o Logger utilizando as configurações definidas acima
const Logger = winston.createLogger({
    level: level(), 
    levels,         
    format,        
    transports,     
});

// Exporta o Logger para ser utilizado em outras partes do backend
export default Logger;