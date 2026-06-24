const Liquidacion = require('../models/Liquidacion');
const Empleado = require('../models/Empleado');

const LiquidacionController = {
    obtenerTodos: async (req, res, next) => {
        try {
            const liquidaciones = await Liquidacion.find();
            res.status(200).json(liquidaciones);
        } catch (error) {
            next(error);
        }
    },   
    buscarPorId: async (req, res, next) => {
        try {
            const liquidacion = await Liquidacion.findById(req.params.id);
            if (!liquidacion) {
                return res.status(404).json({ error: "Liquidación no encontrada" });
            }
            res.status(200).json(liquidacion);
        } catch (error) {
            next(error);
        }
    },  
    crear: async (req, res, next) => {
        try {
            if (req.body.empleadoId) {
                const empleado = await Empleado.findById(req.body.empleadoId);
                if (!empleado) {
                    return res.status(400).json({ error: "El empleado especificado no existe" });
                }
            }
            const nuevaLiquidacion = new Liquidacion(req.body);
            await nuevaLiquidacion.save();
            res.status(201).json(nuevaLiquidacion);
        } catch (error) {
            next(error);
        }
    },   
    actualizar: async (req, res, next) => {
        try {
            if (req.body.empleadoId) {
                const empleado = await Empleado.findById(req.body.empleadoId);
                if (!empleado) {
                    return res.status(400).json({ error: "El empleado especificado no existe" });
                }
            }
            const actualizada = await Liquidacion.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
            if (!actualizada) {
                return res.status(404).json({ error: "Liquidación no encontrada para actualizar" });
            }
            res.status(200).json(actualizada);
        } catch (error) {
            next(error);
        }
    },   
    eliminar: async (req, res, next) => {
        try {
            const eliminada = await Liquidacion.findByIdAndDelete(req.params.id);
            if (!eliminada) {
                return res.status(404).json({ error: "Liquidación no encontrada para eliminar" });
            }
            res.status(200).json({ mensaje: "Liquidación eliminada correctamente", liquidacion: eliminada });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = LiquidacionController;
