const sequelize = require('../../db/db');

// ============================================================
// IMPORTAR TODOS LOS MODELOS
// ============================================================

// Auth
const Rol = require('./auth/rol.model');
const Usuario = require('./auth/usuario.model');

// Empresas y Candidatos
const Empresa = require('./empresas/empresa.model');
const Candidato = require('./candidatos/candidato.model');

// Vacantes
const Vacante = require('./vacantes/vacante.model');
const Postulacion = require('./vacantes/postulacion.model');

// Pruebas Psicométricas
const Prueba = require('./pruebas-psicometricas/prueba.model');
const Pregunta = require('./pruebas-psicometricas/pregunta.model');
const OpcionRespuesta = require('./pruebas-psicometricas/opcion-respuesta.model');
const AsignacionPrueba = require('./pruebas-psicometricas/asignacion-prueba.model');
const RespuestaCandidato = require('./pruebas-psicometricas/respuesta-candidato.model');
const ResultadoPrueba = require('./pruebas-psicometricas/resultado-prueba.model');
const EvaluacionPsicometrica = require('./pruebas-psicometricas/evaluacion-psicometrica.model');

// Pruebas Técnicas y Médicas
const PruebaTecnica = require('./pruebas-tecnicas/prueba-tecnica.model');
const PruebaMedica = require('./pruebas-medicas/prueba-medica.model');

// Entrevistas y Eventos
const Entrevista = require('./entrevistas/entrevista.model');
const Evento = require('./eventos/evento.model');

// Documentos y Evaluaciones
const VerificacionDocumento = require('./documentos/verificacion-documento.model');
const EvaluacionPostContratacion = require('./evaluaciones/evaluacion-post-contratacion.model');

// Contrataciones
const Contratacion = require('./contrataciones/contratacion.model');
const EvaluacionPeriodoPrueba = require('./contrataciones/evaluacion-periodo-prueba.model');
const EmpleadoPlanilla = require('./contrataciones/empleado-planilla.model');

// Admin
const HistorialActividad = require('./admin/historial-actividad.model');
const Reporte = require('./admin/reporte.model');

// ============================================================
// DEFINIR RELACIONES (ASSOCIATIONS)
// ============================================================

// ==================== MÓDULO: AUTENTICACIÓN ====================

// Rol <-> Usuario (1:N)
Rol.hasMany(Usuario, { foreignKey: 'id_rol', as: 'usuarios' });
Usuario.belongsTo(Rol, { foreignKey: 'id_rol', as: 'rol' });

// ==================== MÓDULO: EMPRESAS ====================

// Usuario <-> Empresa (1:1)
Usuario.hasOne(Empresa, { foreignKey: 'id_usuario', as: 'empresa' });
Empresa.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });

// ==================== MÓDULO: CANDIDATOS ====================

// Usuario <-> Candidato (1:1)
Usuario.hasOne(Candidato, { foreignKey: 'id_usuario', as: 'candidato' });
Candidato.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });

// ==================== MÓDULO: VACANTES ====================

// Empresa <-> Vacante (1:N)
Empresa.hasMany(Vacante, { foreignKey: 'id_empresa', as: 'vacantes' });
Vacante.belongsTo(Empresa, { foreignKey: 'id_empresa', as: 'empresa' });

// Candidato <-> Postulacion (1:N)
Candidato.hasMany(Postulacion, { foreignKey: 'id_candidato', as: 'postulaciones' });
Postulacion.belongsTo(Candidato, { foreignKey: 'id_candidato', as: 'candidato' });

// Vacante <-> Postulacion (1:N)
Vacante.hasMany(Postulacion, { foreignKey: 'id_vacante', as: 'postulaciones' });
Postulacion.belongsTo(Vacante, { foreignKey: 'id_vacante', as: 'vacante' });

// ==================== MÓDULO: PRUEBAS PSICOMÉTRICAS ====================

// Usuario <-> Prueba (1:N) - creador
Usuario.hasMany(Prueba, { foreignKey: 'creador_id', as: 'pruebas_creadas' });
Prueba.belongsTo(Usuario, { foreignKey: 'creador_id', as: 'creador' });

