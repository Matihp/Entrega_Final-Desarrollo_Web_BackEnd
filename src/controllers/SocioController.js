const Socio = require('../models/Socio');

const SocioController = {
    obtenerTodos: async (req, res, next) => {
        try {
            const socios = await Socio.find();
            res.status(200).json(socios);
        } catch (error) {
            next(error);
        }
    },    
    buscarPorId: async (req, res, next) => {
        try {
            const socio = await Socio.findById(req.params.id);
            if (!socio) {
                return res.status(404).json({ error: "Socio no encontrado" });
            }
            res.status(200).json(socio);
        } catch (error) {
            next(error);
        }
    },    
    crear: async (req, res, next) => {
        try {
            const nuevoSocio = new Socio(req.body);
            await nuevoSocio.save();
            res.status(201).json(nuevoSocio);
        } catch (error) {
            next(error);
        }
    },    
    actualizar: async (req, res, next) => {
        try {
            const actualizado = await Socio.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
            if (!actualizado) {
                return res.status(404).json({ error: "Socio no encontrado para actualizar" });
            }
            res.status(200).json(actualizado);
        } catch (error) {
            next(error);
        }
    },   
    eliminar: async (req, res, next) => {
        try {
            const eliminado = await Socio.findByIdAndDelete(req.params.id);
            if (!eliminado) {
                return res.status(404).json({ error: "Socio no encontrado para eliminar" });
            }
            res.status(200).json({ mensaje: "Socio eliminado correctamente", socio: eliminado });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = SocioController;
