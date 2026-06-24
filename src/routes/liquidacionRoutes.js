const express = require('express');
const router = express.Router();
const LiquidacionController = require('../controllers/LiquidacionController');
const validator = require('../middleware/validator');

router.get('/', LiquidacionController.obtenerTodos);
router.get('/:id', LiquidacionController.buscarPorId);
router.post('/', validator, LiquidacionController.crear);
router.put('/:id', validator, LiquidacionController.actualizar);
router.delete('/:id', LiquidacionController.eliminar);

module.exports = router;
