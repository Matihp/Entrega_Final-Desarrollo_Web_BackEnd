const mongoose = require('mongoose');

const empresaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, "El nombre es obligatorio para la empresa"],
        minlength: [3, "El nombre de la empresa debe tener un mínimo de 3 caracteres"]
    },
    cuit: {
        type: String,
        required: [true, "El CUIT es obligatorio para la empresa"],
        minlength: [11, "El CUIT debe tener al menos 11 caracteres (ej: 20123456789)"]
    }
}, { versionKey: false });

module.exports = mongoose.model('Empresa', empresaSchema);