// Prueba <-> Pregunta (1:N)
Prueba.hasMany(Pregunta, { foreignKey: 'id_prueba', as: 'preguntas' });
Pregunta.belongsTo(Prueba, { foreignKey: 'id_prueba', as: 'prueba' });

// Pregunta <-> OpcionRespuesta (1:N)
Pregunta.hasMany(OpcionRespuesta, { foreignKey: 'id_pregunta', as: 'opciones' });
OpcionRespuesta.belongsTo(Pregunta, { foreignKey: 'id_pregunta', as: 'pregunta' });

// Candidato <-> AsignacionPrueba (1:N)
Candidato.hasMany(AsignacionPrueba, { foreignKey: 'id_candidato', as: 'asignaciones_prueba' });
AsignacionPrueba.belongsTo(Candidato, { foreignKey: 'id_candidato', as: 'candidato' });

// Prueba <-> AsignacionPrueba (1:N)
Prueba.hasMany(AsignacionPrueba, { foreignKey: 'id_prueba', as: 'asignaciones' });
AsignacionPrueba.belongsTo(Prueba, { foreignKey: 'id_prueba', as: 'prueba' });

// Vacante <-> AsignacionPrueba (1:N)
Vacante.hasMany(AsignacionPrueba, { foreignKey: 'id_vacante', as: 'asignaciones_prueba' });
AsignacionPrueba.belongsTo(Vacante, { foreignKey: 'id_vacante', as: 'vacante' });

// Empresa <-> AsignacionPrueba (1:N)
Empresa.hasMany(AsignacionPrueba, { foreignKey: 'id_empresa', as: 'asignaciones_prueba' });
AsignacionPrueba.belongsTo(Empresa, { foreignKey: 'id_empresa', as: 'empresa' });

// AsignacionPrueba <-> RespuestaCandidato (1:N)
AsignacionPrueba.hasMany(RespuestaCandidato, { foreignKey: 'id_asignacion', as: 'respuestas' });
RespuestaCandidato.belongsTo(AsignacionPrueba, { foreignKey: 'id_asignacion', as: 'asignacion' });

// Pregunta <-> RespuestaCandidato (1:N)
Pregunta.hasMany(RespuestaCandidato, { foreignKey: 'id_pregunta', as: 'respuestas_candidatos' });
RespuestaCandidato.belongsTo(Pregunta, { foreignKey: 'id_pregunta', as: 'pregunta' });

// OpcionRespuesta <-> RespuestaCandidato (1:N)
OpcionRespuesta.hasMany(RespuestaCandidato, { foreignKey: 'id_opcion_seleccionada', as: 'respuestas_candidatos' });
RespuestaCandidato.belongsTo(OpcionRespuesta, { foreignKey: 'id_opcion_seleccionada', as: 'opcion_seleccionada' });

// AsignacionPrueba <-> ResultadoPrueba (1:1)
AsignacionPrueba.hasOne(ResultadoPrueba, { foreignKey: 'id_asignacion', as: 'resultado' });
ResultadoPrueba.belongsTo(AsignacionPrueba, { foreignKey: 'id_asignacion', as: 'asignacion' });

// Candidato <-> ResultadoPrueba (1:N)
Candidato.hasMany(ResultadoPrueba, { foreignKey: 'id_candidato', as: 'resultados_prueba' });
ResultadoPrueba.belongsTo(Candidato, { foreignKey: 'id_candidato', as: 'candidato' });

// Prueba <-> ResultadoPrueba (1:N)
Prueba.hasMany(ResultadoPrueba, { foreignKey: 'id_prueba', as: 'resultados' });
ResultadoPrueba.belongsTo(Prueba, { foreignKey: 'id_prueba', as: 'prueba' });

// AsignacionPrueba <-> EvaluacionPsicometrica (1:1)
AsignacionPrueba.hasOne(EvaluacionPsicometrica, { foreignKey: 'id_asignacion', as: 'evaluacion' });
EvaluacionPsicometrica.belongsTo(AsignacionPrueba, { foreignKey: 'id_asignacion', as: 'asignacion' });

