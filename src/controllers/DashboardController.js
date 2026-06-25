const empresaModel = require('../models/Empresa');
const novedadModel = require('../models/Novedad');
const empleadoModel = require('../models/Empleado');
const liquidacionModel = require('../models/Liquidacion');

const DashboardController = {
    obtenerIndicadores: async (req, res) => {
        try {
            const totalEmpresasActivas = await empresaModel.countDocuments();
            const novedadesPendientes = await novedadModel.countDocuments({ estado: 'pendiente' });
            const novedadesProcesadas = await novedadModel.countDocuments({ estado: 'procesada' });
            const novedadesRechazadas = await novedadModel.countDocuments({ estado: 'rechazada' });
            
            // Datos para Empleados por Empresa
            const empleados = await empleadoModel.find().lean();
            const empresas = await empresaModel.find().lean();
            const empleadosPorEmpresa = {};
            empresas.forEach(emp => empleadosPorEmpresa[emp.nombre] = 0);
            empleados.forEach(emp => {
                const empresa = empresas.find(e => e._id.toString() === emp.empresaId.toString());
                if (empresa) {
                    empleadosPorEmpresa[empresa.nombre] += 1;
                }
            });

            // Datos para Liquidaciones por mes (Monto)
            const liquidaciones = await liquidacionModel.find().lean();
            const montoPorMes = {};
            liquidaciones.forEach(liq => {
                const mes = liq.mes || 'Desconocido';
                if (!montoPorMes[mes]) montoPorMes[mes] = 0;
                montoPorMes[mes] += liq.monto;
            });
            
            const cargaOperativaEstimada = novedadesPendientes * 1;
            
            const indicadores = {
                totalEmpresasActivas,
                novedadesPendientes,
                novedadesProcesadas,
                novedadesRechazadas,
                empleadosPorEmpresa,
                montoPorMes,
                cargaOperativaEstimadaHoras: cargaOperativaEstimada
            };
            res.render('dashboard', { indicadores });
        } catch (error) {
            res.status(500).send(`<h2>Error</h2><p>${error.message}</p>`);
        }
    }
};

module.exports = DashboardController;
