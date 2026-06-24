const mongoose = require('mongoose');

const novedadSchema = new mongoose.Schema({
    empleadoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Empleado',
        required: [true, "empleadoId y descripcion son obligatorios para la novedad"]
    },
    descripcion: {
        type: String,
        required: [true, "empleadoId y descripcion son obligatorios para la novedad"],
        minlength: [8, "La descripción de la novedad debe tener al menos 8 caracteres"]
    },
    estado: {
        type: String,
        default: 'pendiente'
    }
}, { versionKey: false });

module.exports = mongoose.model('Novedad', novedadSchema);