// Candidato <-> EvaluacionPsicometrica (1:N)
Candidato.hasMany(EvaluacionPsicometrica, { foreignKey: 'id_candidato', as: 'evaluaciones_psicometricas' });
EvaluacionPsicometrica.belongsTo(Candidato, { foreignKey: 'id_candidato', as: 'candidato' });

// Usuario <-> EvaluacionPsicometrica (1:N) - evaluador
Usuario.hasMany(EvaluacionPsicometrica, { foreignKey: 'id_evaluador', as: 'evaluaciones_realizadas' });
EvaluacionPsicometrica.belongsTo(Usuario, { foreignKey: 'id_evaluador', as: 'evaluador' });

// ==================== MÓDULO: PRUEBAS TÉCNICAS ====================

// Candidato <-> PruebaTecnica (1:N)
Candidato.hasMany(PruebaTecnica, { foreignKey: 'id_candidato', as: 'pruebas_tecnicas' });
PruebaTecnica.belongsTo(Candidato, { foreignKey: 'id_candidato', as: 'candidato' });

// Vacante <-> PruebaTecnica (1:N)
Vacante.hasMany(PruebaTecnica, { foreignKey: 'id_vacante', as: 'pruebas_tecnicas' });
PruebaTecnica.belongsTo(Vacante, { foreignKey: 'id_vacante', as: 'vacante' });

// Postulacion <-> PruebaTecnica (1:N)
Postulacion.hasMany(PruebaTecnica, { foreignKey: 'id_postulacion', as: 'pruebas_tecnicas' });
PruebaTecnica.belongsTo(Postulacion, { foreignKey: 'id_postulacion', as: 'postulacion' });

// Usuario <-> PruebaTecnica (1:N) - evaluador
Usuario.hasMany(PruebaTecnica, { foreignKey: 'evaluador_id', as: 'pruebas_tecnicas_evaluadas' });
PruebaTecnica.belongsTo(Usuario, { foreignKey: 'evaluador_id', as: 'evaluador' });

// Empresa <-> PruebaTecnica (1:N)
// COMENTADO: PruebaTecnica no tiene id_empresa, se relaciona con Empresa a través de Vacante
// Empresa.hasMany(PruebaTecnica, { foreignKey: 'id_empresa', as: 'pruebas_tecnicas' });
// PruebaTecnica.belongsTo(Empresa, { foreignKey: 'id_empresa', as: 'empresa' });

// ==================== MÓDULO: PRUEBAS MÉDICAS ====================

// Candidato <-> PruebaMedica (1:N)
Candidato.hasMany(PruebaMedica, { foreignKey: 'id_candidato', as: 'pruebas_medicas' });
PruebaMedica.belongsTo(Candidato, { foreignKey: 'id_candidato', as: 'candidato' });

// Postulacion <-> PruebaMedica (1:N)
Postulacion.hasMany(PruebaMedica, { foreignKey: 'id_postulacion', as: 'pruebas_medicas' });
PruebaMedica.belongsTo(Postulacion, { foreignKey: 'id_postulacion', as: 'postulacion' });

// Vacante <-> PruebaMedica (1:N)
Vacante.hasMany(PruebaMedica, { foreignKey: 'id_vacante', as: 'pruebas_medicas' });
PruebaMedica.belongsTo(Vacante, { foreignKey: 'id_vacante', as: 'vacante' });

// Empresa <-> PruebaMedica (1:N)
// COMENTADO: PruebaMedica no tiene id_empresa, se relaciona con Empresa a través de Vacante
// Empresa.hasMany(PruebaMedica, { foreignKey: 'id_empresa', as: 'pruebas_medicas' });
// PruebaMedica.belongsTo(Empresa, { foreignKey: 'id_empresa', as: 'empresa' });

// ==================== MÓDULO: ENTREVISTAS ====================

// Postulacion <-> Entrevista (1:N)
Postulacion.hasMany(Entrevista, { foreignKey: 'id_postulacion', as: 'entrevistas' });
Entrevista.belongsTo(Postulacion, { foreignKey: 'id_postulacion', as: 'postulacion' });

// Candidato <-> Entrevista (1:N)
Candidato.hasMany(Entrevista, { foreignKey: 'id_candidato', as: 'entrevistas' });
Entrevista.belongsTo(Candidato, { foreignKey: 'id_candidato', as: 'candidato' });

