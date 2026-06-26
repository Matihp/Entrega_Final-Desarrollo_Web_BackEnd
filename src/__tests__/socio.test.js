const request = require('supertest');
const { app } = require('../app');
const { connectDB, closeDB } = require('../config/db');
const jwt = require('jsonwebtoken');

describe('Integración API Socios', () => {
    let token;

    beforeAll(async () => {
        process.env.NODE_ENV = 'test';
        await connectDB();
        token = jwt.sign({ id: 'dummy_admin_id' }, process.env.SECRET || 'esteesunsecretkey');
    });

    afterAll(async () => {
        await closeDB();
    });

    test('POST /api/socios debe crear un socio y retornar 201', async () => {
        const nuevoSocio = {
            nombre: 'Elon Musk',
            porcentajeParticipacion: 50.5
        };

        const response = await request(app)
            .post('/api/socios')
            .set('Authorization', `Bearer ${token}`)
            .send(nuevoSocio)
            .expect('Content-Type', /json/)
            .expect(201);
            
        expect(response.body.nombre).toBe(nuevoSocio.nombre);
        expect(response.body.porcentajeParticipacion).toBe(nuevoSocio.porcentajeParticipacion);
        expect(response.body._id).toBeTruthy();
    });
});
