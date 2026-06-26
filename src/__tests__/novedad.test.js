const request = require('supertest');
const { app } = require('../app');
const { connectDB, closeDB } = require('../config/db');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

describe('Integración API Novedades', () => {
    let token;

    beforeAll(async () => {
        process.env.NODE_ENV = 'test';
        await connectDB();
        token = jwt.sign({ id: 'dummy_admin_id' }, process.env.SECRET || 'esteesunsecretkey');
    });

    afterAll(async () => {
        await closeDB();
    });

    test('POST /api/novedades debe crear una novedad y retornar 201', async () => {
        const empleadoRes = await request(app)
            .post('/api/empleados')
            .set('Authorization', `Bearer ${token}`)
            .send({
                nombre: 'Juan',
                empresaId: new mongoose.Types.ObjectId().toString(),
                dni: '11122233',
                email: 'juan@test.com',
                cbu: '1234567890123456789012'
            });
        
        const dummyEmpleadoId = empleadoRes.body._id;
        
        const nuevaNovedad = {
            empleadoId: dummyEmpleadoId,
            descripcion: 'Licencia por vacaciones',
            estado: 'pendiente'
        };

        const response = await request(app)
            .post('/api/novedades')
            .set('Authorization', `Bearer ${token}`)
            .send(nuevaNovedad)
            .expect('Content-Type', /json/)
            .expect(201);
            
        expect(response.body.descripcion).toBe(nuevaNovedad.descripcion);
        expect(response.body.estado).toBe(nuevaNovedad.estado);
        expect(response.body._id).toBeTruthy();
    });
});
