const request = require('supertest');
const { app } = require('../app');
const { connectDB, closeDB } = require('../config/db');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

describe('Integración API Empleados', () => {
    let token;

    beforeAll(async () => {
        process.env.NODE_ENV = 'test';
        await connectDB();
        token = jwt.sign({ id: 'admin_id' }, process.env.SECRET);
    });

    afterAll(async () => {
        await closeDB();
    });

    test('POST /api/empleados debe crear un empleado y retornar 201', async () => {
        const dummyEmpresaId = new mongoose.Types.ObjectId().toString();
        
        const nuevoEmpleado = {
            nombre: 'Juan Perez',
            empresaId: dummyEmpresaId,
            dni: '12345678A',
            email: 'juan@example.com',
            cbu: '1234567890123456789012'
        };

        const response = await request(app)
            .post('/api/empleados')
            .set('Authorization', `Bearer ${token}`)
            .send(nuevoEmpleado)
            .expect('Content-Type', /json/)
            .expect(201);
            
        expect(response.body.nombre).toBe(nuevoEmpleado.nombre);
        expect(response.body.email).toBe(nuevoEmpleado.email);
        expect(response.body._id).toBeTruthy();
    });
});
