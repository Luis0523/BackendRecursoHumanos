const express = require('express');
const router = express.Router();
const iaController = require('../controllers/ia.controller');
const { verificarToken, esEmpresa } = require('../middlewares/auth.middleware');

/**
 * @route   GET /api/ia/estado
 * @desc    Verificar estado del servicio de IA
 * @access  Privado (Empresa)
 */
router.get('/estado', verificarToken, esEmpresa, iaController.verificarEstado);

/**
 * @route   POST /api/ia/analizar-compatibilidad/:id_postulacion
 * @desc    Analizar compatibilidad entre candidato y vacante usando IA
 * @access  Privado (Empresa)
 */
router.post('/analizar-compatibilidad/:id_postulacion', 
    verificarToken, 
    esEmpresa, 
    iaController.analizarCompatibilidad
);

/**
 * @route   POST /api/ia/analizar-prueba/:id_asignacion
 * @desc    Analizar respuestas de prueba psicométrica usando IA
 * @access  Privado (Empresa)
 */
router.post('/analizar-prueba/:id_asignacion', 
    verificarToken, 
    esEmpresa, 
    iaController.analizarPruebaPsicometrica
);

/**
 * @route   POST /api/ia/generar-preguntas/:id_postulacion
 * @desc    Generar preguntas de entrevista usando IA
 * @access  Privado (Empresa)
 */
router.post('/generar-preguntas/:id_postulacion', 
    verificarToken, 
    esEmpresa, 
    iaController.generarPreguntasEntrevista
);

module.exports = router;
