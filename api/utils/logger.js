import winston from 'winston';
import moment from 'moment-timezone';

// Obtener el entorno actual
const environment = process.env.NODE_ENV || 'development';

// Configurar formato para los logs
const timestampFormat = () =>
    moment().tz('America/Argentina/Buenos_Aires').format('YYYY-MM-DD HH:mm:ss');

const consoleFormat = winston.format.printf(({ level, message, timestamp }) => {
    return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
});

// Configuración del logger
const logger = winston.createLogger({
    level: environment === 'development' ? 'debug' : 'info', // Más detallado en desarrollo
    format: winston.format.combine(
        winston.format.timestamp({ format: timestampFormat }),
        environment === 'development'
            ? winston.format.combine(
                  winston.format.colorize(), // Colores en desarrollo
                  consoleFormat // Formato legible
              )
            : winston.format.json() // JSON en producción
    ),
    transports: [
        new winston.transports.File({ filename: './log/api_iott11.log', level: 'debug' }), // Todo en un archivo
        new winston.transports.Console(), // Siempre en consola
    ],
});

// Sobrescribir los métodos de consola para redirigirlos al logger
console.log = (...args) => logger.info(args.join(' ')); // Redirige console.log a Winston
console.error = (...args) => logger.error(args.join(' ')); // Redirige console.error a Winston
console.warn = (...args) => logger.warn(args.join(' ')); // Redirige console.warn a Winston
console.debug = (...args) => logger.debug(args.join(' ')); // Redirige console.debug a Winston
console.info = (...args) => logger.info(args.join(' ')); // Redirige console.info a Winston

// Exportar el logger
export default logger;
