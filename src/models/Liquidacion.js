const mongoose = require('mongoose');

const liquidacionSchema = new mongoose.Schema({
    empleadoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Empleado',
        required: [true, "Empleado, mes y monto son obligatorios"]
    },
    mes: {
        type: String,
        required: [true, "Empleado, mes y monto son obligatorios"]
    },
    monto: {
        type: Number,
        required: [true, "Empleado, mes y monto son obligatorios"],
        min: [0.01, "El monto de la liquidación debe ser mayor a 0"]
    }
}, { versionKey: false });

module.exports = mongoose.model('Liquidacion', liquidacionSchema);
