const Novedad = require('../models/Novedad');
const Empleado = require('../models/Empleado');

const NovedadController = {
    obtenerTodos: async (req, res, next) => {
        try {
            const novedades = await Novedad.find();
            res.status(200).json(novedades);
        } catch (error) {
            next(error);
        }
    },   
    crear: async (req, res, next) => {
        try {
            const empleado = await Empleado.findById(req.body.empleadoId);
            if (!empleado) {
                return res.status(400).json({ error: "No se puede registrar novedad: El empleado no existe." });
            }
            
            const nuevaNovedad = new Novedad(req.body);
            await nuevaNovedad.save();
            
            const io = req.app.get('io');
            if (io) {
                io.emit('alerta_nomina', {
                    mensaje: "¡Nuevo candidato aprobado desde el ATS! Novedad generada.",
                    novedad: nuevaNovedad
                });
            }
            
            res.status(201).json(nuevaNovedad);
        } catch (error) {
            next(error);
        }
    },    
    buscarPorId: async (req, res, next) => {
        try {
            const novedad = await Novedad.findById(req.params.id);
            if (!novedad) {
                return res.status(404).json({ error: "Novedad no encontrada" });
            }
            res.status(200).json(novedad);
        } catch (error) {
            next(error);
        }
    },    
    actualizar: async (req, res, next) => {
        try {
            const actualizada = await Novedad.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
            if (!actualizada) {
                return res.status(404).json({ error: "Novedad no encontrada para actualizar" });
            }
            
            const io = req.app.get('io');
            if (io) {
                io.emit('alerta_nomina', {
                    mensaje: "¡Novedad actualizada desde el sistema!",
                    novedad: actualizada
                });
            }
            
            res.status(200).json(actualizada);
        } catch (error) {
            next(error);
        }
    },    
    eliminar: async (req, res, next) => {
        try {
            const eliminada = await Novedad.findByIdAndDelete(req.params.id);
            if (!eliminada) {
                return res.status(404).json({ error: "Novedad no encontrada para eliminar" });
            }
            res.status(200).json({ mensaje: "Novedad eliminada correctamente", novedad: eliminada });
        } catch (error) {
            next(error);
        }
    },
    cambiarEstado: async (req, res, next) => {
        try {
            const { estado } = req.body;
            if (!['pendiente', 'procesada', 'rechazada'].includes(estado)) {
                return res.status(400).json({ error: "El estado proporcionado es inválido." });
            }
            
            const actualizada = await Novedad.findByIdAndUpdate(req.params.id, { estado }, { new: true, runValidators: true });
            if (!actualizada) {
                return res.status(404).json({ error: "Novedad no encontrada" });
            }
            res.status(200).json(actualizada);
        } catch (error) {
            next(error);
        }
    }
};

module.exports = NovedadController;
