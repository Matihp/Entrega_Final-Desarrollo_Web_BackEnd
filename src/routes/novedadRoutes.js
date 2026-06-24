const express = require('express');
const router = express.Router();
const NovedadController = require('../controllers/NovedadController');
const validator = require('../middleware/validator');

router.get('/', NovedadController.obtenerTodos);
router.get('/:id', NovedadController.buscarPorId);
router.post('/', validator, NovedadController.crear);
router.put('/:id', validator, NovedadController.actualizar);
router.delete('/:id', NovedadController.eliminar);
router.put('/:id/estado', validator, NovedadController.cambiarEstado); // Ruta específica para estado

module.exports = router;
