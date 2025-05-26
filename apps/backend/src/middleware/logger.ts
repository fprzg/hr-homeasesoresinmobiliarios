import { type MiddlewareHandler } from "hono";
import { getConnInfo } from "hono/bun";
import { logger } from "@/lib/logger";

export const middlewareLogger: MiddlewareHandler = async (c, next) => {
    const start = process.hrtime.bigint(); // nanosegundos
    await next();
    const end = process.hrtime.bigint();
    const durationMicroseconds = Number(end - start) / 1_000; // convert to microseconds

    const userAgent = c.req.header('User-Agent') || 'N/A';

    const info = getConnInfo(c);
    const ip = info.remote.address || 'N/A';
    //const ip = info.remote.address || c.req.header('X-Forwarded-For')?.split(',')[0].trim() || 'N/A';

    // Puedes obtener el ID de usuario si ya lo tienes en el contexto de Hono (por ejemplo, después de autenticación)
    // let userId = 'N/A';
    // if (c.get('user')) { // Suponiendo que guardas el usuario autenticado en c.set('user', ...)
    //     userId = c.get('user').id;
    // }

    logger.info("", {
        "Method": c.req.method,
        "URL": c.req.url,
        "Status": c.res.status,
        "Duration": `${durationMicroseconds.toFixed(3)}µs`,
        "IP": ip,
        //"User-Agent": userAgent,
    });
}




/*
import { Logger, LogLevel } from './logger';

const myLogger = new Logger(LogLevel.INFO); // Solo mostrará INFO, WARN, ERROR, FATAL

myLogger.debug("Este es un mensaje de depuración y no debería aparecer.");

myLogger.info("¡Aplicación iniciada correctamente!", { version: "1.0.0", environment: "development" });

myLogger.warn("Se ha detectado una configuración obsoleta.", { configKey: "deprecatedFeature", suggestedAlternative: "newFeature" });

try {
  throw new Error("Algo salió terriblemente mal en el procesamiento de datos.");
} catch (e) {
  myLogger.error("Error al procesar los datos del usuario.", e as Error, { userId: "abc-123" });
}

myLogger.fatal("¡Error crítico del sistema! Se requiere atención inmediata.", new Error("La base de datos no responde."), { service: "database-connector" });

// Ejemplo de recepción de un JSON de log
const incomingJsonLog = '{"timestamp": "2023-10-27T10:30:00.000Z", "level": "DEBUG", "message": "Datos recibidos de la API", "context": {"endpoint": "/api/data"}}';
myLogger.receiveLog(incomingJsonLog);

const malformedJson = '{"timestamp": "2023-10-27T10:35:00.000Z", "level": "INFO", "message": "Esto es un JSON mal formado",';
myLogger.receiveLog(malformedJson);
*/