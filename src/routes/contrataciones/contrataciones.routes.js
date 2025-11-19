const express = require('express');
const router = express.Router();
const contratacionesController = require('../../controllers/contrataciones/contrataciones.controller');
const evaluacionesController = require('../../controllers/contrataciones/evaluaciones.controller');
const planillaController = require('../../controllers/contrataciones/planilla.controller');
const { verificarToken, esEmpresa } = require('../../middlewares/auth.middleware');
const { validateId, sanitizeInput } = require('../../middlewares/validation.middleware');
const { uploadSinglePdf, uploadExcel } = require('../../middlewares/multer.middleware');

// ===== CONTRATACIONES =====
router.post('/', verificarToken, esEmpresa, sanitizeInput, contratacionesController.contratarCandidato);
router.get('/', verificarToken, esEmpresa, contratacionesController.obtenerContrataciones);
router.put('/:id/estado', verificarToken, esEmpresa, validateId(), sanitizeInput, contratacionesController.actualizarEstadoContratacion);
router.post('/importar-excel', verificarToken, esEmpresa, uploadExcel('excel'), contratacionesController.importarEmpleadosExcel);

// ===== EVALUACIONES =====
router.post('/evaluaciones', verificarToken, esEmpresa, sanitizeInput, evaluacionesController.crearEvaluacion);
router.get('/:id_contratacion/evaluaciones', verificarToken, esEmpresa, validateId('id_contratacion'), evaluacionesController.obtenerEvaluaciones);
router.post('/:id_contratacion/finalizar-periodo', verificarToken, esEmpresa, validateId('id_contratacion'), sanitizeInput, evaluacionesController.finalizarPeriodoPrueba);

// ===== PLANILLA =====
router.get('/planilla', verificarToken, esEmpresa, planillaController.obtenerPlanilla);
router.put('/planilla/:id', verificarToken, esEmpresa, validateId(), sanitizeInput, planillaController.actualizarEstadoEmpleado);
router.get('/planilla/generar-codigo', verificarToken, esEmpresa, planillaController.generarCodigoEmpleado);

// ===== PERIODO DE PRUEBA =====
router.get('/periodo-prueba', verificarToken, esEmpresa, planillaController.obtenerEmpleadosPeriodoPrueba);
router.post('/periodo-prueba/:id/finalizar', verificarToken, esEmpresa, validateId(), sanitizeInput, planillaController.finalizarPeriodoPrueba);

// ===== SEGUIMIENTO =====
router.get('/seguimiento', verificarToken, esEmpresa, planillaController.obtenerSeguimiento);

module.exports = router;
