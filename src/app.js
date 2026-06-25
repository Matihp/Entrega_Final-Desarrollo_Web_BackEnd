require('dotenv').config();
const express = require('express');
const path = require('path');

const connectDB = require('./config/db');

const auditMiddleware = require('./middleware/audit');
const errorHandler = require('./middleware/errorHandler');

const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');

// Configuración de Passport
require('./config/passport')(passport);

// Conexión a Base de Datos
connectDB();

// Importación de rutas
const viewRoutes = require('./routes/viewRoutes');
const empresaRoutes = require('./routes/empresaRoutes');
const empleadoRoutes = require('./routes/empleadoRoutes');
const novedadRoutes = require('./routes/novedadRoutes');
const socioRoutes = require('./routes/socioRoutes');
const liquidacionRoutes = require('./routes/liquidacionRoutes');
const authRoutes = require('./routes/authRoutes');
const authJWT = require('./middleware/authJWT');
const authWebRoutes = require('./routes/authWebRoutes');
const isAuthenticated = require('./middleware/authWeb');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración del motor de plantillas Pug
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Sesiones y passport
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

app.use(express.static(path.join(__dirname, '../public')));

// Middleware de auditoria
app.use(auditMiddleware);

// Ruta de login-registro web
app.use('/', authWebRoutes);

// Ruta de Pug protegida
app.use('/', isAuthenticated, viewRoutes);

// Rutas publicas
app.use('/api/auth', authRoutes);

// Rutas protegidas con JWT
app.use('/api/empresas', authJWT, empresaRoutes);
app.use('/api/empleados', authJWT, empleadoRoutes);
app.use('/api/novedades', authJWT, novedadRoutes);
app.use('/api/socios', authJWT, socioRoutes);
app.use('/api/liquidaciones', authJWT, liquidacionRoutes);

// Manejo de errores
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