// Vacante <-> Entrevista (1:N)
Vacante.hasMany(Entrevista, { foreignKey: 'id_vacante', as: 'entrevistas' });
Entrevista.belongsTo(Vacante, { foreignKey: 'id_vacante', as: 'vacante' });

// Usuario <-> Entrevista (1:N) - entrevistador
Usuario.hasMany(Entrevista, { foreignKey: 'entrevistador_id', as: 'entrevistas_realizadas' });
Entrevista.belongsTo(Usuario, { foreignKey: 'entrevistador_id', as: 'entrevistador' });

// ==================== MÓDULO: EVENTOS ====================

// Postulacion <-> Evento (1:N)
Postulacion.hasMany(Evento, { foreignKey: 'id_postulacion', as: 'eventos' });
Evento.belongsTo(Postulacion, { foreignKey: 'id_postulacion', as: 'postulacion' });

// Candidato <-> Evento (1:N)
Candidato.hasMany(Evento, { foreignKey: 'id_candidato', as: 'eventos' });
Evento.belongsTo(Candidato, { foreignKey: 'id_candidato', as: 'candidato' });

// Vacante <-> Evento (1:N)
Vacante.hasMany(Evento, { foreignKey: 'id_vacante', as: 'eventos' });
Evento.belongsTo(Vacante, { foreignKey: 'id_vacante', as: 'vacante' });

// Empresa <-> Evento (1:N)
Empresa.hasMany(Evento, { foreignKey: 'id_empresa', as: 'eventos' });
Evento.belongsTo(Empresa, { foreignKey: 'id_empresa', as: 'empresa' });

// Usuario <-> Evento (1:N) - organizador
Usuario.hasMany(Evento, { foreignKey: 'organizador_id', as: 'eventos_organizados' });
Evento.belongsTo(Usuario, { foreignKey: 'organizador_id', as: 'organizador' });

// ==================== MÓDULO: DOCUMENTOS ====================

// Candidato <-> VerificacionDocumento (1:N)
Candidato.hasMany(VerificacionDocumento, { foreignKey: 'id_candidato', as: 'documentos' });
VerificacionDocumento.belongsTo(Candidato, { foreignKey: 'id_candidato', as: 'candidato' });

// Postulacion <-> VerificacionDocumento (1:N)
Postulacion.hasMany(VerificacionDocumento, { foreignKey: 'id_postulacion', as: 'documentos' });
VerificacionDocumento.belongsTo(Postulacion, { foreignKey: 'id_postulacion', as: 'postulacion' });

// Usuario <-> VerificacionDocumento (1:N) - verificador
Usuario.hasMany(VerificacionDocumento, { foreignKey: 'verificado_por', as: 'documentos_verificados' });
VerificacionDocumento.belongsTo(Usuario, { foreignKey: 'verificado_por', as: 'verificador' });

// ==================== MÓDULO: EVALUACIONES POST-CONTRATACIÓN ====================

// Candidato <-> EvaluacionPostContratacion (1:N)
Candidato.hasMany(EvaluacionPostContratacion, { foreignKey: 'id_candidato', as: 'evaluaciones_post_contratacion' });
EvaluacionPostContratacion.belongsTo(Candidato, { foreignKey: 'id_candidato', as: 'candidato' });

// Vacante <-> EvaluacionPostContratacion (1:N)
Vacante.hasMany(EvaluacionPostContratacion, { foreignKey: 'id_vacante', as: 'evaluaciones_post_contratacion' });
EvaluacionPostContratacion.belongsTo(Vacante, { foreignKey: 'id_vacante', as: 'vacante' });

// Postulacion <-> EvaluacionPostContratacion (1:N)
Postulacion.hasMany(EvaluacionPostContratacion, { foreignKey: 'id_postulacion', as: 'evaluaciones_post_contratacion' });
EvaluacionPostContratacion.belongsTo(Postulacion, { foreignKey: 'id_postulacion', as: 'postulacion' });

