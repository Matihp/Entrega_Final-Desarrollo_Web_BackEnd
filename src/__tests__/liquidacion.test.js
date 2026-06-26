const request = require('supertest');
const { app } = require('../app');
const { connectDB, closeDB } = require('../config/db');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

describe('Integración API Liquidaciones', () => {
    let token;

    beforeAll(async () => {
        process.env.NODE_ENV = 'test';
        await connectDB();
        token = jwt.sign({ id: 'dummy_admin_id' }, process.env.SECRET || 'esteesunsecretkey');
    });

    afterAll(async () => {
        await closeDB();
    });

    test('POST /api/liquidaciones debe crear una liquidación y retornar 201', async () => {
        const empleadoRes = await request(app)
            .post('/api/empleados')
            .set('Authorization', `Bearer ${token}`)
            .send({
                nombre: 'Juan',
                empresaId: new mongoose.Types.ObjectId().toString(),
                dni: '44455566',
                email: 'juan2@test.com',
                cbu: '1234567890123456789012'
            });
        
        const dummyEmpleadoId = empleadoRes.body._id;
        
        const nuevaLiquidacion = {
            empleadoId: dummyEmpleadoId,
            mes: 'Enero 2026',
            monto: 500000
        };

        const response = await request(app)
            .post('/api/liquidaciones')
            .set('Authorization', `Bearer ${token}`)
            .send(nuevaLiquidacion)
            .expect('Content-Type', /json/)
            .expect(201);
            
        expect(response.body.mes).toBe(nuevaLiquidacion.mes);
        expect(response.body.monto).toBe(nuevaLiquidacion.monto);
        expect(response.body._id).toBeTruthy();
    });
});
