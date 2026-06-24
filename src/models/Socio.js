const mongoose = require('mongoose');

const socioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, "Nombre y porcentaje de participación son obligatorios"],
        minlength: [3, "El nombre del socio debe tener al menos 3 caracteres"]
    },
    porcentajeParticipacion: {
        type: Number,
        required: [true, "Nombre y porcentaje de participación son obligatorios"],
        min: [0.01, "El porcentaje de participación debe ser mayor a 0"]
    }
}, { versionKey: false });

module.exports = mongoose.model('Socio', socioSchema);
