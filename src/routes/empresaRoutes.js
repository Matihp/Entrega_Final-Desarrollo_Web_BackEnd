const express = require('express');
const router = express.Router();
const EmpresaController = require('../controllers/EmpresaController');
const validator = require('../middleware/validator');

router.get('/', EmpresaController.obtenerTodos);
router.get('/:id', EmpresaController.buscarPorId);
router.post('/', validator, EmpresaController.crear);
router.put('/:id', validator, EmpresaController.actualizar);
router.delete('/:id', EmpresaController.eliminar);

module.exports = router;
