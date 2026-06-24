const fs = require('fs');
const path = require('path');

// Middleware para registrar cada acción importante
const auditMiddleware = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${req.method} ${req.originalUrl}\n`;
    console.log(logMessage.trim());
    
    const logPath = path.join(__dirname, '../../auditoria.log');
    try {
        fs.appendFileSync(logPath, logMessage, 'utf8');
    } catch (err) {
        console.error("Error guardando log de auditoría:", err.message);
    }
    
    next();
};

module.exports = auditMiddleware;
