const request = require('supertest');
const { app } = require('../app');
const { connectDB, closeDB } = require('../config/db');
const jwt = require('jsonwebtoken');

describe('Integración API Empresas', () => {
    let token;
    let empresaId; // Guardaremos el ID para usarlo en los siguientes tests

    beforeAll(async () => {
        // Asegurarnos de que estamos en modo test
        process.env.NODE_ENV = 'test';
        await connectDB();
        
        // Generar un token válido para evadir el middleware authJWT de protección de rutas
        token = jwt.sign({ id: 'admin_id', role: 'admin' }, process.env.SECRET);
    });

    afterAll(async () => {
        // Importante para evitar "open handles" de memoria al terminar Jest
        await closeDB();
    });

    test('POST /api/empresas debe almacenar una nueva empresa en MongoDB Memory y retornar status 201', async () => {
        const nuevaEmpresa = {
            nombre: 'Empresa Test S.A.',
            cuit: '30123456789'
        };

        const response = await request(app)
            .post('/api/empresas')
            .set('Authorization', `Bearer ${token}`)
            .send(nuevaEmpresa)
            .set('Accept', 'application/json');

        if (response.status !== 201) {
            console.log('Error del servidor:', response.status, response.text);
        }

        expect(response.status).toBe(201);
        expect(response.headers['content-type']).toMatch(/json/);
            
        expect(response.body.nombre).toBe(nuevaEmpresa.nombre);
        expect(response.body.cuit).toBe(nuevaEmpresa.cuit);
        expect(response.body._id).toBeTruthy(); 
        
        empresaId = response.body._id;
    });

    test('GET /api/empresas/:id debe retornar la empresa creada', async () => {
        const response = await request(app)
            .get(`/api/empresas/${empresaId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body._id).toBe(empresaId);
        expect(response.body.nombre).toBe('Empresa Test S.A.');
    });

    test('PUT /api/empresas/:id debe actualizar la empresa', async () => {
        const actualizacion = { nombre: 'Empresa Test Modificada S.A.' };

        const response = await request(app)
            .put(`/api/empresas/${empresaId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(actualizacion);

        expect(response.status).toBe(200);
        expect(response.body.nombre).toBe(actualizacion.nombre);
    });

    test('DELETE /api/empresas/:id debe eliminar la empresa', async () => {
        const response = await request(app)
            .delete(`/api/empresas/${empresaId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        
        // Verificar que ya no existe
        const getResponse = await request(app)
            .get(`/api/empresas/${empresaId}`)
            .set('Authorization', `Bearer ${token}`);
            
        expect(getResponse.status).toBe(404);
    });
});