// Usuario <-> EvaluacionPostContratacion (1:N) - evaluador
Usuario.hasMany(EvaluacionPostContratacion, { foreignKey: 'evaluador_id', as: 'evaluaciones_post_contratacion_realizadas' });
EvaluacionPostContratacion.belongsTo(Usuario, { foreignKey: 'evaluador_id', as: 'evaluador' });

// ==================== MÓDULO: CONTRATACIONES ====================

// Empresa <-> Contratacion (1:N)
Empresa.hasMany(Contratacion, { foreignKey: 'id_empresa', as: 'contrataciones' });
Contratacion.belongsTo(Empresa, { foreignKey: 'id_empresa', as: 'empresa' });

// Candidato <-> Contratacion (1:N)
Candidato.hasMany(Contratacion, { foreignKey: 'id_candidato', as: 'contrataciones' });
Contratacion.belongsTo(Candidato, { foreignKey: 'id_candidato', as: 'candidato' });

// Postulacion <-> Contratacion (1:1)
Postulacion.hasOne(Contratacion, { foreignKey: 'id_postulacion', as: 'contratacion' });
Contratacion.belongsTo(Postulacion, { foreignKey: 'id_postulacion', as: 'postulacion' });

// Vacante <-> Contratacion (1:N)
Vacante.hasMany(Contratacion, { foreignKey: 'id_vacante', as: 'contrataciones' });
Contratacion.belongsTo(Vacante, { foreignKey: 'id_vacante', as: 'vacante' });

// Usuario <-> Contratacion (supervisor)
Usuario.hasMany(Contratacion, { foreignKey: 'id_supervisor', as: 'supervisados' });
Contratacion.belongsTo(Usuario, { foreignKey: 'id_supervisor', as: 'supervisor' });

// Contratacion <-> EvaluacionPeriodoPrueba (1:N)
Contratacion.hasMany(EvaluacionPeriodoPrueba, { foreignKey: 'id_contratacion', as: 'evaluaciones' });
EvaluacionPeriodoPrueba.belongsTo(Contratacion, { foreignKey: 'id_contratacion', as: 'contratacion' });

// Usuario <-> EvaluacionPeriodoPrueba (evaluador)
Usuario.hasMany(EvaluacionPeriodoPrueba, { foreignKey: 'evaluado_por', as: 'evaluaciones_periodo_prueba' });
EvaluacionPeriodoPrueba.belongsTo(Usuario, { foreignKey: 'evaluado_por', as: 'evaluador' });

// Contratacion <-> EmpleadoPlanilla (1:1)
Contratacion.hasOne(EmpleadoPlanilla, { foreignKey: 'id_contratacion', as: 'planilla' });
EmpleadoPlanilla.belongsTo(Contratacion, { foreignKey: 'id_contratacion', as: 'contratacion' });

// ==================== MÓDULO: ADMIN ====================

// Usuario <-> HistorialActividad (1:N)
Usuario.hasMany(HistorialActividad, { foreignKey: 'id_usuario', as: 'actividades' });
HistorialActividad.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });

// Usuario <-> Reporte (1:N)
Usuario.hasMany(Reporte, { foreignKey: 'id_usuario', as: 'reportes' });
Reporte.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });

// ============================================================
// EXPORTAR SEQUELIZE Y TODOS LOS MODELOS
// ============================================================

module.exports = {
    sequelize,

    // Auth
    Rol,
    Usuario,

    // Empresas y Candidatos
    Empresa,
    Candidato,

    // Vacantes
    Vacante,
    Postulacion,

    // Pruebas Psicométricas
    Prueba,
    Pregunta,
    OpcionRespuesta,
    AsignacionPrueba,
    RespuestaCandidato,
    ResultadoPrueba,
    EvaluacionPsicometrica,

    // Pruebas Técnicas y Médicas
    PruebaTecnica,
    PruebaMedica,

    // Entrevistas y Eventos
    Entrevista,
    Evento,

    // Documentos y Evaluaciones
    VerificacionDocumento,
    EvaluacionPostContratacion,

    // Contrataciones
    Contratacion,
    EvaluacionPeriodoPrueba,
    EmpleadoPlanilla,

    // Admin
    HistorialActividad,
    Reporte
};
