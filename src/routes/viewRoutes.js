const express = require('express');
const router = express.Router();
const empresaModel = require('../models/Empresa');
const novedadModel = require('../models/Novedad');
const empleadoModel = require('../models/Empleado');
const DashboardController = require('../controllers/DashboardController');

const mapId = (doc) => {
    if (!doc) return doc;
    return { ...doc, id: doc._id.toString() };
};
const mapIds = (docs) => docs.map(mapId);

router.get('/', DashboardController.obtenerIndicadores);

// Vistas Empresas
router.get('/empresas', async (req, res) => {
    const empresas = await empresaModel.find().lean();
    res.render('empresas/index', { empresas: mapIds(empresas) });
});

router.get('/empresas/nuevo', (req, res) => {
    res.render('empresas/nuevo');
});

router.post('/empresas', async (req, res) => {
    try {
        await empresaModel.create(req.body);
        res.redirect('/empresas');
    } catch (error) {
        res.status(400).send(`<h2>Error</h2><p>${error.message}</p><a href='/empresas'>Volver</a>`);
    }
});

router.get('/empresas/:id/editar', async (req, res) => {
    const empresa = await empresaModel.findById(req.params.id).lean();
    if (!empresa) return res.redirect('/empresas');
    res.render('empresas/editar', { empresa: mapId(empresa) });
});

router.post('/empresas/:id/editar', async (req, res) => {
    try {
        await empresaModel.findByIdAndUpdate(req.params.id, req.body, { runValidators: true });
        res.redirect('/empresas');
    } catch (error) {
        res.status(400).send(`<h2>Error</h2><p>${error.message}</p><a href='/empresas'>Volver</a>`);
    }
});

router.post('/empresas/:id/eliminar', async (req, res) => {
    const tieneEmpleados = await empleadoModel.exists({ empresaId: req.params.id });
    
    if (tieneEmpleados) {
        return res.status(400).send(`
            <div style="font-family: sans-serif; padding: 20px;">
                <h2 style="color: red;">Error de Integridad</h2>
                <p>No se puede eliminar la empresa porque tiene empleados registrados.</p>
                <p>Debe eliminar a todos los empleados de esta empresa primero.</p>
                <a href="/empresas">Volver a Empresas</a>
            </div>
        `);
    }
    
    await empresaModel.findByIdAndDelete(req.params.id);
    res.redirect('/empresas');
});

// Vistas Novedades
router.get('/novedades', async (req, res) => {
    const filtroEstado = req.query.estado;
    const query = filtroEstado ? { estado: filtroEstado } : {};
    
    const novedades = await novedadModel.find(query).lean();
    const empleados = await empleadoModel.find().lean();
    
    const novedadesConEmpleado = novedades.map(n => {
        const emp = empleados.find(e => e._id.toString() === n.empleadoId.toString());
        return { ...mapId(n), empleadoNombre: emp ? emp.nombre : 'Desconocido' };
    });

    res.render('novedades/index', { novedades: novedadesConEmpleado, filtroEstado });
});

router.get('/novedades/nuevo', async (req, res) => {
    const empleados = await empleadoModel.find().lean();
    res.render('novedades/nuevo', { empleados: mapIds(empleados) });
});

router.post('/novedades', async (req, res) => {
    try {
        await novedadModel.create(req.body);
        res.redirect('/novedades');
    } catch (error) {
        res.status(400).send(`<h2>Error</h2><p>${error.message}</p><a href='/novedades'>Volver</a>`);
    }
});

router.get('/novedades/:id/editar', async (req, res) => {
    const novedad = await novedadModel.findById(req.params.id).lean();
    if (!novedad) return res.redirect('/novedades');
    const empleados = await empleadoModel.find().lean();
    res.render('novedades/editar', { novedad: mapId(novedad), empleados: mapIds(empleados) });
});

router.post('/novedades/:id/editar', async (req, res) => {
    try {
        await novedadModel.findByIdAndUpdate(req.params.id, req.body, { runValidators: true });
        res.redirect('/novedades');
    } catch (error) {
        res.status(400).send(`<h2>Error</h2><p>${error.message}</p><a href='/novedades'>Volver</a>`);
    }
});

router.post('/novedades/:id/estado', async (req, res) => {
    const { estado } = req.body;
    if (['pendiente', 'procesada', 'rechazada'].includes(estado)) {
        await novedadModel.findByIdAndUpdate(req.params.id, { estado });
    }
    res.redirect('/novedades');
});

router.post('/novedades/:id/eliminar', async (req, res) => {
    await novedadModel.findByIdAndDelete(req.params.id);
    res.redirect('/novedades');
});

// Vistas Empleados
router.get('/empleados', async (req, res) => {
    const empleados = await empleadoModel.find().lean();
    res.render('empleados/index', { empleados: mapIds(empleados) });
});

router.get('/empleados/nuevo', async (req, res) => {
    const empresas = await empresaModel.find().lean();
    res.render('empleados/nuevo', { empresas: mapIds(empresas) });
});

