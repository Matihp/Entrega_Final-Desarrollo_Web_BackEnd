const errorHandler = (err, req, res, next) => {
    console.error("Error capturado:", err.message);
    
    // Errores de validación de Mongoose
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({ error: messages.join(', ') });
    }
    
    // Errores de CastError (IDs inválidos en Mongoose)
    if (err.name === 'CastError') {
        return res.status(400).json({ error: 'ID con formato inválido' });
    }

    res.status(500).json({ error: err.message || 'Error interno del servidor' });
};

module.exports = errorHandler;
