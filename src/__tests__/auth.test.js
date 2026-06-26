const request = require('supertest');
const { app } = require('../app');
const { connectDB, closeDB } = require('../config/db');

describe('Integración API Autenticación', () => {
    beforeAll(async () => {
        process.env.NODE_ENV = 'test';
        await connectDB();
    });

    afterAll(async () => {
        await closeDB();
    });

    test('POST /api/auth/register debe registrar un usuario y retornar 201', async () => {
        const nuevoUsuario = {
            username: 'testuser',
            password: 'testpassword123',
            email: 'testuser@example.com',
            name: 'Test User'
        };

        const response = await request(app)
            .post('/api/auth/register')
            .send(nuevoUsuario)
            .expect('Content-Type', /json/)
            .expect(201);
            
        expect(response.body.username).toBe(nuevoUsuario.username);
        expect(response.body.email).toBe(nuevoUsuario.email);
        expect(response.body.id || response.body._id).toBeTruthy();
    });
});
