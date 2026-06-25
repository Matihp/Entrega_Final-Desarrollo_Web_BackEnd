const mongoose = require('mongoose');

const empleadoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, "Nombre y empresaId son obligatorios para el empleado"],
        minlength: [4, "El nombre y apellido del empleado debe tener un mínimo de 4 caracteres"]
    },
    empresaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Empresa',
        required: [true, "Nombre y empresaId son obligatorios para el empleado"]
    },
    dni: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    cbu: {
        type: String,
        required: false
    }
}, { versionKey: false });

module.exports = mongoose.model('Empleado', empleadoSchema);
