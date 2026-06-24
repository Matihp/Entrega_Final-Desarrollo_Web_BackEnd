const express = require('express');
const router = express.Router();
const SocioController = require('../controllers/SocioController');
const validator = require('../middleware/validator');

router.get('/', SocioController.obtenerTodos);
router.get('/:id', SocioController.buscarPorId);
router.post('/', validator, SocioController.crear);
router.put('/:id', validator, SocioController.actualizar);
router.delete('/:id', SocioController.eliminar);

module.exports = router;
