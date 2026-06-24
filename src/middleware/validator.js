// Middleware para verificar que los datos obligatorios no falten
const validationMiddleware = (req, res, next) => {
    if ((req.method === 'POST' || req.method === 'PUT') && Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'Faltan datos en la petición. El cuerpo no puede estar vacío.' });
    }
    next();
};

module.exports = validationMiddleware;
