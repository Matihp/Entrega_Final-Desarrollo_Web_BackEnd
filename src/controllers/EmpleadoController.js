const Empleado = require('../models/Empleado');
const Novedad = require('../models/Novedad');

const EmpleadoController = {
    obtenerTodos: async (req, res, next) => {
        try {
            const empleados = await Empleado.find();
            res.status(200).json(empleados);
        } catch (error) {
            next(error);
        }
    },    
    buscarPorId: async (req, res, next) => {
        try {
            const empleado = await Empleado.findById(req.params.id);
            if (!empleado) {
                return res.status(404).json({ error: "Empleado no encontrado" });
            }
            res.status(200).json(empleado);
        } catch (error) {
            next(error);
        }
    },    
    crear: async (req, res, next) => {
        try {
            const nuevoEmpleado = new Empleado(req.body);
            await nuevoEmpleado.save();
            res.status(201).json(nuevoEmpleado);
        } catch (error) {
            next(error);
        }
    },    
    actualizar: async (req, res, next) => {
        try {
            const actualizado = await Empleado.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
            if (!actualizado) {
                return res.status(404).json({ error: "Empleado no encontrado para actualizar" });
            }
            res.status(200).json(actualizado);
        } catch (error) {
            next(error);
        }
    },   
    eliminar: async (req, res, next) => {
        try {
            const tieneNovedades = await Novedad.exists({ empleadoId: req.params.id });
            
            if (tieneNovedades) {
                return res.status(400).json({ error: "No se puede eliminar el empleado porque tiene novedades asociadas. Elimínelas primero." });
            }
            
            const eliminado = await Empleado.findByIdAndDelete(req.params.id);
            if (!eliminado) {
                return res.status(404).json({ error: "Empleado no encontrado para eliminar" });
            }
            res.status(200).json({ mensaje: "Empleado eliminado", empleado: eliminado });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = EmpleadoController;
