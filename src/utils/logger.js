/**
 * @fileoverview A lightweight logging utility that formats console output
 * and respects the application's environment settings.
 */

/** * Flag to check if the current environment is development.
 * @type {boolean} 
 */

const isDev = process.env.NODE_ENV !== 'production';

/**
 * Formats log data into a consistent object structure.
 * * @param {string} level - The severity level of the log (e.g., 'INFO', 'WARN', 'ERROR').
 * @param {string} message - The primary log message.
 * @param {Object} [meta] - Optional metadata or error details to include in the log.
 * @returns {Object} A formatted log object including a ISO timestamp.
 */

function format(level,message,meta){
    return {
        level,
        message,
        meta,
        timestamp:new Date().toISOString()
    };
}

const logger = {
    info(message,meta ={}){
        if(isDev) console.info(format('INFO', message, meta));
    },
    warn(message,meta={}){
        if(isDev) console.warn(format('WARN', message, meta));
    },
    error(message, meta = {}){
        console.error(format('ERROR', message, meta))
    }
}
export default logger;