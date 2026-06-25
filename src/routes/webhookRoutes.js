const express = require('express');
const router = express.Router();
const WebhookController = require('../controllers/WebhookController');

// Ruta para recibir a los candidatos aprobados desde el ATS
router.post('/ats-contratacion', WebhookController.atsContratacion);

module.exports = router;
