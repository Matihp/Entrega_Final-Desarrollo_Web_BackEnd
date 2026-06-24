require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const auditMiddleware = require('./middleware/audit');
const errorHandler = require('./middleware/errorHandler');

// Conexión a Base de Datos
connectDB();

// Importación de rutas
const viewRoutes = require('./routes/viewRoutes');
const empresaRoutes = require('./routes/empresaRoutes');
const empleadoRoutes = require('./routes/empleadoRoutes');
const novedadRoutes = require('./routes/novedadRoutes');
const socioRoutes = require('./routes/socioRoutes');
const liquidacionRoutes = require('./routes/liquidacionRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración del motor de plantillas Pug
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../public')));

// Middleware de auditoria
app.use(auditMiddleware);

// Rutas
app.use('/', viewRoutes); // Rutas de Pug
app.use('/api/empresas', empresaRoutes);
app.use('/api/empleados', empleadoRoutes);
app.use('/api/novedades', novedadRoutes);
app.use('/api/socios', socioRoutes);
app.use('/api/liquidaciones', liquidacionRoutes);

// Manejo de errores
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
