const empresaModel = require('../models/Empresa');
const novedadModel = require('../models/Novedad');

const DashboardController = {
    obtenerIndicadores: async (req, res) => {
        try {
            const totalEmpresasActivas = await empresaModel.countDocuments();
            const novedadesPendientes = await novedadModel.countDocuments({ estado: 'pendiente' });
            
            const cargaOperativaEstimada = novedadesPendientes * 1;
            
            const indicadores = {
                totalEmpresasActivas,
                novedadesPendientes,
                cargaOperativaEstimadaHoras: cargaOperativaEstimada
            };
            res.render('dashboard', { indicadores });
        } catch (error) {
            res.status(500).send(`<h2>Error</h2><p>${error.message}</p>`);
        }
    }
};

module.exports = DashboardController;
