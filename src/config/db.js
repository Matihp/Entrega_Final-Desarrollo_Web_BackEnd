const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dswb_grupo6';
        await mongoose.connect(uri);
        console.log('Conexión a MongoDB exitosa');
    } catch (error) {
        console.error('Error en la conexión a MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
