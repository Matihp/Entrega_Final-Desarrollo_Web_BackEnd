const express = require('express');
const router = express.Router();
const EmpleadoController = require('../controllers/EmpleadoController');
const validator = require('../middleware/validator');

router.get('/', EmpleadoController.obtenerTodos);
router.get('/:id', EmpleadoController.buscarPorId);
router.post('/', validator, EmpleadoController.crear);
router.put('/:id', validator, EmpleadoController.actualizar);
router.delete('/:id', EmpleadoController.eliminar);

module.exports = router;
