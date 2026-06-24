const Empresa = require('../models/Empresa');
const Empleado = require('../models/Empleado');

const EmpresaController = {
    obtenerTodos: async (req, res, next) => {
        try {
            const empresas = await Empresa.find();
            res.status(200).json(empresas);
        } catch (error) {
            next(error);
        }
    },    
    buscarPorId: async (req, res, next) => {
        try {
            const empresa = await Empresa.findById(req.params.id);
            if (!empresa) {
                return res.status(404).json({ error: "Empresa no encontrada" });
            }
            res.status(200).json(empresa);
        } catch (error) {
            next(error);
        }
    },   
    crear: async (req, res, next) => {
        try {
            const nuevaEmpresa = new Empresa(req.body);
            await nuevaEmpresa.save();
            res.status(201).json(nuevaEmpresa);
        } catch (error) {
            next(error);
        }
    },   
    actualizar: async (req, res, next) => {
        try {
            const actualizada = await Empresa.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
            if (!actualizada) {
                return res.status(404).json({ error: "Empresa no encontrada para actualizar" });
            }
            res.status(200).json(actualizada);
        } catch (error) {
            next(error);
        }
    },  
    eliminar: async (req, res, next) => {
        try {
            const tieneEmpleados = await Empleado.exists({ empresaId: req.params.id });
            
            if (tieneEmpleados) {
                return res.status(400).json({ error: "No se puede eliminar la empresa porque tiene empleados asociados. Elimínelos primero." });
            }
            
            const eliminada = await Empresa.findByIdAndDelete(req.params.id);
            if (!eliminada) {
                return res.status(404).json({ error: "Empresa no encontrada para eliminar" });
            }
            res.status(200).json({ mensaje: "Empresa eliminada correctamente", empresa: eliminada });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = EmpresaController;
