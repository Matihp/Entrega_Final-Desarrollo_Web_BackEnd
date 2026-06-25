const Empleado = require('../models/Empleado');

const WebhookController = {
    atsContratacion: async (req, res, next) => {
        try {
            const { nombre, dni, email, cbu, empresaId } = req.body;

            // Validación de campos requeridos
            if (!nombre || !dni || !email || !cbu || !empresaId) {
                return res.status(400).json({ error: "Faltan datos obligatorios (nombre, dni, email, cbu, empresaId)" });
            }

            // Validación de CBU
            if (typeof cbu !== 'string' || cbu.length !== 22) {
                return res.status(400).json({ error: "El CBU debe ser una cadena de exactamente 22 dígitos" });
            }

            // Filtro Anti-Duplicados
            const empleadoExistente = await Empleado.findOne({ dni: dni });
            if (empleadoExistente) {
                return res.status(409).json({ error: "Ya existe un empleado registrado con ese DNI" });
            }

            // El alta
            const nuevoEmpleado = new Empleado({
                nombre,
                dni,
                email,
                cbu,
                empresaId
            });

            await nuevoEmpleado.save();

            res.status(201).json({
                mensaje: "Candidato del ATS registrado exitosamente",
                empleado: nuevoEmpleado
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = WebhookController;
