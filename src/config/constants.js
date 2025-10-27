/**
 * Constantes y enumeraciones del sistema
 */

module.exports = {
    // Estados de usuario
    ESTADO_USUARIO: {
        ACTIVO: 'activo',
        SUSPENDIDO: 'suspendido',
        INACTIVO: 'inactivo'
    },

    // Roles del sistema
    ROLES: {
        ADMINISTRADOR: 'administrador',
        EMPRESA: 'empresa',
        CANDIDATO: 'candidato'
    },

    // Estados de vacante
    ESTADO_VACANTE: {
        ACTIVA: 'activa',
        PAUSADA: 'pausada',
        CERRADA: 'cerrada',
        CANCELADA: 'cancelada'
    },

    // Tipos de contrato
    TIPO_CONTRATO: {
        INDEFINIDO: 'indefinido',
        TEMPORAL: 'temporal',
        FREELANCE: 'freelance',
        PRACTICAS: 'practicas'
    },

    // Jornada laboral
    JORNADA: {
        TIEMPO_COMPLETO: 'tiempo_completo',
        MEDIO_TIEMPO: 'medio_tiempo',
        POR_PROYECTO: 'por_proyecto'
    },

    // Modalidad de trabajo
    MODALIDAD: {
        PRESENCIAL: 'presencial',
        REMOTO: 'remoto',
        HIBRIDO: 'hibrido'
    },

    // Estados de postulación
    ESTADO_POSTULACION: {
        PENDIENTE: 'pendiente',
        EN_REVISION: 'en_revision',
        PRESELECCIONADO: 'preseleccionado',
        ENTREVISTA: 'entrevista',
        RECHAZADO: 'rechazado',
        ACEPTADO: 'aceptado',
        CONTRATADO: 'contratado'
    },

    // Disponibilidad del candidato
    DISPONIBILIDAD: {
        INMEDIATA: 'inmediata',
        DOS_SEMANAS: '2_semanas',
        UN_MES: '1_mes',
        OTRO: 'otro'
    },

    // Tipos de prueba psicométrica
    TIPO_PRUEBA_PSICOMETRICA: {
        COGNITIVA: 'cognitiva',
        PERSONALIDAD: 'personalidad',
        HABILIDADES: 'habilidades',
        CONOCIMIENTO: 'conocimiento'
    },

    // Tipos de pregunta
    TIPO_PREGUNTA: {
        MULTIPLE: 'multiple',
        VERDADERO_FALSO: 'verdadero_falso',
        ABIERTA: 'abierta',
        ESCALA: 'escala'
    },

    // Estados de asignación de prueba
    ESTADO_ASIGNACION_PRUEBA: {
        PENDIENTE: 'pendiente',
        EN_PROGRESO: 'en_progreso',
        COMPLETADA: 'completada',
        VENCIDA: 'vencida',
        CANCELADA: 'cancelada'
    },

    // Tipos de prueba técnica
    TIPO_PRUEBA_TECNICA: {
        CODIGO: 'codigo',
        EXCEL: 'excel',
        IDIOMAS: 'idiomas',
        PROYECTO: 'proyecto',
        CASO_PRACTICO: 'caso_practico',
        OTRO: 'otro'
    },

    // Estados de prueba técnica
    ESTADO_PRUEBA_TECNICA: {
        ASIGNADA: 'asignada',
        EN_PROGRESO: 'en_progreso',
        ENTREGADA: 'entregada',
        EVALUADA: 'evaluada',
        RECHAZADA: 'rechazada'
    },

    // Resultado de prueba
    RESULTADO_PRUEBA: {
        APROBADO: 'aprobado',
        REPROBADO: 'reprobado',
        PENDIENTE: 'pendiente'
    },

    // Tipos de prueba médica
    TIPO_PRUEBA_MEDICA: {
        EXAMEN_GENERAL: 'examen_general',
        LABORATORIO: 'laboratorio',
        DROGAS: 'drogas',
        VISTA: 'vista',
        AUDITIVO: 'auditivo',
        PSICOLOGICO: 'psicologico',
        RAYOS_X: 'rayos_x',
        OTRO: 'otro'
    },

    // Resultado médico
    RESULTADO_MEDICO: {
        APTO: 'apto',
        NO_APTO: 'no_apto',
        APTO_CON_RESTRICCIONES: 'apto_con_restricciones',
        PENDIENTE: 'pendiente'
    },

    // Tipos de entrevista
    TIPO_ENTREVISTA: {
        TELEFONICA: 'telefonica',
        PRESENCIAL: 'presencial',
        VIDEOLLAMADA: 'videollamada',
        TECNICA: 'tecnica',
        GRUPAL: 'grupal'
    },

    // Recomendaciones de entrevista
    RECOMENDACION_ENTREVISTA: {
        CONTRATAR: 'contratar',
        SEGUNDA_ENTREVISTA: 'segunda_entrevista',
        RECHAZAR: 'rechazar',
        EN_EVALUACION: 'en_evaluacion'
    },

    // Estados de entrevista
    ESTADO_ENTREVISTA: {
        PROGRAMADA: 'programada',
        COMPLETADA: 'completada',
        CANCELADA: 'cancelada',
        REPROGRAMADA: 'reprogramada'
    },

    // Tipos de evento
    TIPO_EVENTO: {
        ENTREVISTA: 'entrevista',
        PRUEBA_TECNICA: 'prueba_tecnica',
        PRUEBA_MEDICA: 'prueba_medica',
        REUNION: 'reunion',
        FIRMA_CONTRATO: 'firma_contrato',
        INDUCCION: 'induccion',
        OTRO: 'otro'
    },

    // Estados de evento
    ESTADO_EVENTO: {
        PROGRAMADO: 'programado',
        CONFIRMADO: 'confirmado',
        COMPLETADO: 'completado',
        CANCELADO: 'cancelado',
        REPROGRAMADO: 'reprogramado'
    },

    // Tipos de documento
    TIPO_DOCUMENTO: {
        TITULO: 'titulo',
        CERTIFICADO: 'certificado',
        ANTECEDENTES: 'antecedentes',
        CARTA_RECOMENDACION: 'carta_recomendacion',
        IDENTIFICACION: 'identificacion',
        COMPROBANTE_DOMICILIO: 'comprobante_domicilio',
        OTRO: 'otro'
    },

    // Estados de verificación de documento
    ESTADO_VERIFICACION: {
        PENDIENTE: 'pendiente',
        EN_REVISION: 'en_revision',
        VERIFICADO: 'verificado',
        RECHAZADO: 'rechazado',
        NO_APLICA: 'no_aplica'
    },

    // Decisiones post-contratación
    DECISION_POST_CONTRATACION: {
        CONTINUA: 'continua',
        NO_CONTINUA: 'no_continua',
        EXTENDER_PERIODO_PRUEBA: 'extender_periodo_prueba',
        PROMOVER: 'promover'
    },

    // Tipos de acción (historial)
    TIPO_ACCION: {
        CREAR: 'crear',
        ACTUALIZAR: 'actualizar',
        ELIMINAR: 'eliminar',
        VER: 'ver'
    },

    // Tipos de reporte
    TIPO_REPORTE: {
        VACANTES: 'vacantes',
        POSTULACIONES: 'postulaciones',
        PRUEBAS: 'pruebas',
        CANDIDATOS: 'candidatos',
        ENTREVISTAS: 'entrevistas',
        CONTRATACIONES: 'contrataciones'
    },

    // Formatos de reporte
    FORMATO_REPORTE: {
        PDF: 'pdf',
        EXCEL: 'excel',
        CSV: 'csv'
    }
};
