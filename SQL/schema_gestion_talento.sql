

-- ============================================================
-- SCRIPT SQL - PLATAFORMA GESTIÓN TALENTO HUMANO
-- Base de Datos: MySQL 8.0+
-- Patrón: MVC
-- Total Tablas: 20
-- ============================================================

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS gestion_talento_humano
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE gestion_talento_humano;

-- ============================================================
-- MÓDULO 1: AUTENTICACIÓN Y SEGURIDAD
-- ============================================================

-- Tabla: Roles
CREATE TABLE Roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE COMMENT 'administrador, empresa, candidato',
    descripcion TEXT,
    permisos JSON COMMENT 'Permisos específicos en formato JSON',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Define los roles del sistema: Admin, Empresa, Candidato';

-- Tabla: Usuarios
CREATE TABLE Usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    contraseña VARCHAR(255) NOT NULL COMMENT 'Hash bcrypt o similar',
    id_rol INT NOT NULL,
    telefono VARCHAR(20),
    avatar VARCHAR(500) COMMENT 'URL de imagen de perfil',
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    ultimo_acceso DATETIME,
    estado VARCHAR(20) DEFAULT 'activo' COMMENT 'activo, suspendido, inactivo',
    token_recuperacion VARCHAR(255) COMMENT 'Token para recuperar contraseña',
    token_expiracion DATETIME,
    email_verificado BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_rol) REFERENCES Roles(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_email (email),
    INDEX idx_id_rol (id_rol),
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Tabla central de usuarios - Todos deben tener un rol';

-- ============================================================
-- MÓDULO 2: EMPRESAS
-- ============================================================

-- Tabla: Empresas
CREATE TABLE Empresas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL UNIQUE COMMENT 'Relación 1:1 con Usuarios',
    nombre_empresa VARCHAR(200) NOT NULL,
    sector VARCHAR(100) COMMENT 'Tecnología, Finanzas, Salud, etc',
    descripcion TEXT,
    sitio_web VARCHAR(255),
    ubicacion VARCHAR(255),
    pais VARCHAR(100),
    ciudad VARCHAR(100),
    direccion TEXT,
    logo VARCHAR(500) COMMENT 'URL del logo de la empresa',
    tamaño VARCHAR(50) COMMENT '1-10, 11-50, 51-200, 201-500, 500+',
    rfc_nit VARCHAR(50) COMMENT 'Registro fiscal/tributario',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_id_usuario (id_usuario),
    INDEX idx_sector (sector),
    INDEX idx_pais (pais)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Perfil de empresas que publican vacantes';

-- ============================================================
-- MÓDULO 3: CANDIDATOS
-- ============================================================

-- Tabla: Candidatos
CREATE TABLE Candidatos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL UNIQUE COMMENT 'Relación 1:1 con Usuarios',
    cv_url VARCHAR(500) COMMENT 'Ruta al archivo PDF del CV',
    perfil TEXT COMMENT 'Descripción profesional del candidato',
    titulo_profesional VARCHAR(200),
    años_experiencia INT,
    salario_esperado DECIMAL(10,2),
    disponibilidad VARCHAR(50) COMMENT 'inmediata, 2_semanas, 1_mes, otro',
    ubicacion VARCHAR(255),
    pais VARCHAR(100),
    ciudad VARCHAR(100),
    linkedin VARCHAR(255),
    portfolio VARCHAR(255),
    github VARCHAR(255),
    fecha_nacimiento DATE,
    genero VARCHAR(20),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_id_usuario (id_usuario),
    INDEX idx_pais (pais),
    INDEX idx_ciudad (ciudad),
    INDEX idx_años_experiencia (años_experiencia)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Perfil simplificado de candidatos. La experiencia laboral y educación va en el CV subido';

-- ============================================================
-- MÓDULO 4: VACANTES Y POSTULACIONES
-- ============================================================

-- Tabla: Vacantes
CREATE TABLE Vacantes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT NOT NULL,
    requisitos TEXT,
    responsabilidades TEXT,
    beneficios TEXT,
    salario_minimo DECIMAL(10,2),
    salario_maximo DECIMAL(10,2),
    mostrar_salario BOOLEAN DEFAULT FALSE,
    tipo_contrato VARCHAR(50) COMMENT 'indefinido, temporal, freelance, practicas',
    jornada VARCHAR(50) COMMENT 'tiempo_completo, medio_tiempo, por_proyecto',
    modalidad VARCHAR(50) COMMENT 'presencial, remoto, hibrido',
    ubicacion VARCHAR(255),
    pais VARCHAR(100),
    ciudad VARCHAR(100),
    años_experiencia_min INT,
    nivel_educacion VARCHAR(50),
    vacantes_disponibles INT DEFAULT 1,
    fecha_publicacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_cierre DATE,
    estado VARCHAR(20) DEFAULT 'activa' COMMENT 'activa, pausada, cerrada, cancelada',
    vistas INT DEFAULT 0 COMMENT 'Contador de vistas',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_empresa) REFERENCES Empresas(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_id_empresa (id_empresa),
    INDEX idx_estado (estado),
    INDEX idx_fecha_publicacion (fecha_publicacion),
    INDEX idx_pais (pais),
    INDEX idx_modalidad (modalidad)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Vacantes publicadas por las empresas';

-- Tabla: Postulaciones
CREATE TABLE Postulaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_candidato INT COMMENT 'NULL si es postulación semi-anónima',
    id_vacante INT NOT NULL,
    
    -- Campos para postulantes semi-anónimos (solo se llenan si id_candidato es NULL)
    nombre_postulante VARCHAR(150) COMMENT 'Solo para semi-anónimos',
    email_postulante VARCHAR(255) COMMENT 'Solo para semi-anónimos',
    telefono_postulante VARCHAR(20) COMMENT 'Solo para semi-anónimos',
    cv_postulante VARCHAR(500) COMMENT 'CV subido por semi-anónimo',
    carta_presentacion TEXT,
    
    fecha_postulacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(50) DEFAULT 'pendiente' COMMENT 'pendiente, en_revision, preseleccionado, entrevista, rechazado, aceptado, contratado',
    puntuacion INT COMMENT 'Puntuación 1-100 asignada por la empresa',
    notas_empresa TEXT COMMENT 'Notas internas de la empresa sobre el candidato',
    fecha_cambio_estado DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_candidato) REFERENCES Candidatos(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_vacante) REFERENCES Vacantes(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_id_candidato (id_candidato),
    INDEX idx_id_vacante (id_vacante),
    INDEX idx_estado (estado),
    INDEX idx_fecha_postulacion (fecha_postulacion),
    INDEX idx_email_postulante (email_postulante)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Soporta postulaciones de candidatos registrados y semi-anónimos';

-- ============================================================
-- MÓDULO 5: PRUEBAS PSICOMÉTRICAS
-- ============================================================

-- Tabla: Pruebas
CREATE TABLE Pruebas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    tipo VARCHAR(50) COMMENT 'cognitiva, personalidad, habilidades, conocimiento',
    categoria VARCHAR(100),
    duracion_minutos INT COMMENT 'Duración estimada',
    instrucciones TEXT,
    puntaje_minimo_aprobacion INT,
    estado VARCHAR(20) DEFAULT 'activa' COMMENT 'activa, inactiva, borrador',
    creador_id INT COMMENT 'Usuario que creó la prueba',
    es_publica BOOLEAN DEFAULT FALSE COMMENT 'Si otras empresas pueden usarla',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (creador_id) REFERENCES Usuarios(id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_tipo (tipo),
    INDEX idx_estado (estado),
    INDEX idx_creador_id (creador_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Catálogo de pruebas psicométricas disponibles';

-- Tabla: Preguntas
CREATE TABLE Preguntas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_prueba INT NOT NULL,
    texto_pregunta TEXT NOT NULL,
    tipo_pregunta VARCHAR(50) NOT NULL COMMENT 'multiple, verdadero_falso, abierta, escala',
    puntaje_maximo INT DEFAULT 1,
    tiempo_limite_segundos INT COMMENT 'Tiempo límite para responder esta pregunta',
    orden INT COMMENT 'Orden de aparición en la prueba',
    es_obligatoria BOOLEAN DEFAULT TRUE,
    imagen_url VARCHAR(500) COMMENT 'Imagen asociada a la pregunta',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_prueba) REFERENCES Pruebas(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_id_prueba (id_prueba),
    INDEX idx_orden (orden)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Preguntas que conforman cada prueba psicométrica';

-- Tabla: Opciones_Respuesta
CREATE TABLE Opciones_Respuesta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_pregunta INT NOT NULL,
    texto_opcion TEXT NOT NULL,
    es_correcta BOOLEAN DEFAULT FALSE,
    puntaje INT DEFAULT 0 COMMENT 'Puntos si se selecciona esta opción',
    orden INT,
    retroalimentacion TEXT COMMENT 'Feedback mostrado si se selecciona',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_pregunta) REFERENCES Preguntas(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_id_pregunta (id_pregunta)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Opciones de respuesta para preguntas de opción múltiple';

-- Tabla: Asignaciones_Prueba
CREATE TABLE Asignaciones_Prueba (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_candidato INT NOT NULL,
    id_prueba INT NOT NULL,
    id_vacante INT COMMENT 'Vacante asociada (opcional)',
    id_empresa INT COMMENT 'Empresa que asignó la prueba',
    fecha_asignacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_limite DATE COMMENT 'Fecha límite para completar',
    fecha_inicio DATETIME COMMENT 'Cuando el candidato inició la prueba',
    fecha_completado DATETIME,
    estado VARCHAR(50) DEFAULT 'pendiente' COMMENT 'pendiente, en_progreso, completada, vencida, cancelada',
    intentos_permitidos INT DEFAULT 1,
    intentos_realizados INT DEFAULT 0,
    tiempo_total_segundos INT COMMENT 'Tiempo total que tomó completarla',
    ip_inicio VARCHAR(45),
    ip_fin VARCHAR(45),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_candidato) REFERENCES Candidatos(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_prueba) REFERENCES Pruebas(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_vacante) REFERENCES Vacantes(id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (id_empresa) REFERENCES Empresas(id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_id_candidato (id_candidato),
    INDEX idx_id_prueba (id_prueba),
    INDEX idx_id_vacante (id_vacante),
    INDEX idx_estado (estado),
    INDEX idx_fecha_asignacion (fecha_asignacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='CRÍTICA: Controla qué pruebas se asignan a qué candidatos';

-- Tabla: Respuestas_Candidato
CREATE TABLE Respuestas_Candidato (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_asignacion INT NOT NULL,
    id_pregunta INT NOT NULL,
    id_opcion_seleccionada INT COMMENT 'NULL si es pregunta abierta',
    respuesta_texto TEXT COMMENT 'Para preguntas abiertas',
    tiempo_respuesta_segundos INT,
    fecha_respuesta DATETIME DEFAULT CURRENT_TIMESTAMP,
    puntaje_obtenido INT DEFAULT 0,
    
    FOREIGN KEY (id_asignacion) REFERENCES Asignaciones_Prueba(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_pregunta) REFERENCES Preguntas(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_opcion_seleccionada) REFERENCES Opciones_Respuesta(id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_id_asignacion (id_asignacion),
    INDEX idx_id_pregunta (id_pregunta)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Almacena cada respuesta individual del candidato';

-- Tabla: Resultados_Prueba
CREATE TABLE Resultados_Prueba (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_asignacion INT NOT NULL UNIQUE COMMENT 'Relación 1:1',
    id_candidato INT NOT NULL,
    id_prueba INT NOT NULL,
    fecha_resultado DATETIME DEFAULT CURRENT_TIMESTAMP,
    puntaje_total FLOAT NOT NULL,
    puntaje_maximo FLOAT NOT NULL,
    porcentaje DECIMAL(5,2),
    aprobado BOOLEAN,
    tiempo_total_segundos INT,
    respuestas_correctas INT,
    respuestas_incorrectas INT,
    preguntas_sin_responder INT,
    comentarios TEXT COMMENT 'Comentarios del evaluador',
    analisis_detallado JSON COMMENT 'Análisis por categorías en formato JSON',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_asignacion) REFERENCES Asignaciones_Prueba(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_candidato) REFERENCES Candidatos(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_prueba) REFERENCES Pruebas(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_id_candidato (id_candidato),
    INDEX idx_id_prueba (id_prueba),
    INDEX idx_fecha_resultado (fecha_resultado),
    INDEX idx_aprobado (aprobado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Resumen calculado del resultado de cada prueba completada';

-- ============================================================
-- MÓDULO 6: PRUEBAS TÉCNICAS
-- ============================================================

-- Tabla: Pruebas_Tecnicas
CREATE TABLE Pruebas_Tecnicas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_candidato INT NOT NULL,
    id_vacante INT COMMENT 'Vacante asociada',
    id_postulacion INT,
    tipo_prueba VARCHAR(100) NOT NULL COMMENT 'codigo, excel, idiomas, proyecto, caso_practico, otro',
    nombre_prueba VARCHAR(200) NOT NULL,
    descripcion TEXT,
    instrucciones TEXT,
    fecha_asignacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_limite DATE,
    fecha_entrega DATETIME COMMENT 'Cuando el candidato entregó',
    fecha_evaluacion DATETIME,
    estado VARCHAR(50) DEFAULT 'asignada' COMMENT 'asignada, en_progreso, entregada, evaluada, rechazada',
    
    -- Resultados
    resultado VARCHAR(50) COMMENT 'aprobado, reprobado, pendiente',
    puntaje DECIMAL(5,2) COMMENT 'Calificación 0-100',
    comentarios_evaluador TEXT,
    aspectos_positivos TEXT,
    aspectos_negativos TEXT,
    
    -- Archivos
    archivo_instrucciones_url VARCHAR(500) COMMENT 'PDF con instrucciones detalladas',
    archivo_respuesta_url VARCHAR(500) COMMENT 'Archivo que subió el candidato',
    
    evaluador_id INT COMMENT 'Usuario que evaluó',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_candidato) REFERENCES Candidatos(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_vacante) REFERENCES Vacantes(id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (id_postulacion) REFERENCES Postulaciones(id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (evaluador_id) REFERENCES Usuarios(id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_id_candidato (id_candidato),
    INDEX idx_id_vacante (id_vacante),
    INDEX idx_tipo_prueba (tipo_prueba),
    INDEX idx_estado (estado),
    INDEX idx_fecha_asignacion (fecha_asignacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Pruebas técnicas para evaluar conocimientos específicos: código, Excel, idiomas, proyectos';

-- ============================================================
-- MÓDULO 7: PRUEBAS MÉDICAS
-- ============================================================

-- Tabla: Pruebas_Medicas
CREATE TABLE Pruebas_Medicas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_candidato INT NOT NULL,
    id_postulacion INT COMMENT 'Postulación asociada',
    id_vacante INT,
    tipo_prueba VARCHAR(100) NOT NULL COMMENT 'examen_general, laboratorio, drogas, vista, auditivo, psicologico, rayos_x, otro',
    nombre_prueba VARCHAR(200),
    descripcion TEXT,
    fecha_solicitud DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_realizacion DATE,
    fecha_resultado DATE,
    
    -- Resultados
    resultado VARCHAR(50) COMMENT 'apto, no_apto, apto_con_restricciones, pendiente',
    observaciones TEXT,
    restricciones TEXT COMMENT 'Si es apto con restricciones, detallar aquí',
    
    -- Información médica
    medico_responsable VARCHAR(200),
    institucion_medica VARCHAR(200),
    documento_resultado_url VARCHAR(500) COMMENT 'PDF del resultado médico',
    
    -- Control
    estado VARCHAR(50) DEFAULT 'pendiente' COMMENT 'pendiente, realizada, resultado_recibido',
    valido_hasta DATE COMMENT 'Vigencia del examen médico',
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_candidato) REFERENCES Candidatos(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_postulacion) REFERENCES Postulaciones(id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (id_vacante) REFERENCES Vacantes(id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_id_candidato (id_candidato),
    INDEX idx_id_postulacion (id_postulacion),
    INDEX idx_tipo_prueba (tipo_prueba),
    INDEX idx_resultado (resultado),
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Resultados de exámenes médicos requeridos: generales, laboratorio, toxicológicos, etc';

-- ============================================================
-- MÓDULO 8: ENTREVISTAS
-- ============================================================

-- Tabla: Entrevistas
CREATE TABLE Entrevistas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_postulacion INT NOT NULL,
    id_candidato INT NOT NULL,
    id_vacante INT NOT NULL,
    tipo_entrevista VARCHAR(50) COMMENT 'telefonica, presencial, videollamada, tecnica, grupal',
    fecha_hora DATETIME NOT NULL,
    duracion_minutos INT,
    ubicacion VARCHAR(255) COMMENT 'Dirección física o link de videollamada',
    
    -- Evaluación
    entrevistador_id INT COMMENT 'Usuario de la empresa que entrevistó',
    calificacion INT COMMENT 'Calificación 1-10',
    aspectos_positivos TEXT,
    aspectos_negativos TEXT,
    habilidades_tecnicas_evaluacion TEXT,
    habilidades_blandas_evaluacion TEXT,
    
    -- Decisión
    recomendacion VARCHAR(50) COMMENT 'contratar, segunda_entrevista, rechazar, en_evaluacion',
    observaciones TEXT,
    siguiente_paso TEXT COMMENT 'Qué sigue después de esta entrevista',
    
    -- Archivos
    grabacion_url VARCHAR(500) COMMENT 'URL de grabación si aplica',
    notas_url VARCHAR(500) COMMENT 'Documento con notas detalladas',
    
    estado VARCHAR(50) DEFAULT 'programada' COMMENT 'programada, completada, cancelada, reprogramada',
    realizada BOOLEAN DEFAULT FALSE,
    fecha_evaluacion DATETIME COMMENT 'Cuando se completó la evaluación',
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_postulacion) REFERENCES Postulaciones(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_candidato) REFERENCES Candidatos(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_vacante) REFERENCES Vacantes(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (entrevistador_id) REFERENCES Usuarios(id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_id_postulacion (id_postulacion),
    INDEX idx_id_candidato (id_candidato),
    INDEX idx_id_vacante (id_vacante),
    INDEX idx_entrevistador_id (entrevistador_id),
    INDEX idx_estado (estado),
    INDEX idx_fecha_hora (fecha_hora)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Registro y evaluación de entrevistas con feedback, calificaciones y recomendaciones';

-- ============================================================
-- MÓDULO 9: EVENTOS Y CITAS
-- ============================================================

-- Tabla: Eventos
CREATE TABLE Eventos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_postulacion INT COMMENT 'Postulación asociada si aplica',
    id_candidato INT,
    id_vacante INT,
    id_empresa INT,
    
    tipo_evento VARCHAR(100) NOT NULL COMMENT 'entrevista, prueba_tecnica, prueba_medica, reunion, firma_contrato, induccion, otro',
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    
    -- Fecha y hora
    fecha_hora_inicio DATETIME NOT NULL,
    fecha_hora_fin DATETIME,
    duracion_minutos INT,
    
    -- Ubicación
    ubicacion VARCHAR(255) COMMENT 'Dirección física o link de videollamada',
    modalidad VARCHAR(50) COMMENT 'presencial, virtual, hibrido',
    
    -- Participantes
    organizador_id INT COMMENT 'Usuario que creó el evento',
    participantes JSON COMMENT 'Array de IDs de usuarios participantes',
    
    -- Estado y seguimiento
    estado VARCHAR(50) DEFAULT 'programado' COMMENT 'programado, confirmado, completado, cancelado, reprogramado',
    recordatorios_enviados BOOLEAN DEFAULT FALSE,
    notas TEXT,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_postulacion) REFERENCES Postulaciones(id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (id_candidato) REFERENCES Candidatos(id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (id_vacante) REFERENCES Vacantes(id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (id_empresa) REFERENCES Empresas(id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (organizador_id) REFERENCES Usuarios(id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_id_postulacion (id_postulacion),
    INDEX idx_id_candidato (id_candidato),
    INDEX idx_id_vacante (id_vacante),
    INDEX idx_tipo_evento (tipo_evento),
    INDEX idx_estado (estado),
    INDEX idx_fecha_hora_inicio (fecha_hora_inicio),
    INDEX idx_organizador_id (organizador_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Agenda de eventos y citas: entrevistas, pruebas médicas, reuniones, firmas, inducciones';

-- ============================================================
-- MÓDULO 10: VERIFICACIÓN DE DOCUMENTOS
-- ============================================================

-- Tabla: Verificacion_Documentos
CREATE TABLE Verificacion_Documentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_candidato INT NOT NULL,
    id_postulacion INT COMMENT 'Postulación asociada',
    
    tipo_documento VARCHAR(100) NOT NULL COMMENT 'titulo, certificado, antecedentes, carta_recomendacion, identificacion, comprobante_domicilio, otro',
    nombre_documento VARCHAR(255) NOT NULL,
    descripcion TEXT,
    es_obligatorio BOOLEAN DEFAULT FALSE,
    
    -- Archivo y verificación
    archivo_url VARCHAR(500) COMMENT 'URL del documento subido',
    fecha_subida DATETIME,
    estado_verificacion VARCHAR(50) DEFAULT 'pendiente' COMMENT 'pendiente, en_revision, verificado, rechazado, no_aplica',
    
    -- Validación
    fecha_verificacion DATETIME,
    verificado_por INT COMMENT 'Usuario que verificó el documento',
    motivo_rechazo TEXT COMMENT 'Si fue rechazado, explicar por qué',
    observaciones TEXT,
    
    -- Vigencia
    fecha_emision DATE,
    fecha_vencimiento DATE COMMENT 'Si el documento tiene vigencia',
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_candidato) REFERENCES Candidatos(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_postulacion) REFERENCES Postulaciones(id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (verificado_por) REFERENCES Usuarios(id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_id_candidato (id_candidato),
    INDEX idx_id_postulacion (id_postulacion),
    INDEX idx_tipo_documento (tipo_documento),
    INDEX idx_estado_verificacion (estado_verificacion),
    INDEX idx_es_obligatorio (es_obligatorio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Checklist de documentos del candidato: títulos, certificaciones, antecedentes, identificación';

-- ============================================================
-- MÓDULO 11: POST-CONTRATACIÓN
-- ============================================================

-- Tabla: Evaluacion_Post_Contratacion
CREATE TABLE Evaluacion_Post_Contratacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_candidato INT NOT NULL COMMENT 'Candidato que fue contratado',
    id_vacante INT NOT NULL COMMENT 'Vacante por la que fue contratado',
    id_postulacion INT,
    
    -- Información laboral
    fecha_inicio_laboral DATE NOT NULL,
    fecha_fin_periodo_prueba DATE COMMENT 'Fecha estimada de fin del periodo de prueba',
    puesto VARCHAR(200),
    departamento VARCHAR(100),
    salario_acordado DECIMAL(10,2),
    
    -- Evaluaciones durante periodo de prueba
    numero_evaluacion INT DEFAULT 1 COMMENT 'Primera evaluación, segunda, etc',
    fecha_evaluacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    evaluador_id INT COMMENT 'Jefe directo o supervisor',
    
    -- Desempeño
    desempeño_general INT COMMENT 'Calificación 1-10',
    puntualidad INT COMMENT '1-10',
    calidad_trabajo INT COMMENT '1-10',
    trabajo_equipo INT COMMENT '1-10',
    adaptacion_cultura INT COMMENT '1-10',
    cumplimiento_objetivos INT COMMENT '1-10',
    
    -- Comentarios
    aspectos_positivos TEXT,
    areas_mejora TEXT,
    logros_periodo TEXT,
    objetivos_siguiente_periodo TEXT,
    
    -- Decisión final
    decision VARCHAR(50) COMMENT 'continua, no_continua, extender_periodo_prueba, promover',
    motivo_decision TEXT,
    fecha_decision DATETIME,
    observaciones_generales TEXT,
    
    -- Seguimiento
    requiere_capacitacion BOOLEAN DEFAULT FALSE,
    areas_capacitacion TEXT,
    plan_mejora TEXT,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_candidato) REFERENCES Candidatos(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_vacante) REFERENCES Vacantes(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_postulacion) REFERENCES Postulaciones(id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (evaluador_id) REFERENCES Usuarios(id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_id_candidato (id_candidato),
    INDEX idx_id_vacante (id_vacante),
    INDEX idx_fecha_evaluacion (fecha_evaluacion),
    INDEX idx_decision (decision),
    INDEX idx_fecha_inicio_laboral (fecha_inicio_laboral)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Evaluación del candidato durante periodo de prueba con seguimiento de desempeño';

-- ============================================================
-- MÓDULO 12: ADMINISTRACIÓN Y AUDITORÍA
-- ============================================================

-- Tabla: Historial_Actividad
CREATE TABLE Historial_Actividad (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    tabla_afectada VARCHAR(100) COMMENT 'Nombre de la tabla que fue modificada',
    registro_id INT COMMENT 'ID del registro afectado',
    accion VARCHAR(50) COMMENT 'crear, actualizar, eliminar, ver',
    descripcion TEXT,
    datos_anteriores JSON COMMENT 'Estado anterior en JSON (para updates)',
    datos_nuevos JSON COMMENT 'Estado nuevo en JSON',
    ip VARCHAR(45),
    user_agent TEXT,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_id_usuario (id_usuario),
    INDEX idx_fecha (fecha),
    INDEX idx_accion (accion),
    INDEX idx_tabla_afectada (tabla_afectada)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Auditoría de todas las acciones realizadas en el sistema';

-- Tabla: Reportes
CREATE TABLE Reportes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL COMMENT 'Usuario que generó el reporte',
    tipo_reporte VARCHAR(100) NOT NULL COMMENT 'vacantes, postulaciones, pruebas, candidatos, entrevistas, contrataciones',
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    parametros JSON COMMENT 'Filtros y parámetros usados para generar el reporte',
    archivo_url VARCHAR(500) COMMENT 'URL del archivo generado',
    formato VARCHAR(20) COMMENT 'pdf, excel, csv',
    fecha_generacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) DEFAULT 'completado' COMMENT 'pendiente, procesando, completado, error',
    tiempo_generacion_segundos INT,
    
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_id_usuario (id_usuario),
    INDEX idx_tipo_reporte (tipo_reporte),
    INDEX idx_fecha_generacion (fecha_generacion),
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Sistema de reportes y analytics del sistema';

-- ============================================================
-- DATOS INICIALES - ROLES
-- ============================================================

INSERT INTO Roles (nombre, descripcion, permisos) VALUES
('administrador', 'Acceso completo al sistema', '{"all": true}'),
('empresa', 'Puede publicar vacantes y gestionar candidatos', '{"vacantes": true, "candidatos": "read", "pruebas": true}'),
('candidato', 'Puede postularse a vacantes y realizar pruebas', '{"postulaciones": true, "pruebas": "assigned"}');

-- ============================================================
-- FIN DEL SCRIPT
-- ============================================================

-- Verificar tablas creadas
SELECT TABLE_NAME, TABLE_ROWS, CREATE_TIME
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'gestion_talento_humano'
ORDER BY TABLE_NAME;