router.post('/empleados', async (req, res) => {
    try {
        const nuevoEmpleado = await empleadoModel.create(req.body);
        
        await novedadModel.create({
            empleadoId: nuevoEmpleado._id,
            descripcion: `Alta pendiente en AFIP para nuevo empleado con DNI: ${nuevoEmpleado.dni}`,
            estado: 'pendiente'
        });
        
        res.redirect('/empleados');
    } catch (error) {
        res.status(400).send(`<h2>Error</h2><p>${error.message}</p><a href='/empleados'>Volver</a>`);
    }
});

router.get('/empleados/:id/editar', async (req, res) => {
    const empleado = await empleadoModel.findById(req.params.id).lean();
    if (!empleado) return res.redirect('/empleados');
    const empresas = await empresaModel.find().lean();
    res.render('empleados/editar', { empleado: mapId(empleado), empresas: mapIds(empresas) });
});

router.post('/empleados/:id/editar', async (req, res) => {
    try {
        await empleadoModel.findByIdAndUpdate(req.params.id, req.body, { runValidators: true });
        res.redirect('/empleados');
    } catch (error) {
        res.status(400).send(`<h2>Error</h2><p>${error.message}</p><a href='/empleados'>Volver</a>`);
    }
});

router.post('/empleados/:id/eliminar', async (req, res) => {
    const tieneNovedades = await novedadModel.exists({ empleadoId: req.params.id });
    
    if (tieneNovedades) {
        return res.status(400).send(`
            <div style="font-family: sans-serif; padding: 20px;">
                <h2 style="color: red;">Error de Integridad</h2>
                <p>No se puede eliminar el empleado porque tiene novedades registradas en el historial.</p>
                <p>Para evitar inconsistencias en los datos, primero debe eliminar todas las novedades de este empleado.</p>
                <a href="/empleados">Volver a Empleados</a>
            </div>
        `);
    }
    
    await empleadoModel.findByIdAndDelete(req.params.id);
    res.redirect('/empleados');
});

// Vistas SOCIOS
const socioModel = require('../models/Socio');

router.get('/socios', async (req, res) => {
    const socios = await socioModel.find().lean();
    res.render('socios/index', { socios: mapIds(socios) });
});

router.get('/socios/nuevo', (req, res) => {
    res.render('socios/nuevo');
});

router.post('/socios', async (req, res) => {
    try {
        await socioModel.create(req.body);
        res.redirect('/socios');
    } catch (error) {
        res.status(400).send(`<h2>Error</h2><p>${error.message}</p><a href='/socios'>Volver</a>`);
    }
});

router.get('/socios/:id/editar', async (req, res) => {
    const socio = await socioModel.findById(req.params.id).lean();
    if (!socio) return res.redirect('/socios');
    res.render('socios/editar', { socio: mapId(socio) });
});

router.post('/socios/:id/editar', async (req, res) => {
    try {
        await socioModel.findByIdAndUpdate(req.params.id, req.body, { runValidators: true });
        res.redirect('/socios');
    } catch (error) {
        res.status(400).send(`<h2>Error</h2><p>${error.message}</p><a href='/socios'>Volver</a>`);
    }
});

router.post('/socios/:id/eliminar', async (req, res) => {
    await socioModel.findByIdAndDelete(req.params.id);
    res.redirect('/socios');
});

// Vistas LIQUIDACIONES
const liquidacionModel = require('../models/Liquidacion');

router.get('/liquidaciones', async (req, res) => {
    const liquidaciones = await liquidacionModel.find().lean();
    const empleados = await empleadoModel.find().lean();
    
    const liquidacionesConEmpleado = liquidaciones.map(l => {
        const emp = empleados.find(e => e._id.toString() === l.empleadoId.toString());
        return { ...mapId(l), empleadoNombre: emp ? emp.nombre : 'Desconocido' };
    });
    
    res.render('liquidaciones/index', { liquidaciones: liquidacionesConEmpleado });
});

router.get('/liquidaciones/nuevo', async (req, res) => {
    const empleados = await empleadoModel.find().lean();
    res.render('liquidaciones/nuevo', { empleados: mapIds(empleados) });
});

router.post('/liquidaciones', async (req, res) => {
    try {
        await liquidacionModel.create(req.body);
        res.redirect('/liquidaciones');
    } catch (error) {
        res.status(400).send(`<h2>Error</h2><p>${error.message}</p><a href='/liquidaciones'>Volver</a>`);
    }
});

router.get('/liquidaciones/:id/editar', async (req, res) => {
    const liquidacion = await liquidacionModel.findById(req.params.id).lean();
    if (!liquidacion) return res.redirect('/liquidaciones');
    const empleados = await empleadoModel.find().lean();
    res.render('liquidaciones/editar', { liquidacion: mapId(liquidacion), empleados: mapIds(empleados) });
});

router.post('/liquidaciones/:id/editar', async (req, res) => {
    try {
        await liquidacionModel.findByIdAndUpdate(req.params.id, req.body, { runValidators: true });
        res.redirect('/liquidaciones');
    } catch (error) {
        res.status(400).send(`<h2>Error</h2><p>${error.message}</p><a href='/liquidaciones'>Volver</a>`);
    }
});

router.post('/liquidaciones/:id/eliminar', async (req, res) => {
    await liquidacionModel.findByIdAndDelete(req.params.id);
    res.redirect('/liquidaciones');
});

module.exports = router;
