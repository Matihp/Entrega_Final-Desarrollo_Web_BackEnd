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
        required: [true, "El DNI es obligatorio"],
        unique: true
    },
    email: {
        type: String,
        required: [true, "El correo electrónico es obligatorio"],
        match: [/.+\@.+\..+/, "Por favor ingrese un correo válido"]
    },
    cbu: {
        type: String,
        required: [true, "El CBU es obligatorio"],
        minlength: [22, "El CBU debe tener exactamente 22 caracteres"],
        maxlength: [22, "El CBU debe tener exactamente 22 caracteres"]
    }
}, { versionKey: false });

module.exports = mongoose.model('Empleado', empleadoSchema);
