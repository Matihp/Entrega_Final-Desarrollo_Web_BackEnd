const mongoose = require('mongoose');
let mongoServer;

const connectDB = async () => {
    try {
        if (process.env.NODE_ENV === 'test') {
            const { MongoMemoryServer } = require('mongodb-memory-server');
            mongoServer = await MongoMemoryServer.create();
            const uri = mongoServer.getUri();
            await mongoose.connect(uri);
            console.log('Conexión a MongoDB en Memoria (Test) exitosa');
        } else {
            const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dswb_grupo6';
            await mongoose.connect(uri);
            console.log('Conexión a MongoDB exitosa');
        }
    } catch (error) {
        console.error('Error en la conexión a MongoDB:', error.message);
        process.exit(1);
    }
};

const closeDB = async () => {
    await mongoose.disconnect();
    if (mongoServer) {
        await mongoServer.stop();
    }
};

module.exports = { connectDB, closeDB };
