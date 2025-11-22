-- MySQL dump for gestion_talento_humano
-- Generated at 2025-11-19T06:57:01.914Z

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Table: Asignaciones_Prueba
DROP TABLE IF EXISTS `Asignaciones_Prueba`;
CREATE TABLE `Asignaciones_Prueba` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_candidato` int(11) NOT NULL,
  `id_prueba` int(11) NOT NULL,
  `id_vacante` int(11) DEFAULT NULL COMMENT 'Vacante asociada (opcional)',
  `id_empresa` int(11) DEFAULT NULL COMMENT 'Empresa que asignó la prueba',
  `fecha_asignacion` datetime DEFAULT current_timestamp(),
  `fecha_limite` date DEFAULT NULL COMMENT 'Fecha límite para completar',
  `fecha_inicio` datetime DEFAULT NULL COMMENT 'Cuando el candidato inició la prueba',
  `fecha_completado` datetime DEFAULT NULL,
  `estado` varchar(50) DEFAULT 'pendiente' COMMENT 'pendiente, en_progreso, completada, vencida, cancelada',
  `intentos_permitidos` int(11) DEFAULT 1,
  `intentos_realizados` int(11) DEFAULT 0,
  `tiempo_total_segundos` int(11) DEFAULT NULL COMMENT 'Tiempo total que tomó completarla',
  `ip_inicio` varchar(45) DEFAULT NULL,
  `ip_fin` varchar(45) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `id_empresa` (`id_empresa`),
  KEY `idx_id_candidato` (`id_candidato`),
  KEY `idx_id_prueba` (`id_prueba`),
  KEY `idx_id_vacante` (`id_vacante`),
  KEY `idx_estado` (`estado`),
  KEY `idx_fecha_asignacion` (`fecha_asignacion`),
  KEY `asignaciones__prueba_id_candidato` (`id_candidato`),
  KEY `asignaciones__prueba_id_prueba` (`id_prueba`),
  KEY `asignaciones__prueba_id_vacante` (`id_vacante`),
  KEY `asignaciones__prueba_estado` (`estado`),
  KEY `asignaciones__prueba_fecha_asignacion` (`fecha_asignacion`),
  CONSTRAINT `Asignaciones_Prueba_ibfk_1` FOREIGN KEY (`id_candidato`) REFERENCES `Candidatos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Asignaciones_Prueba_ibfk_2` FOREIGN KEY (`id_prueba`) REFERENCES `Pruebas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Asignaciones_Prueba_ibfk_3` FOREIGN KEY (`id_vacante`) REFERENCES `Vacantes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Asignaciones_Prueba_ibfk_4` FOREIGN KEY (`id_empresa`) REFERENCES `Empresas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='CRÍTICA: Controla qué pruebas se asignan a qué candidatos';

-- Data for Asignaciones_Prueba
LOCK TABLES `Asignaciones_Prueba` WRITE;
INSERT INTO `Asignaciones_Prueba` (`id`, `id_candidato`, `id_prueba`, `id_vacante`, `id_empresa`, `fecha_asignacion`, `fecha_limite`, `fecha_inicio`, `fecha_completado`, `estado`, `intentos_permitidos`, `intentos_realizados`, `tiempo_total_segundos`, `ip_inicio`, `ip_fin`, `created_at`, `updated_at`) VALUES (1, 3, 1, 2, NULL, '2025-11-10 13:03:47', '2025-11-12 06:00:00', '2025-11-10 13:16:29', NULL, 'en_progreso', 1, 0, NULL, '::1', NULL, '2025-11-10 13:03:47', '2025-11-10 13:16:29');
INSERT INTO `Asignaciones_Prueba` (`id`, `id_candidato`, `id_prueba`, `id_vacante`, `id_empresa`, `fecha_asignacion`, `fecha_limite`, `fecha_inicio`, `fecha_completado`, `estado`, `intentos_permitidos`, `intentos_realizados`, `tiempo_total_segundos`, `ip_inicio`, `ip_fin`, `created_at`, `updated_at`) VALUES (2, 3, 2, 2, NULL, '2025-11-19 00:01:51', '2025-11-20 06:00:00', '2025-11-19 01:08:02', '2025-11-19 01:09:47', 'completada', 1, 1, 105, '::1', '::1', '2025-11-19 00:01:51', '2025-11-19 01:09:47');
INSERT INTO `Asignaciones_Prueba` (`id`, `id_candidato`, `id_prueba`, `id_vacante`, `id_empresa`, `fecha_asignacion`, `fecha_limite`, `fecha_inicio`, `fecha_completado`, `estado`, `intentos_permitidos`, `intentos_realizados`, `tiempo_total_segundos`, `ip_inicio`, `ip_fin`, `created_at`, `updated_at`) VALUES (3, 10, 2, 2, NULL, '2025-11-19 09:22:05', NULL, '2025-11-19 09:29:29', '2025-11-19 09:30:11', 'completada', 1, 1, 42, '::1', '::1', '2025-11-19 09:22:05', '2025-11-19 09:30:11');
INSERT INTO `Asignaciones_Prueba` (`id`, `id_candidato`, `id_prueba`, `id_vacante`, `id_empresa`, `fecha_asignacion`, `fecha_limite`, `fecha_inicio`, `fecha_completado`, `estado`, `intentos_permitidos`, `intentos_realizados`, `tiempo_total_segundos`, `ip_inicio`, `ip_fin`, `created_at`, `updated_at`) VALUES (4, 10, 1, 2, NULL, '2025-11-19 09:23:01', NULL, NULL, NULL, 'pendiente', 1, 0, NULL, NULL, NULL, '2025-11-19 09:23:01', '2025-11-19 09:23:01');
INSERT INTO `Asignaciones_Prueba` (`id`, `id_candidato`, `id_prueba`, `id_vacante`, `id_empresa`, `fecha_asignacion`, `fecha_limite`, `fecha_inicio`, `fecha_completado`, `estado`, `intentos_permitidos`, `intentos_realizados`, `tiempo_total_segundos`, `ip_inicio`, `ip_fin`, `created_at`, `updated_at`) VALUES (5, 11, 2, 2, NULL, '2025-11-19 12:02:53', '2025-11-27 06:00:00', '2025-11-19 12:03:43', '2025-11-19 12:04:19', 'completada', 1, 1, 36, '::1', '::1', '2025-11-19 12:02:53', '2025-11-19 12:04:19');
UNLOCK TABLES;

-- Table: Candidatos
DROP TABLE IF EXISTS `Candidatos`;
CREATE TABLE `Candidatos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL COMMENT 'Relación 1:1 con Usuarios',
  `cv_url` varchar(500) DEFAULT NULL COMMENT 'Ruta al archivo PDF del CV',
  `perfil` text DEFAULT NULL COMMENT 'Descripción profesional del candidato',
  `titulo_profesional` varchar(200) DEFAULT NULL,
  `años_experiencia` int(11) DEFAULT NULL,
  `salario_esperado` decimal(10,2) DEFAULT NULL,
  `disponibilidad` varchar(50) DEFAULT NULL COMMENT 'inmediata, 2_semanas, 1_mes, otro',
  `ubicacion` varchar(255) DEFAULT NULL,
  `pais` varchar(100) DEFAULT NULL,
  `ciudad` varchar(100) DEFAULT NULL,
  `linkedin` varchar(255) DEFAULT NULL,
  `portfolio` varchar(255) DEFAULT NULL,
  `github` varchar(255) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `genero` varchar(20) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_usuario` (`id_usuario`),
  KEY `idx_id_usuario` (`id_usuario`),
  KEY `idx_pais` (`pais`),
  KEY `idx_ciudad` (`ciudad`),
  KEY `idx_años_experiencia` (`años_experiencia`),
  KEY `candidatos_id_usuario` (`id_usuario`),
  KEY `candidatos_pais` (`pais`),
  KEY `candidatos_ciudad` (`ciudad`),
  KEY `candidatos_años_experiencia` (`años_experiencia`),
  CONSTRAINT `Candidatos_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `Usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Perfil simplificado de candidatos. La experiencia laboral y educación va en el CV subido';

-- Data for Candidatos
LOCK TABLES `Candidatos` WRITE;
INSERT INTO `Candidatos` (`id`, `id_usuario`, `cv_url`, `perfil`, `titulo_profesional`, `años_experiencia`, `salario_esperado`, `disponibilidad`, `ubicacion`, `pais`, `ciudad`, `linkedin`, `portfolio`, `github`, `fecha_nacimiento`, `genero`, `created_at`, `updated_at`) VALUES (1, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-26 11:38:01', '2025-10-26 11:38:01');
INSERT INTO `Candidatos` (`id`, `id_usuario`, `cv_url`, `perfil`, `titulo_profesional`, `años_experiencia`, `salario_esperado`, `disponibilidad`, `ubicacion`, `pais`, `ciudad`, `linkedin`, `portfolio`, `github`, `fecha_nacimiento`, `genero`, `created_at`, `updated_at`) VALUES (2, 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-26 11:39:51', '2025-10-26 11:39:51');
INSERT INTO `Candidatos` (`id`, `id_usuario`, `cv_url`, `perfil`, `titulo_profesional`, `años_experiencia`, `salario_esperado`, `disponibilidad`, `ubicacion`, `pais`, `ciudad`, `linkedin`, `portfolio`, `github`, `fecha_nacimiento`, `genero`, `created_at`, `updated_at`) VALUES (3, 3, 'https://storage.googleapis.com/arco21.firebasestorage.app/cvs/8a5fadeb-4aed-4238-8ad8-1f162039d4ad.pdf', 'HOla mi nombre es Maria', 'Ingeniería industrial', 2, '5000.00', '2_semanas', 'Xela', 'Guatemala', 'Quetzaltenango', NULL, NULL, NULL, '2025-10-29 06:00:00', 'femenino', '2025-10-26 11:42:22', '2025-10-30 23:43:52');
INSERT INTO `Candidatos` (`id`, `id_usuario`, `cv_url`, `perfil`, `titulo_profesional`, `años_experiencia`, `salario_esperado`, `disponibilidad`, `ubicacion`, `pais`, `ciudad`, `linkedin`, `portfolio`, `github`, `fecha_nacimiento`, `genero`, `created_at`, `updated_at`) VALUES (4, 4, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-26 11:42:55', '2025-10-26 11:42:55');
INSERT INTO `Candidatos` (`id`, `id_usuario`, `cv_url`, `perfil`, `titulo_profesional`, `años_experiencia`, `salario_esperado`, `disponibilidad`, `ubicacion`, `pais`, `ciudad`, `linkedin`, `portfolio`, `github`, `fecha_nacimiento`, `genero`, `created_at`, `updated_at`) VALUES (5, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-27 09:42:39', '2025-10-27 09:42:39');
INSERT INTO `Candidatos` (`id`, `id_usuario`, `cv_url`, `perfil`, `titulo_profesional`, `años_experiencia`, `salario_esperado`, `disponibilidad`, `ubicacion`, `pais`, `ciudad`, `linkedin`, `portfolio`, `github`, `fecha_nacimiento`, `genero`, `created_at`, `updated_at`) VALUES (6, 6, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-27 09:43:27', '2025-10-27 09:43:27');
INSERT INTO `Candidatos` (`id`, `id_usuario`, `cv_url`, `perfil`, `titulo_profesional`, `años_experiencia`, `salario_esperado`, `disponibilidad`, `ubicacion`, `pais`, `ciudad`, `linkedin`, `portfolio`, `github`, `fecha_nacimiento`, `genero`, `created_at`, `updated_at`) VALUES (7, 7, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-27 09:43:50', '2025-10-27 09:43:50');
INSERT INTO `Candidatos` (`id`, `id_usuario`, `cv_url`, `perfil`, `titulo_profesional`, `años_experiencia`, `salario_esperado`, `disponibilidad`, `ubicacion`, `pais`, `ciudad`, `linkedin`, `portfolio`, `github`, `fecha_nacimiento`, `genero`, `created_at`, `updated_at`) VALUES (8, 9, NULL, NULL, NULL, NULL, NULL, NULL, 'Xela', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-10 20:56:47', '2025-11-10 20:56:47');
INSERT INTO `Candidatos` (`id`, `id_usuario`, `cv_url`, `perfil`, `titulo_profesional`, `años_experiencia`, `salario_esperado`, `disponibilidad`, `ubicacion`, `pais`, `ciudad`, `linkedin`, `portfolio`, `github`, `fecha_nacimiento`, `genero`, `created_at`, `updated_at`) VALUES (9, 10, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-19 04:02:48', '2025-11-19 04:02:48');
INSERT INTO `Candidatos` (`id`, `id_usuario`, `cv_url`, `perfil`, `titulo_profesional`, `años_experiencia`, `salario_esperado`, `disponibilidad`, `ubicacion`, `pais`, `ciudad`, `linkedin`, `portfolio`, `github`, `fecha_nacimiento`, `genero`, `created_at`, `updated_at`) VALUES (10, 11, 'https://storage.googleapis.com/arco21.firebasestorage.app/cvs/d7860cb9-5810-4bb5-a518-f79ab5dda749.pdf', NULL, NULL, NULL, NULL, NULL, 'Quetzaltenango, Guatemala', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-19 09:18:18', '2025-11-19 09:19:29');
INSERT INTO `Candidatos` (`id`, `id_usuario`, `cv_url`, `perfil`, `titulo_profesional`, `años_experiencia`, `salario_esperado`, `disponibilidad`, `ubicacion`, `pais`, `ciudad`, `linkedin`, `portfolio`, `github`, `fecha_nacimiento`, `genero`, `created_at`, `updated_at`) VALUES (11, 12, 'https://storage.googleapis.com/arco21.firebasestorage.app/cvs/2164df2b-6715-4e03-903b-02a7453d89c9.pdf', 'Desarrollador de software especializado en Python con experiencia en la creación de aplicaciones web, automatización de procesos, APIs REST y análisis de datos. Manejo de frameworks como Django y Flask, así como bibliotecas para procesamiento de datos como Pandas, NumPy y Matplotlib.

Cuento con habilidades en diseño de arquitectura de software, integración con bases de datos SQL y NoSQL, y despliegue de aplicaciones en entornos Docker y Linux.

Me caracterizo por mi capacidad para resolver problemas complejos, aprender rápidamente y trabajar en equipo. Siempre busco aplicar buenas prácticas de desarrollo, testing y versionamiento de código con Git.', 'Ingeniería en sistemas', 3, '8500.00', 'inmediata', 'Quetzaltenango, Guatemala', 'Guatemala', 'Quetzaltenango', NULL, NULL, NULL, '2004-12-28 06:00:00', 'masculino', '2025-11-19 11:51:24', '2025-11-19 11:53:43');
UNLOCK TABLES;

-- Table: Contrataciones
DROP TABLE IF EXISTS `Contrataciones`;
CREATE TABLE `Contrataciones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_candidato` int(11) NOT NULL,
  `id_postulacion` int(11) DEFAULT NULL,
  `id_vacante` int(11) DEFAULT NULL,
  `id_empresa` int(11) NOT NULL,
  `fecha_contratacion` datetime DEFAULT current_timestamp(),
  `fecha_inicio_labores` date NOT NULL,
  `salario` decimal(10,2) NOT NULL,
  `cargo` varchar(200) NOT NULL,
  `departamento` varchar(100) DEFAULT NULL,
  `tipo_contrato` enum('temporal','indefinido','por_proyecto') DEFAULT 'indefinido',
  `duracion_periodo_prueba_meses` int(11) DEFAULT 3,
  `fecha_fin_periodo_prueba` date DEFAULT NULL,
  `id_supervisor` int(11) DEFAULT NULL,
  `estado` enum('periodo_prueba','planilla','finalizado','despedido') DEFAULT 'periodo_prueba',
  `notas` text DEFAULT NULL,
  `origen` enum('postulacion','importacion','manual') DEFAULT 'postulacion',
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `id_postulacion` (`id_postulacion`),
  KEY `id_vacante` (`id_vacante`),
  KEY `id_supervisor` (`id_supervisor`),
  KEY `idx_candidato` (`id_candidato`),
  KEY `idx_empresa` (`id_empresa`),
  KEY `idx_estado` (`estado`),
  KEY `idx_fecha_inicio` (`fecha_inicio_labores`),
  KEY `contrataciones_id_candidato` (`id_candidato`),
  KEY `contrataciones_id_empresa` (`id_empresa`),
  KEY `contrataciones_estado` (`estado`),
  KEY `contrataciones_fecha_inicio_labores` (`fecha_inicio_labores`),
  CONSTRAINT `Contrataciones_ibfk_1` FOREIGN KEY (`id_candidato`) REFERENCES `Candidatos` (`id`),
  CONSTRAINT `Contrataciones_ibfk_2` FOREIGN KEY (`id_postulacion`) REFERENCES `Postulaciones` (`id`),
  CONSTRAINT `Contrataciones_ibfk_3` FOREIGN KEY (`id_vacante`) REFERENCES `Vacantes` (`id`),
  CONSTRAINT `Contrataciones_ibfk_4` FOREIGN KEY (`id_empresa`) REFERENCES `Empresas` (`id`),
  CONSTRAINT `Contrataciones_ibfk_5` FOREIGN KEY (`id_supervisor`) REFERENCES `Usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Data for Contrataciones
LOCK TABLES `Contrataciones` WRITE;
INSERT INTO `Contrataciones` (`id`, `id_candidato`, `id_postulacion`, `id_vacante`, `id_empresa`, `fecha_contratacion`, `fecha_inicio_labores`, `salario`, `cargo`, `departamento`, `tipo_contrato`, `duracion_periodo_prueba_meses`, `fecha_fin_periodo_prueba`, `id_supervisor`, `estado`, `notas`, `origen`, `created_at`, `updated_at`) VALUES (1, 9, NULL, NULL, 1, '2025-11-19 04:02:48', '2022-08-31 06:00:00', '3200.00', 'Administrador de piso 1', 'Quetzaltenango', 'indefinido', 3, '2028-03-02 06:00:00', NULL, 'planilla', NULL, 'importacion', '2025-11-19 04:02:48', '2025-11-19 04:02:48');
UNLOCK TABLES;

-- Table: Empleados_Planilla
DROP TABLE IF EXISTS `Empleados_Planilla`;
CREATE TABLE `Empleados_Planilla` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_contratacion` int(11) NOT NULL,
  `fecha_ingreso_planilla` datetime DEFAULT current_timestamp(),
  `codigo_empleado` varchar(50) DEFAULT NULL,
  `estado` enum('activo','vacaciones','licencia','suspendido','inactivo') DEFAULT 'activo',
  `fecha_baja` date DEFAULT NULL,
  `motivo_baja` enum('renuncia','despido','fin_contrato','jubilacion','otro') DEFAULT NULL,
  `observaciones_baja` text DEFAULT NULL,
  `dias_vacaciones_anuales` int(11) DEFAULT 15,
  `dias_vacaciones_tomados` int(11) DEFAULT 0,
  `beneficios` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_contratacion` (`id_contratacion`),
  UNIQUE KEY `codigo_empleado` (`codigo_empleado`),
  KEY `idx_contratacion` (`id_contratacion`),
  KEY `idx_codigo` (`codigo_empleado`),
  KEY `idx_estado` (`estado`),
  KEY `empleados__planilla_id_contratacion` (`id_contratacion`),
  KEY `empleados__planilla_codigo_empleado` (`codigo_empleado`),
  KEY `empleados__planilla_estado` (`estado`),
  CONSTRAINT `Empleados_Planilla_ibfk_1` FOREIGN KEY (`id_contratacion`) REFERENCES `Contrataciones` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Data for Empleados_Planilla
LOCK TABLES `Empleados_Planilla` WRITE;
INSERT INTO `Empleados_Planilla` (`id`, `id_contratacion`, `fecha_ingreso_planilla`, `codigo_empleado`, `estado`, `fecha_baja`, `motivo_baja`, `observaciones_baja`, `dias_vacaciones_anuales`, `dias_vacaciones_tomados`, `beneficios`, `created_at`, `updated_at`) VALUES (1, 1, '2025-11-19 04:02:48', NULL, 'activo', NULL, NULL, NULL, 15, 0, NULL, '2025-11-19 04:02:48', '2025-11-19 08:55:02');
UNLOCK TABLES;

-- Table: Empresas
DROP TABLE IF EXISTS `Empresas`;
CREATE TABLE `Empresas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL COMMENT 'Relación 1:1 con Usuarios',
  `nombre_empresa` varchar(200) NOT NULL,
  `sector` varchar(100) DEFAULT NULL COMMENT 'Tecnología, Finanzas, Salud, etc',
  `descripcion` text DEFAULT NULL,
  `sitio_web` varchar(255) DEFAULT NULL,
  `ubicacion` varchar(255) DEFAULT NULL,
  `pais` varchar(100) DEFAULT NULL,
  `ciudad` varchar(100) DEFAULT NULL,
  `direccion` text DEFAULT NULL,
  `logo` varchar(500) DEFAULT NULL COMMENT 'URL del logo de la empresa',
  `tamaño` varchar(50) DEFAULT NULL COMMENT '1-10, 11-50, 51-200, 201-500, 500+',
  `rfc_nit` varchar(50) DEFAULT NULL COMMENT 'Registro fiscal/tributario',
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_usuario` (`id_usuario`),
  KEY `idx_id_usuario` (`id_usuario`),
  KEY `idx_sector` (`sector`),
  KEY `idx_pais` (`pais`),
  KEY `empresas_id_usuario` (`id_usuario`),
  KEY `empresas_sector` (`sector`),
  KEY `empresas_pais` (`pais`),
  CONSTRAINT `Empresas_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `Usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Perfil de empresas que publican vacantes';

-- Data for Empresas
LOCK TABLES `Empresas` WRITE;
INSERT INTO `Empresas` (`id`, `id_usuario`, `nombre_empresa`, `sector`, `descripcion`, `sitio_web`, `ubicacion`, `pais`, `ciudad`, `direccion`, `logo`, `tamaño`, `rfc_nit`, `created_at`, `updated_at`) VALUES (1, 8, 'TechCorp Solutions', 'tecnologia', 'Empresa líder en desarrollo de software y soluciones tecnológicas empresariales', 'https://www.techcorp.com', NULL, 'México', 'Ciudad de México', 'Av. Reforma 250, Cuauhtémoc', NULL, 'mediana', NULL, '2025-10-27 09:45:29', '2025-10-27 09:48:24');
UNLOCK TABLES;

-- Table: Entrevistas
DROP TABLE IF EXISTS `Entrevistas`;
CREATE TABLE `Entrevistas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_postulacion` int(11) NOT NULL,
  `id_candidato` int(11) NOT NULL,
  `id_vacante` int(11) NOT NULL,
  `tipo_entrevista` varchar(50) DEFAULT NULL COMMENT 'telefonica, presencial, videollamada, tecnica, grupal',
  `fecha_hora` datetime NOT NULL,
  `duracion_minutos` int(11) DEFAULT NULL,
  `ubicacion` varchar(255) DEFAULT NULL COMMENT 'Dirección física o link de videollamada',
  `entrevistador_id` int(11) DEFAULT NULL COMMENT 'Usuario de la empresa que entrevistó',
  `calificacion` int(11) DEFAULT NULL COMMENT 'Calificación 1-10',
  `aspectos_positivos` text DEFAULT NULL,
  `aspectos_negativos` text DEFAULT NULL,
  `habilidades_tecnicas_evaluacion` text DEFAULT NULL,
  `habilidades_blandas_evaluacion` text DEFAULT NULL,
  `recomendacion` varchar(50) DEFAULT NULL COMMENT 'contratar, segunda_entrevista, rechazar, en_evaluacion',
  `observaciones` text DEFAULT NULL,
  `siguiente_paso` text DEFAULT NULL COMMENT 'Qué sigue después de esta entrevista',
  `grabacion_url` varchar(500) DEFAULT NULL COMMENT 'URL de grabación si aplica',
  `notas_url` varchar(500) DEFAULT NULL COMMENT 'Documento con notas detalladas',
  `estado` varchar(50) DEFAULT 'programada' COMMENT 'programada, completada, cancelada, reprogramada',
  `realizada` tinyint(1) DEFAULT 0,
  `fecha_evaluacion` datetime DEFAULT NULL COMMENT 'Cuando se completó la evaluación',
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_id_postulacion` (`id_postulacion`),
  KEY `idx_id_candidato` (`id_candidato`),
  KEY `idx_id_vacante` (`id_vacante`),
  KEY `idx_entrevistador_id` (`entrevistador_id`),
  KEY `idx_estado` (`estado`),
  KEY `idx_fecha_hora` (`fecha_hora`),
  KEY `entrevistas_id_postulacion` (`id_postulacion`),
  KEY `entrevistas_id_candidato` (`id_candidato`),
  KEY `entrevistas_id_vacante` (`id_vacante`),
  KEY `entrevistas_entrevistador_id` (`entrevistador_id`),
  KEY `entrevistas_estado` (`estado`),
  KEY `entrevistas_fecha_hora` (`fecha_hora`),
  CONSTRAINT `Entrevistas_ibfk_1` FOREIGN KEY (`id_postulacion`) REFERENCES `Postulaciones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Entrevistas_ibfk_2` FOREIGN KEY (`id_candidato`) REFERENCES `Candidatos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Entrevistas_ibfk_3` FOREIGN KEY (`id_vacante`) REFERENCES `Vacantes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Entrevistas_ibfk_4` FOREIGN KEY (`entrevistador_id`) REFERENCES `Usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Registro y evaluación de entrevistas con feedback, calificaciones y recomendaciones';

-- Table: Evaluacion_Post_Contratacion
DROP TABLE IF EXISTS `Evaluacion_Post_Contratacion`;
CREATE TABLE `Evaluacion_Post_Contratacion` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_candidato` int(11) NOT NULL COMMENT 'Candidato que fue contratado',
  `id_vacante` int(11) NOT NULL COMMENT 'Vacante por la que fue contratado',
  `id_postulacion` int(11) DEFAULT NULL,
  `fecha_inicio_laboral` date NOT NULL,
  `fecha_fin_periodo_prueba` date DEFAULT NULL COMMENT 'Fecha estimada de fin del periodo de prueba',
  `puesto` varchar(200) DEFAULT NULL,
  `departamento` varchar(100) DEFAULT NULL,
  `salario_acordado` decimal(10,2) DEFAULT NULL,
  `numero_evaluacion` int(11) DEFAULT 1 COMMENT 'Primera evaluación, segunda, etc',
  `fecha_evaluacion` datetime DEFAULT current_timestamp(),
  `evaluador_id` int(11) DEFAULT NULL COMMENT 'Jefe directo o supervisor',
  `desempeño_general` int(11) DEFAULT NULL COMMENT 'Calificación 1-10',
  `puntualidad` int(11) DEFAULT NULL COMMENT '1-10',
  `calidad_trabajo` int(11) DEFAULT NULL COMMENT '1-10',
  `trabajo_equipo` int(11) DEFAULT NULL COMMENT '1-10',
  `adaptacion_cultura` int(11) DEFAULT NULL COMMENT '1-10',
  `cumplimiento_objetivos` int(11) DEFAULT NULL COMMENT '1-10',
  `aspectos_positivos` text DEFAULT NULL,
  `areas_mejora` text DEFAULT NULL,
  `logros_periodo` text DEFAULT NULL,
  `objetivos_siguiente_periodo` text DEFAULT NULL,
  `decision` varchar(50) DEFAULT NULL COMMENT 'continua, no_continua, extender_periodo_prueba, promover',
  `motivo_decision` text DEFAULT NULL,
  `fecha_decision` datetime DEFAULT NULL,
  `observaciones_generales` text DEFAULT NULL,
  `requiere_capacitacion` tinyint(1) DEFAULT 0,
  `areas_capacitacion` text DEFAULT NULL,
  `plan_mejora` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `id_postulacion` (`id_postulacion`),
  KEY `evaluador_id` (`evaluador_id`),
  KEY `idx_id_candidato` (`id_candidato`),
  KEY `idx_id_vacante` (`id_vacante`),
  KEY `idx_fecha_evaluacion` (`fecha_evaluacion`),
  KEY `idx_decision` (`decision`),
  KEY `idx_fecha_inicio_laboral` (`fecha_inicio_laboral`),
  KEY `evaluacion__post__contratacion_id_candidato` (`id_candidato`),
  KEY `evaluacion__post__contratacion_id_vacante` (`id_vacante`),
  KEY `evaluacion__post__contratacion_fecha_evaluacion` (`fecha_evaluacion`),
  KEY `evaluacion__post__contratacion_decision` (`decision`),
  KEY `evaluacion__post__contratacion_fecha_inicio_laboral` (`fecha_inicio_laboral`),
  CONSTRAINT `Evaluacion_Post_Contratacion_ibfk_1` FOREIGN KEY (`id_candidato`) REFERENCES `Candidatos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Evaluacion_Post_Contratacion_ibfk_2` FOREIGN KEY (`id_vacante`) REFERENCES `Vacantes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Evaluacion_Post_Contratacion_ibfk_3` FOREIGN KEY (`id_postulacion`) REFERENCES `Postulaciones` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Evaluacion_Post_Contratacion_ibfk_4` FOREIGN KEY (`evaluador_id`) REFERENCES `Usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Evaluación del candidato durante periodo de prueba con seguimiento de desempeño';

-- Table: Evaluaciones_Periodo_Prueba
DROP TABLE IF EXISTS `Evaluaciones_Periodo_Prueba`;
CREATE TABLE `Evaluaciones_Periodo_Prueba` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_contratacion` int(11) NOT NULL,
  `fecha_evaluacion` datetime DEFAULT current_timestamp(),
  `tipo_evaluacion` enum('30_dias','60_dias','90_dias','final','extraordinaria') NOT NULL,
  `puntualidad` int(11) NOT NULL CHECK (`puntualidad` between 1 and 5),
  `cumplimiento_objetivos` int(11) NOT NULL CHECK (`cumplimiento_objetivos` between 1 and 5),
  `adaptacion_equipo` int(11) NOT NULL CHECK (`adaptacion_equipo` between 1 and 5),
  `habilidades_tecnicas` int(11) NOT NULL CHECK (`habilidades_tecnicas` between 1 and 5),
  `actitud_compromiso` int(11) NOT NULL CHECK (`actitud_compromiso` between 1 and 5),
  `promedio` decimal(3,2) DEFAULT NULL,
  `comentarios_supervisor` text DEFAULT NULL,
  `fortalezas` text DEFAULT NULL,
  `areas_mejora` text DEFAULT NULL,
  `recomendacion` enum('aprobar','extender','no_renovar') NOT NULL,
  `evaluado_por` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `evaluado_por` (`evaluado_por`),
  KEY `idx_contratacion` (`id_contratacion`),
  KEY `idx_tipo` (`tipo_evaluacion`),
  KEY `idx_fecha` (`fecha_evaluacion`),
  KEY `evaluaciones__periodo__prueba_id_contratacion` (`id_contratacion`),
  KEY `evaluaciones__periodo__prueba_tipo_evaluacion` (`tipo_evaluacion`),
  KEY `evaluaciones__periodo__prueba_fecha_evaluacion` (`fecha_evaluacion`),
  CONSTRAINT `Evaluaciones_Periodo_Prueba_ibfk_1` FOREIGN KEY (`id_contratacion`) REFERENCES `Contrataciones` (`id`) ON DELETE CASCADE,
  CONSTRAINT `Evaluaciones_Periodo_Prueba_ibfk_2` FOREIGN KEY (`evaluado_por`) REFERENCES `Usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Table: Evaluaciones_Psicometricas
DROP TABLE IF EXISTS `Evaluaciones_Psicometricas`;
CREATE TABLE `Evaluaciones_Psicometricas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_asignacion` int(11) NOT NULL,
  `id_candidato` int(11) NOT NULL,
  `id_evaluador` int(11) DEFAULT NULL,
  `resultado` enum('aprobado','no_aprobado','pendiente_revision') NOT NULL DEFAULT 'pendiente_revision',
  `porcentaje_aptitud` int(11) NOT NULL DEFAULT 0,
  `observaciones` text DEFAULT NULL,
  `fecha_evaluacion` datetime NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_asignacion` (`id_asignacion`),
  KEY `idx_id_asignacion` (`id_asignacion`),
  KEY `idx_id_candidato` (`id_candidato`),
  KEY `idx_id_evaluador` (`id_evaluador`),
  KEY `idx_resultado` (`resultado`),
  CONSTRAINT `fk_evaluacion_psico_asignacion` FOREIGN KEY (`id_asignacion`) REFERENCES `Asignaciones_Prueba` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_evaluacion_psico_candidato` FOREIGN KEY (`id_candidato`) REFERENCES `Candidatos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_evaluacion_psico_evaluador` FOREIGN KEY (`id_evaluador`) REFERENCES `Usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for Evaluaciones_Psicometricas
LOCK TABLES `Evaluaciones_Psicometricas` WRITE;
INSERT INTO `Evaluaciones_Psicometricas` (`id`, `id_asignacion`, `id_candidato`, `id_evaluador`, `resultado`, `porcentaje_aptitud`, `observaciones`, `fecha_evaluacion`, `created_at`, `updated_at`) VALUES (1, 2, 3, 8, 'aprobado', 70, 'TOdo bien', '2025-11-19 09:15:09', '2025-11-19 09:10:40', '2025-11-19 09:15:09');
INSERT INTO `Evaluaciones_Psicometricas` (`id`, `id_asignacion`, `id_candidato`, `id_evaluador`, `resultado`, `porcentaje_aptitud`, `observaciones`, `fecha_evaluacion`, `created_at`, `updated_at`) VALUES (2, 3, 10, 8, 'aprobado', 85, 'Todo bien', '2025-11-19 09:30:47', '2025-11-19 09:30:47', '2025-11-19 09:30:47');
INSERT INTO `Evaluaciones_Psicometricas` (`id`, `id_asignacion`, `id_candidato`, `id_evaluador`, `resultado`, `porcentaje_aptitud`, `observaciones`, `fecha_evaluacion`, `created_at`, `updated_at`) VALUES (3, 5, 11, 8, 'aprobado', 85, 'Todo estuvo bien, que vaya con un psicologo', '2025-11-19 12:05:34', '2025-11-19 12:05:34', '2025-11-19 12:05:34');
UNLOCK TABLES;

-- Table: Eventos
DROP TABLE IF EXISTS `Eventos`;
CREATE TABLE `Eventos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_postulacion` int(11) DEFAULT NULL COMMENT 'Postulación asociada si aplica',
  `id_candidato` int(11) DEFAULT NULL,
  `id_vacante` int(11) DEFAULT NULL,
  `id_empresa` int(11) DEFAULT NULL,
  `tipo_evento` varchar(100) NOT NULL COMMENT 'entrevista, prueba_tecnica, prueba_medica, reunion, firma_contrato, induccion, otro',
  `titulo` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `fecha_hora_inicio` datetime NOT NULL,
  `fecha_hora_fin` datetime DEFAULT NULL,
  `duracion_minutos` int(11) DEFAULT NULL,
  `ubicacion` varchar(255) DEFAULT NULL COMMENT 'Dirección física o link de videollamada',
  `modalidad` varchar(50) DEFAULT NULL COMMENT 'presencial, virtual, hibrido',
  `organizador_id` int(11) DEFAULT NULL COMMENT 'Usuario que creó el evento',
  `participantes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Array de IDs de usuarios participantes' CHECK (json_valid(`participantes`)),
  `estado` varchar(50) DEFAULT 'programado' COMMENT 'programado, confirmado, completado, cancelado, reprogramado',
  `recordatorios_enviados` tinyint(1) DEFAULT 0,
  `notas` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `id_empresa` (`id_empresa`),
  KEY `idx_id_postulacion` (`id_postulacion`),
  KEY `idx_id_candidato` (`id_candidato`),
  KEY `idx_id_vacante` (`id_vacante`),
  KEY `idx_tipo_evento` (`tipo_evento`),
  KEY `idx_estado` (`estado`),
  KEY `idx_fecha_hora_inicio` (`fecha_hora_inicio`),
  KEY `idx_organizador_id` (`organizador_id`),
  KEY `eventos_id_postulacion` (`id_postulacion`),
  KEY `eventos_id_candidato` (`id_candidato`),
  KEY `eventos_id_vacante` (`id_vacante`),
  KEY `eventos_tipo_evento` (`tipo_evento`),
  KEY `eventos_estado` (`estado`),
  KEY `eventos_fecha_hora_inicio` (`fecha_hora_inicio`),
  KEY `eventos_organizador_id` (`organizador_id`),
  CONSTRAINT `Eventos_ibfk_1` FOREIGN KEY (`id_postulacion`) REFERENCES `Postulaciones` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Eventos_ibfk_2` FOREIGN KEY (`id_candidato`) REFERENCES `Candidatos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Eventos_ibfk_3` FOREIGN KEY (`id_vacante`) REFERENCES `Vacantes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Eventos_ibfk_4` FOREIGN KEY (`id_empresa`) REFERENCES `Empresas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Eventos_ibfk_5` FOREIGN KEY (`organizador_id`) REFERENCES `Usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Agenda de eventos y citas: entrevistas, pruebas médicas, reuniones, firmas, inducciones';

-- Table: Historial_Actividad
DROP TABLE IF EXISTS `Historial_Actividad`;
CREATE TABLE `Historial_Actividad` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) DEFAULT NULL,
  `tabla_afectada` varchar(100) DEFAULT NULL COMMENT 'Nombre de la tabla que fue modificada',
  `registro_id` int(11) DEFAULT NULL COMMENT 'ID del registro afectado',
  `accion` varchar(50) DEFAULT NULL COMMENT 'crear, actualizar, eliminar, ver',
  `descripcion` text DEFAULT NULL,
  `datos_anteriores` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Estado anterior en JSON (para updates)' CHECK (json_valid(`datos_anteriores`)),
  `datos_nuevos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Estado nuevo en JSON' CHECK (json_valid(`datos_nuevos`)),
  `ip` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `fecha` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_id_usuario` (`id_usuario`),
  KEY `idx_fecha` (`fecha`),
  KEY `idx_accion` (`accion`),
  KEY `idx_tabla_afectada` (`tabla_afectada`),
  KEY `historial__actividad_id_usuario` (`id_usuario`),
  KEY `historial__actividad_fecha` (`fecha`),
  KEY `historial__actividad_accion` (`accion`),
  KEY `historial__actividad_tabla_afectada` (`tabla_afectada`),
  CONSTRAINT `Historial_Actividad_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `Usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Auditoría de todas las acciones realizadas en el sistema';

-- Table: Opciones_Respuesta
DROP TABLE IF EXISTS `Opciones_Respuesta`;
CREATE TABLE `Opciones_Respuesta` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_pregunta` int(11) NOT NULL,
  `texto_opcion` text NOT NULL,
  `es_correcta` tinyint(1) DEFAULT 0,
  `puntaje` int(11) DEFAULT 0 COMMENT 'Puntos si se selecciona esta opción',
  `orden` int(11) DEFAULT NULL,
  `retroalimentacion` text DEFAULT NULL COMMENT 'Feedback mostrado si se selecciona',
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_id_pregunta` (`id_pregunta`),
  KEY `opciones__respuesta_id_pregunta` (`id_pregunta`),
  CONSTRAINT `Opciones_Respuesta_ibfk_1` FOREIGN KEY (`id_pregunta`) REFERENCES `Preguntas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Opciones de respuesta para preguntas de opción múltiple';

-- Data for Opciones_Respuesta
LOCK TABLES `Opciones_Respuesta` WRITE;
INSERT INTO `Opciones_Respuesta` (`id`, `id_pregunta`, `texto_opcion`, `es_correcta`, `puntaje`, `orden`, `retroalimentacion`, `created_at`) VALUES (1, 5, '1', 0, 0, 1, NULL, '2025-11-19 00:01:32');
INSERT INTO `Opciones_Respuesta` (`id`, `id_pregunta`, `texto_opcion`, `es_correcta`, `puntaje`, `orden`, `retroalimentacion`, `created_at`) VALUES (2, 5, '2', 0, 0, 2, NULL, '2025-11-19 00:01:32');
INSERT INTO `Opciones_Respuesta` (`id`, `id_pregunta`, `texto_opcion`, `es_correcta`, `puntaje`, `orden`, `retroalimentacion`, `created_at`) VALUES (3, 5, '3', 0, 0, 3, NULL, '2025-11-19 00:01:32');
INSERT INTO `Opciones_Respuesta` (`id`, `id_pregunta`, `texto_opcion`, `es_correcta`, `puntaje`, `orden`, `retroalimentacion`, `created_at`) VALUES (4, 5, '4', 0, 0, 4, NULL, '2025-11-19 00:01:32');
INSERT INTO `Opciones_Respuesta` (`id`, `id_pregunta`, `texto_opcion`, `es_correcta`, `puntaje`, `orden`, `retroalimentacion`, `created_at`) VALUES (5, 5, '5', 0, 0, 5, NULL, '2025-11-19 00:01:32');
INSERT INTO `Opciones_Respuesta` (`id`, `id_pregunta`, `texto_opcion`, `es_correcta`, `puntaje`, `orden`, `retroalimentacion`, `created_at`) VALUES (6, 6, 'Verdadero', 0, 0, 1, NULL, '2025-11-19 12:02:00');
INSERT INTO `Opciones_Respuesta` (`id`, `id_pregunta`, `texto_opcion`, `es_correcta`, `puntaje`, `orden`, `retroalimentacion`, `created_at`) VALUES (7, 6, 'Falso', 0, 0, 2, NULL, '2025-11-19 12:02:00');
UNLOCK TABLES;

-- Table: Postulaciones
DROP TABLE IF EXISTS `Postulaciones`;
CREATE TABLE `Postulaciones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_candidato` int(11) DEFAULT NULL COMMENT 'NULL si es postulación semi-anónima',
  `id_vacante` int(11) NOT NULL,
  `nombre_postulante` varchar(150) DEFAULT NULL COMMENT 'Solo para semi-anónimos',
  `email_postulante` varchar(255) DEFAULT NULL COMMENT 'Solo para semi-anónimos',
  `telefono_postulante` varchar(20) DEFAULT NULL COMMENT 'Solo para semi-anónimos',
  `cv_postulante` varchar(500) DEFAULT NULL COMMENT 'CV subido por semi-anónimo',
  `carta_presentacion` text DEFAULT NULL,
  `fecha_postulacion` datetime DEFAULT current_timestamp(),
  `estado` varchar(50) DEFAULT 'pendiente' COMMENT 'pendiente, en_revision, preseleccionado, entrevista, rechazado, aceptado, contratado',
  `puntuacion` int(11) DEFAULT NULL COMMENT 'Puntuación 1-100 asignada por la empresa',
  `notas_empresa` text DEFAULT NULL COMMENT 'Notas internas de la empresa sobre el candidato',
  `fecha_cambio_estado` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_id_candidato` (`id_candidato`),
  KEY `idx_id_vacante` (`id_vacante`),
  KEY `idx_estado` (`estado`),
  KEY `idx_fecha_postulacion` (`fecha_postulacion`),
  KEY `idx_email_postulante` (`email_postulante`),
  KEY `postulaciones_id_candidato` (`id_candidato`),
  KEY `postulaciones_id_vacante` (`id_vacante`),
  KEY `postulaciones_estado` (`estado`),
  KEY `postulaciones_fecha_postulacion` (`fecha_postulacion`),
  KEY `postulaciones_email_postulante` (`email_postulante`),
  CONSTRAINT `Postulaciones_ibfk_1` FOREIGN KEY (`id_candidato`) REFERENCES `Candidatos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Postulaciones_ibfk_2` FOREIGN KEY (`id_vacante`) REFERENCES `Vacantes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Soporta postulaciones de candidatos registrados y semi-anónimos';

-- Data for Postulaciones
LOCK TABLES `Postulaciones` WRITE;
INSERT INTO `Postulaciones` (`id`, `id_candidato`, `id_vacante`, `nombre_postulante`, `email_postulante`, `telefono_postulante`, `cv_postulante`, `carta_presentacion`, `fecha_postulacion`, `estado`, `puntuacion`, `notas_empresa`, `fecha_cambio_estado`, `created_at`, `updated_at`) VALUES (1, 3, 2, NULL, NULL, NULL, NULL, NULL, '2025-11-10 12:59:25', 'pruebas', NULL, NULL, '2025-11-19 01:57:51', '2025-11-10 12:59:25', '2025-11-19 01:57:51');
INSERT INTO `Postulaciones` (`id`, `id_candidato`, `id_vacante`, `nombre_postulante`, `email_postulante`, `telefono_postulante`, `cv_postulante`, `carta_presentacion`, `fecha_postulacion`, `estado`, `puntuacion`, `notas_empresa`, `fecha_cambio_estado`, `created_at`, `updated_at`) VALUES (2, 10, 2, NULL, NULL, NULL, NULL, 'hola', '2025-11-19 09:19:48', 'pruebas', NULL, NULL, '2025-11-19 09:22:10', '2025-11-19 09:19:48', '2025-11-19 09:22:10');
INSERT INTO `Postulaciones` (`id`, `id_candidato`, `id_vacante`, `nombre_postulante`, `email_postulante`, `telefono_postulante`, `cv_postulante`, `carta_presentacion`, `fecha_postulacion`, `estado`, `puntuacion`, `notas_empresa`, `fecha_cambio_estado`, `created_at`, `updated_at`) VALUES (3, 11, 2, NULL, NULL, NULL, NULL, NULL, '2025-11-19 11:54:01', 'contratado', NULL, NULL, '2025-11-19 12:10:11', '2025-11-19 11:54:01', '2025-11-19 12:10:11');
UNLOCK TABLES;

-- Table: Preguntas
DROP TABLE IF EXISTS `Preguntas`;
CREATE TABLE `Preguntas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_prueba` int(11) NOT NULL,
  `texto_pregunta` text NOT NULL,
  `tipo_pregunta` varchar(50) NOT NULL COMMENT 'multiple, verdadero_falso, abierta, escala',
  `puntaje_maximo` int(11) DEFAULT 1,
  `tiempo_limite_segundos` int(11) DEFAULT NULL COMMENT 'Tiempo límite para responder esta pregunta',
  `orden` int(11) DEFAULT NULL COMMENT 'Orden de aparición en la prueba',
  `es_obligatoria` tinyint(1) DEFAULT 1,
  `imagen_url` varchar(500) DEFAULT NULL COMMENT 'Imagen asociada a la pregunta',
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_id_prueba` (`id_prueba`),
  KEY `idx_orden` (`orden`),
  KEY `preguntas_id_prueba` (`id_prueba`),
  KEY `preguntas_orden` (`orden`),
  CONSTRAINT `Preguntas_ibfk_1` FOREIGN KEY (`id_prueba`) REFERENCES `Pruebas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Preguntas que conforman cada prueba psicométrica';

-- Data for Preguntas
LOCK TABLES `Preguntas` WRITE;
INSERT INTO `Preguntas` (`id`, `id_prueba`, `texto_pregunta`, `tipo_pregunta`, `puntaje_maximo`, `tiempo_limite_segundos`, `orden`, `es_obligatoria`, `imagen_url`, `created_at`) VALUES (1, 1, 'Ingresa tus aspiraciones', 'abierta', 10, NULL, 1, 1, NULL, '2025-11-08 00:43:59');
INSERT INTO `Preguntas` (`id`, `id_prueba`, `texto_pregunta`, `tipo_pregunta`, `puntaje_maximo`, `tiempo_limite_segundos`, `orden`, `es_obligatoria`, `imagen_url`, `created_at`) VALUES (2, 1, 'Ingresa porque quiere trabajar aqui', 'abierta', 90, NULL, 2, 1, NULL, '2025-11-08 00:44:14');
INSERT INTO `Preguntas` (`id`, `id_prueba`, `texto_pregunta`, `tipo_pregunta`, `puntaje_maximo`, `tiempo_limite_segundos`, `orden`, `es_obligatoria`, `imagen_url`, `created_at`) VALUES (3, 2, 'Escribe tu nombre completo', 'abierta', 40, NULL, 1, 1, NULL, '2025-11-19 00:00:48');
INSERT INTO `Preguntas` (`id`, `id_prueba`, `texto_pregunta`, `tipo_pregunta`, `puntaje_maximo`, `tiempo_limite_segundos`, `orden`, `es_obligatoria`, `imagen_url`, `created_at`) VALUES (4, 2, 'Escribe tus aspiraciones', 'abierta', 20, NULL, 2, 1, NULL, '2025-11-19 00:01:02');
INSERT INTO `Preguntas` (`id`, `id_prueba`, `texto_pregunta`, `tipo_pregunta`, `puntaje_maximo`, `tiempo_limite_segundos`, `orden`, `es_obligatoria`, `imagen_url`, `created_at`) VALUES (5, 2, '¿Cuánto estás dispuesto a trabajar?', 'escala', 1, NULL, 3, 1, NULL, '2025-11-19 00:01:32');
INSERT INTO `Preguntas` (`id`, `id_prueba`, `texto_pregunta`, `tipo_pregunta`, `puntaje_maximo`, `tiempo_limite_segundos`, `orden`, `es_obligatoria`, `imagen_url`, `created_at`) VALUES (6, 2, 'Es etico usar IA?', 'verdadero_falso', 1, NULL, 4, 1, NULL, '2025-11-19 12:02:00');
UNLOCK TABLES;

-- Table: Pruebas
DROP TABLE IF EXISTS `Pruebas`;
CREATE TABLE `Pruebas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(200) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `tipo` varchar(50) DEFAULT NULL COMMENT 'cognitiva, personalidad, habilidades, conocimiento',
  `categoria` varchar(100) DEFAULT NULL,
  `duracion_minutos` int(11) DEFAULT NULL COMMENT 'Duración estimada',
  `instrucciones` text DEFAULT NULL,
  `puntaje_minimo_aprobacion` int(11) DEFAULT NULL,
  `estado` varchar(20) DEFAULT 'activa' COMMENT 'activa, inactiva, borrador',
  `creador_id` int(11) DEFAULT NULL COMMENT 'Usuario que creó la prueba',
  `es_publica` tinyint(1) DEFAULT 0 COMMENT 'Si otras empresas pueden usarla',
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_tipo` (`tipo`),
  KEY `idx_estado` (`estado`),
  KEY `idx_creador_id` (`creador_id`),
  KEY `pruebas_tipo` (`tipo`),
  KEY `pruebas_estado` (`estado`),
  KEY `pruebas_creador_id` (`creador_id`),
  CONSTRAINT `Pruebas_ibfk_1` FOREIGN KEY (`creador_id`) REFERENCES `Usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Catálogo de pruebas psicométricas disponibles';

-- Data for Pruebas
LOCK TABLES `Pruebas` WRITE;
INSERT INTO `Pruebas` (`id`, `nombre`, `descripcion`, `tipo`, `categoria`, `duracion_minutos`, `instrucciones`, `puntaje_minimo_aprobacion`, `estado`, `creador_id`, `es_publica`, `created_at`, `updated_at`) VALUES (1, 'Prueba personalidad 1', 'Descripcion avanzada', 'cognitiva', NULL, 10, NULL, NULL, 'activa', 8, 0, '2025-11-07 23:58:55', '2025-11-07 23:58:55');
INSERT INTO `Pruebas` (`id`, `nombre`, `descripcion`, `tipo`, `categoria`, `duracion_minutos`, `instrucciones`, `puntaje_minimo_aprobacion`, `estado`, `creador_id`, `es_publica`, `created_at`, `updated_at`) VALUES (2, 'Prueba personalidad 2', 'descripcion general', 'personalidad', NULL, 60, NULL, 70, 'activa', 8, 0, '2025-11-19 00:00:23', '2025-11-19 00:00:23');
UNLOCK TABLES;

-- Table: Pruebas_Medicas
DROP TABLE IF EXISTS `Pruebas_Medicas`;
CREATE TABLE `Pruebas_Medicas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_candidato` int(11) NOT NULL,
  `id_postulacion` int(11) DEFAULT NULL COMMENT 'Postulación asociada',
  `id_vacante` int(11) DEFAULT NULL,
  `tipo_prueba` varchar(100) NOT NULL COMMENT 'examen_general, laboratorio, drogas, vista, auditivo, psicologico, rayos_x, otro',
  `nombre_prueba` varchar(200) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `fecha_solicitud` datetime DEFAULT current_timestamp(),
  `fecha_realizacion` date DEFAULT NULL,
  `fecha_resultado` date DEFAULT NULL,
  `resultado` varchar(50) DEFAULT NULL COMMENT 'apto, no_apto, apto_con_restricciones, pendiente',
  `observaciones` text DEFAULT NULL,
  `restricciones` text DEFAULT NULL COMMENT 'Si es apto con restricciones, detallar aquí',
  `medico_responsable` varchar(200) DEFAULT NULL,
  `institucion_medica` varchar(200) DEFAULT NULL,
  `documento_resultado_url` varchar(500) DEFAULT NULL COMMENT 'PDF del resultado médico',
  `estado` varchar(50) DEFAULT 'pendiente' COMMENT 'pendiente, realizada, resultado_recibido',
  `valido_hasta` date DEFAULT NULL COMMENT 'Vigencia del examen médico',
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `porcentaje_aptitud` int(11) DEFAULT NULL COMMENT 'Porcentaje de aptitud 0-100',
  PRIMARY KEY (`id`),
  KEY `id_vacante` (`id_vacante`),
  KEY `idx_id_candidato` (`id_candidato`),
  KEY `idx_id_postulacion` (`id_postulacion`),
  KEY `idx_tipo_prueba` (`tipo_prueba`),
  KEY `idx_resultado` (`resultado`),
  KEY `idx_estado` (`estado`),
  KEY `pruebas__medicas_id_candidato` (`id_candidato`),
  KEY `pruebas__medicas_id_postulacion` (`id_postulacion`),
  KEY `pruebas__medicas_tipo_prueba` (`tipo_prueba`),
  KEY `pruebas__medicas_resultado` (`resultado`),
  KEY `pruebas__medicas_estado` (`estado`),
  CONSTRAINT `Pruebas_Medicas_ibfk_1` FOREIGN KEY (`id_candidato`) REFERENCES `Candidatos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Pruebas_Medicas_ibfk_2` FOREIGN KEY (`id_postulacion`) REFERENCES `Postulaciones` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Pruebas_Medicas_ibfk_3` FOREIGN KEY (`id_vacante`) REFERENCES `Vacantes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Resultados de exámenes médicos requeridos: generales, laboratorio, toxicológicos, etc';

-- Data for Pruebas_Medicas
LOCK TABLES `Pruebas_Medicas` WRITE;
INSERT INTO `Pruebas_Medicas` (`id`, `id_candidato`, `id_postulacion`, `id_vacante`, `tipo_prueba`, `nombre_prueba`, `descripcion`, `fecha_solicitud`, `fecha_realizacion`, `fecha_resultado`, `resultado`, `observaciones`, `restricciones`, `medico_responsable`, `institucion_medica`, `documento_resultado_url`, `estado`, `valido_hasta`, `created_at`, `updated_at`, `porcentaje_aptitud`) VALUES (1, 3, 1, 2, 'vista', 'Examen de vista general', 'ninguna', '2025-11-19 01:57:49', NULL, '2025-11-18 06:00:00', 'apto', 'Todo estuvo bien', NULL, NULL, NULL, 'https://storage.googleapis.com/arco21.firebasestorage.app/pruebas-medicas/2c3d446b-49a8-4cfc-82ac-28d9bcb633b9.pdf', 'resultado_recibido', NULL, '2025-11-19 01:57:49', '2025-11-19 01:58:16', 100);
INSERT INTO `Pruebas_Medicas` (`id`, `id_candidato`, `id_postulacion`, `id_vacante`, `tipo_prueba`, `nombre_prueba`, `descripcion`, `fecha_solicitud`, `fecha_realizacion`, `fecha_resultado`, `resultado`, `observaciones`, `restricciones`, `medico_responsable`, `institucion_medica`, `documento_resultado_url`, `estado`, `valido_hasta`, `created_at`, `updated_at`, `porcentaje_aptitud`) VALUES (2, 3, 1, 2, 'drogas', 'Prueba Drogas 1', '', '2025-11-19 09:12:40', NULL, '2025-11-19 06:00:00', 'apto_con_restricciones', 'Problemas con pastillas medicas', 'Paracetamol', NULL, NULL, 'https://storage.googleapis.com/arco21.firebasestorage.app/pruebas-medicas/2aacf2b3-1e5c-4489-b9b4-12ad55191c2e.pdf', 'resultado_recibido', NULL, '2025-11-19 09:12:40', '2025-11-19 09:13:26', 70);
INSERT INTO `Pruebas_Medicas` (`id`, `id_candidato`, `id_postulacion`, `id_vacante`, `tipo_prueba`, `nombre_prueba`, `descripcion`, `fecha_solicitud`, `fecha_realizacion`, `fecha_resultado`, `resultado`, `observaciones`, `restricciones`, `medico_responsable`, `institucion_medica`, `documento_resultado_url`, `estado`, `valido_hasta`, `created_at`, `updated_at`, `porcentaje_aptitud`) VALUES (3, 10, 2, 2, 'laboratorio', 'Prueba de sangre', '', '2025-11-19 09:31:14', NULL, NULL, 'pendiente', NULL, NULL, NULL, NULL, NULL, 'pendiente', NULL, '2025-11-19 09:31:14', '2025-11-19 09:31:14', NULL);
INSERT INTO `Pruebas_Medicas` (`id`, `id_candidato`, `id_postulacion`, `id_vacante`, `tipo_prueba`, `nombre_prueba`, `descripcion`, `fecha_solicitud`, `fecha_realizacion`, `fecha_resultado`, `resultado`, `observaciones`, `restricciones`, `medico_responsable`, `institucion_medica`, `documento_resultado_url`, `estado`, `valido_hasta`, `created_at`, `updated_at`, `porcentaje_aptitud`) VALUES (4, 11, 3, 2, 'vista', 'Examen de vista general', 'Verificar que aun pueda estar frente a una computadora', '2025-11-19 12:06:58', NULL, '2025-11-19 06:00:00', 'apto', 'Todo bien', NULL, NULL, NULL, 'https://storage.googleapis.com/arco21.firebasestorage.app/pruebas-medicas/ba14dd28-0343-4241-8dcb-dd31518cd6e6.pdf', 'resultado_recibido', NULL, '2025-11-19 12:06:58', '2025-11-19 12:08:10', 90);
UNLOCK TABLES;

-- Table: Pruebas_Tecnicas
DROP TABLE IF EXISTS `Pruebas_Tecnicas`;
CREATE TABLE `Pruebas_Tecnicas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_candidato` int(11) NOT NULL,
  `id_vacante` int(11) DEFAULT NULL COMMENT 'Vacante asociada',
  `id_postulacion` int(11) DEFAULT NULL,
  `tipo_prueba` varchar(100) NOT NULL COMMENT 'codigo, excel, idiomas, proyecto, caso_practico, otro',
  `nombre_prueba` varchar(200) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `instrucciones` text DEFAULT NULL,
  `fecha_asignacion` datetime DEFAULT current_timestamp(),
  `fecha_limite` date DEFAULT NULL,
  `fecha_entrega` datetime DEFAULT NULL COMMENT 'Cuando el candidato entregó',
  `fecha_evaluacion` datetime DEFAULT NULL,
  `estado` varchar(50) DEFAULT 'asignada' COMMENT 'asignada, en_progreso, entregada, evaluada, rechazada',
  `resultado` varchar(50) DEFAULT NULL COMMENT 'aprobado, reprobado, pendiente',
  `puntaje` decimal(5,2) DEFAULT NULL COMMENT 'Calificación 0-100',
  `comentarios_evaluador` text DEFAULT NULL,
  `aspectos_positivos` text DEFAULT NULL,
  `aspectos_negativos` text DEFAULT NULL,
  `archivo_instrucciones_url` varchar(500) DEFAULT NULL COMMENT 'PDF con instrucciones detalladas',
  `archivo_respuesta_url` varchar(500) DEFAULT NULL COMMENT 'Archivo que subió el candidato',
  `evaluador_id` int(11) DEFAULT NULL COMMENT 'Usuario que evaluó',
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `archivo_evaluacion_url` varchar(500) DEFAULT NULL COMMENT 'PDF con la evaluación y resultados',
  PRIMARY KEY (`id`),
  KEY `id_postulacion` (`id_postulacion`),
  KEY `evaluador_id` (`evaluador_id`),
  KEY `idx_id_candidato` (`id_candidato`),
  KEY `idx_id_vacante` (`id_vacante`),
  KEY `idx_tipo_prueba` (`tipo_prueba`),
  KEY `idx_estado` (`estado`),
  KEY `idx_fecha_asignacion` (`fecha_asignacion`),
  KEY `pruebas__tecnicas_id_candidato` (`id_candidato`),
  KEY `pruebas__tecnicas_id_vacante` (`id_vacante`),
  KEY `pruebas__tecnicas_tipo_prueba` (`tipo_prueba`),
  KEY `pruebas__tecnicas_estado` (`estado`),
  KEY `pruebas__tecnicas_fecha_asignacion` (`fecha_asignacion`),
  CONSTRAINT `Pruebas_Tecnicas_ibfk_1` FOREIGN KEY (`id_candidato`) REFERENCES `Candidatos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Pruebas_Tecnicas_ibfk_2` FOREIGN KEY (`id_vacante`) REFERENCES `Vacantes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Pruebas_Tecnicas_ibfk_3` FOREIGN KEY (`id_postulacion`) REFERENCES `Postulaciones` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Pruebas_Tecnicas_ibfk_4` FOREIGN KEY (`evaluador_id`) REFERENCES `Usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Pruebas técnicas para evaluar conocimientos específicos: código, Excel, idiomas, proyectos';

-- Data for Pruebas_Tecnicas
LOCK TABLES `Pruebas_Tecnicas` WRITE;
INSERT INTO `Pruebas_Tecnicas` (`id`, `id_candidato`, `id_vacante`, `id_postulacion`, `tipo_prueba`, `nombre_prueba`, `descripcion`, `instrucciones`, `fecha_asignacion`, `fecha_limite`, `fecha_entrega`, `fecha_evaluacion`, `estado`, `resultado`, `puntaje`, `comentarios_evaluador`, `aspectos_positivos`, `aspectos_negativos`, `archivo_instrucciones_url`, `archivo_respuesta_url`, `evaluador_id`, `created_at`, `updated_at`, `archivo_evaluacion_url`) VALUES (1, 3, 2, 1, 'otro', 'Prueba de ingles', '', 'Verificar que hable y escriba con un minimo de 70%', '2025-11-19 09:14:26', '2025-11-20 06:00:00', NULL, NULL, 'asignada', 'pendiente', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-19 09:14:26', '2025-11-19 09:14:26', NULL);
INSERT INTO `Pruebas_Tecnicas` (`id`, `id_candidato`, `id_vacante`, `id_postulacion`, `tipo_prueba`, `nombre_prueba`, `descripcion`, `instrucciones`, `fecha_asignacion`, `fecha_limite`, `fecha_entrega`, `fecha_evaluacion`, `estado`, `resultado`, `puntaje`, `comentarios_evaluador`, `aspectos_positivos`, `aspectos_negativos`, `archivo_instrucciones_url`, `archivo_respuesta_url`, `evaluador_id`, `created_at`, `updated_at`, `archivo_evaluacion_url`) VALUES (2, 11, 2, 3, 'idiomas', 'Prueba de ingles', '', '', '2025-11-19 12:09:24', '2025-11-27 06:00:00', NULL, NULL, 'asignada', 'pendiente', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-19 12:09:24', '2025-11-19 12:09:24', NULL);
UNLOCK TABLES;

-- Table: Reportes
DROP TABLE IF EXISTS `Reportes`;
CREATE TABLE `Reportes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL COMMENT 'Usuario que generó el reporte',
  `tipo_reporte` varchar(100) NOT NULL COMMENT 'vacantes, postulaciones, pruebas, candidatos, entrevistas, contrataciones',
  `nombre` varchar(200) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `parametros` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Filtros y parámetros usados para generar el reporte' CHECK (json_valid(`parametros`)),
  `archivo_url` varchar(500) DEFAULT NULL COMMENT 'URL del archivo generado',
  `formato` varchar(20) DEFAULT NULL COMMENT 'pdf, excel, csv',
  `fecha_generacion` datetime DEFAULT current_timestamp(),
  `estado` varchar(20) DEFAULT 'completado' COMMENT 'pendiente, procesando, completado, error',
  `tiempo_generacion_segundos` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_id_usuario` (`id_usuario`),
  KEY `idx_tipo_reporte` (`tipo_reporte`),
  KEY `idx_fecha_generacion` (`fecha_generacion`),
  KEY `idx_estado` (`estado`),
  KEY `reportes_id_usuario` (`id_usuario`),
  KEY `reportes_tipo_reporte` (`tipo_reporte`),
  KEY `reportes_fecha_generacion` (`fecha_generacion`),
  KEY `reportes_estado` (`estado`),
  CONSTRAINT `Reportes_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `Usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Sistema de reportes y analytics del sistema';

-- Table: Respuestas_Candidato
DROP TABLE IF EXISTS `Respuestas_Candidato`;
CREATE TABLE `Respuestas_Candidato` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_asignacion` int(11) NOT NULL,
  `id_pregunta` int(11) NOT NULL,
  `id_opcion_seleccionada` int(11) DEFAULT NULL COMMENT 'NULL si es pregunta abierta',
  `respuesta_texto` text DEFAULT NULL COMMENT 'Para preguntas abiertas',
  `tiempo_respuesta_segundos` int(11) DEFAULT NULL,
  `fecha_respuesta` datetime DEFAULT current_timestamp(),
  `puntaje_obtenido` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `id_opcion_seleccionada` (`id_opcion_seleccionada`),
  KEY `idx_id_asignacion` (`id_asignacion`),
  KEY `idx_id_pregunta` (`id_pregunta`),
  KEY `respuestas__candidato_id_asignacion` (`id_asignacion`),
  KEY `respuestas__candidato_id_pregunta` (`id_pregunta`),
  CONSTRAINT `Respuestas_Candidato_ibfk_1` FOREIGN KEY (`id_asignacion`) REFERENCES `Asignaciones_Prueba` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Respuestas_Candidato_ibfk_2` FOREIGN KEY (`id_pregunta`) REFERENCES `Preguntas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Respuestas_Candidato_ibfk_3` FOREIGN KEY (`id_opcion_seleccionada`) REFERENCES `Opciones_Respuesta` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Almacena cada respuesta individual del candidato';

-- Data for Respuestas_Candidato
LOCK TABLES `Respuestas_Candidato` WRITE;
INSERT INTO `Respuestas_Candidato` (`id`, `id_asignacion`, `id_pregunta`, `id_opcion_seleccionada`, `respuesta_texto`, `tiempo_respuesta_segundos`, `fecha_respuesta`, `puntaje_obtenido`) VALUES (4, 2, 3, NULL, 'Maria Rodriguez', NULL, '2025-11-19 01:08:10', 0);
INSERT INTO `Respuestas_Candidato` (`id`, `id_asignacion`, `id_pregunta`, `id_opcion_seleccionada`, `respuesta_texto`, `tiempo_respuesta_segundos`, `fecha_respuesta`, `puntaje_obtenido`) VALUES (5, 2, 4, NULL, 'Ser mejor cada dia', NULL, '2025-11-19 01:08:21', 0);
INSERT INTO `Respuestas_Candidato` (`id`, `id_asignacion`, `id_pregunta`, `id_opcion_seleccionada`, `respuesta_texto`, `tiempo_respuesta_segundos`, `fecha_respuesta`, `puntaje_obtenido`) VALUES (6, 2, 5, 4, NULL, NULL, '2025-11-19 01:08:24', 0);
INSERT INTO `Respuestas_Candidato` (`id`, `id_asignacion`, `id_pregunta`, `id_opcion_seleccionada`, `respuesta_texto`, `tiempo_respuesta_segundos`, `fecha_respuesta`, `puntaje_obtenido`) VALUES (7, 2, 5, 3, NULL, NULL, '2025-11-19 01:08:25', 0);
INSERT INTO `Respuestas_Candidato` (`id`, `id_asignacion`, `id_pregunta`, `id_opcion_seleccionada`, `respuesta_texto`, `tiempo_respuesta_segundos`, `fecha_respuesta`, `puntaje_obtenido`) VALUES (8, 3, 3, NULL, 'Fernanda Lopez Acu', NULL, '2025-11-19 09:29:49', 0);
INSERT INTO `Respuestas_Candidato` (`id`, `id_asignacion`, `id_pregunta`, `id_opcion_seleccionada`, `respuesta_texto`, `tiempo_respuesta_segundos`, `fecha_respuesta`, `puntaje_obtenido`) VALUES (9, 3, 4, NULL, 'Ser un buen desarrollador', NULL, '2025-11-19 09:30:04', 0);
INSERT INTO `Respuestas_Candidato` (`id`, `id_asignacion`, `id_pregunta`, `id_opcion_seleccionada`, `respuesta_texto`, `tiempo_respuesta_segundos`, `fecha_respuesta`, `puntaje_obtenido`) VALUES (10, 3, 5, 5, NULL, NULL, '2025-11-19 09:30:08', 0);
INSERT INTO `Respuestas_Candidato` (`id`, `id_asignacion`, `id_pregunta`, `id_opcion_seleccionada`, `respuesta_texto`, `tiempo_respuesta_segundos`, `fecha_respuesta`, `puntaje_obtenido`) VALUES (11, 5, 3, NULL, 'Diego', NULL, '2025-11-19 12:03:55', 0);
INSERT INTO `Respuestas_Candidato` (`id`, `id_asignacion`, `id_pregunta`, `id_opcion_seleccionada`, `respuesta_texto`, `tiempo_respuesta_segundos`, `fecha_respuesta`, `puntaje_obtenido`) VALUES (12, 5, 4, NULL, 'Ser un buen desarrollador', NULL, '2025-11-19 12:04:07', 0);
INSERT INTO `Respuestas_Candidato` (`id`, `id_asignacion`, `id_pregunta`, `id_opcion_seleccionada`, `respuesta_texto`, `tiempo_respuesta_segundos`, `fecha_respuesta`, `puntaje_obtenido`) VALUES (13, 5, 5, 4, NULL, NULL, '2025-11-19 12:04:11', 0);
INSERT INTO `Respuestas_Candidato` (`id`, `id_asignacion`, `id_pregunta`, `id_opcion_seleccionada`, `respuesta_texto`, `tiempo_respuesta_segundos`, `fecha_respuesta`, `puntaje_obtenido`) VALUES (14, 5, 6, 6, NULL, NULL, '2025-11-19 12:04:15', 0);
UNLOCK TABLES;

-- Table: Resultados_Prueba
DROP TABLE IF EXISTS `Resultados_Prueba`;
CREATE TABLE `Resultados_Prueba` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_asignacion` int(11) NOT NULL COMMENT 'Relación 1:1',
  `id_candidato` int(11) NOT NULL,
  `id_prueba` int(11) NOT NULL,
  `fecha_resultado` datetime DEFAULT current_timestamp(),
  `puntaje_total` float NOT NULL,
  `puntaje_maximo` float NOT NULL,
  `porcentaje` decimal(5,2) DEFAULT NULL,
  `aprobado` tinyint(1) DEFAULT NULL,
  `tiempo_total_segundos` int(11) DEFAULT NULL,
  `respuestas_correctas` int(11) DEFAULT NULL,
  `respuestas_incorrectas` int(11) DEFAULT NULL,
  `preguntas_sin_responder` int(11) DEFAULT NULL,
  `comentarios` text DEFAULT NULL COMMENT 'Comentarios del evaluador',
  `analisis_detallado` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Análisis por categorías en formato JSON' CHECK (json_valid(`analisis_detallado`)),
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_asignacion` (`id_asignacion`),
  KEY `idx_id_candidato` (`id_candidato`),
  KEY `idx_id_prueba` (`id_prueba`),
  KEY `idx_fecha_resultado` (`fecha_resultado`),
  KEY `idx_aprobado` (`aprobado`),
  KEY `resultados__prueba_id_candidato` (`id_candidato`),
  KEY `resultados__prueba_id_prueba` (`id_prueba`),
  KEY `resultados__prueba_fecha_resultado` (`fecha_resultado`),
  KEY `resultados__prueba_aprobado` (`aprobado`),
  CONSTRAINT `Resultados_Prueba_ibfk_1` FOREIGN KEY (`id_asignacion`) REFERENCES `Asignaciones_Prueba` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Resultados_Prueba_ibfk_2` FOREIGN KEY (`id_candidato`) REFERENCES `Candidatos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Resultados_Prueba_ibfk_3` FOREIGN KEY (`id_prueba`) REFERENCES `Pruebas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Resumen calculado del resultado de cada prueba completada';

-- Data for Resultados_Prueba
LOCK TABLES `Resultados_Prueba` WRITE;
INSERT INTO `Resultados_Prueba` (`id`, `id_asignacion`, `id_candidato`, `id_prueba`, `fecha_resultado`, `puntaje_total`, `puntaje_maximo`, `porcentaje`, `aprobado`, `tiempo_total_segundos`, `respuestas_correctas`, `respuestas_incorrectas`, `preguntas_sin_responder`, `comentarios`, `analisis_detallado`, `created_at`) VALUES (1, 2, 3, 2, '2025-11-19 00:22:24', 0, 61, '0.00', 0, 105, 0, 2, -1, NULL, NULL, '2025-11-19 00:22:24');
INSERT INTO `Resultados_Prueba` (`id`, `id_asignacion`, `id_candidato`, `id_prueba`, `fecha_resultado`, `puntaje_total`, `puntaje_maximo`, `porcentaje`, `aprobado`, `tiempo_total_segundos`, `respuestas_correctas`, `respuestas_incorrectas`, `preguntas_sin_responder`, `comentarios`, `analisis_detallado`, `created_at`) VALUES (3, 3, 10, 2, '2025-11-19 09:30:11', 0, 61, '0.00', 0, 42, 0, 1, 0, NULL, NULL, '2025-11-19 09:30:11');
INSERT INTO `Resultados_Prueba` (`id`, `id_asignacion`, `id_candidato`, `id_prueba`, `fecha_resultado`, `puntaje_total`, `puntaje_maximo`, `porcentaje`, `aprobado`, `tiempo_total_segundos`, `respuestas_correctas`, `respuestas_incorrectas`, `preguntas_sin_responder`, `comentarios`, `analisis_detallado`, `created_at`) VALUES (4, 5, 11, 2, '2025-11-19 12:04:19', 0, 62, '0.00', 0, 36, 0, 2, 0, NULL, NULL, '2025-11-19 12:04:19');
UNLOCK TABLES;

-- Table: Roles
DROP TABLE IF EXISTS `Roles`;
CREATE TABLE `Roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL COMMENT 'administrador, empresa, candidato',
  `descripcion` text DEFAULT NULL,
  `permisos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Permisos específicos en formato JSON' CHECK (json_valid(`permisos`)),
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`),
  KEY `idx_nombre` (`nombre`),
  KEY `roles_nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Define los roles del sistema: Admin, Empresa, Candidato';

-- Data for Roles
LOCK TABLES `Roles` WRITE;
INSERT INTO `Roles` (`id`, `nombre`, `descripcion`, `permisos`, `created_at`, `updated_at`) VALUES (1, 'administrador', 'Acceso completo al sistema', '{"all": true}', '2025-10-26 10:57:50', '2025-10-26 10:57:50');
INSERT INTO `Roles` (`id`, `nombre`, `descripcion`, `permisos`, `created_at`, `updated_at`) VALUES (2, 'empresa', 'Puede publicar vacantes y gestionar candidatos', '{"vacantes": true, "candidatos": "read", "pruebas": true}', '2025-10-26 10:57:50', '2025-10-26 10:57:50');
INSERT INTO `Roles` (`id`, `nombre`, `descripcion`, `permisos`, `created_at`, `updated_at`) VALUES (3, 'candidato', 'Puede postularse a vacantes y realizar pruebas', '{"postulaciones": true, "pruebas": "assigned"}', '2025-10-26 10:57:50', '2025-10-26 10:57:50');
UNLOCK TABLES;

-- Table: Usuarios
DROP TABLE IF EXISTS `Usuarios`;
CREATE TABLE `Usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) NOT NULL,
  `email` varchar(255) NOT NULL,
  `contraseña` varchar(255) NOT NULL COMMENT 'Hash bcrypt o similar',
  `id_rol` int(11) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `avatar` varchar(500) DEFAULT NULL COMMENT 'URL de imagen de perfil',
  `fecha_registro` datetime DEFAULT current_timestamp(),
  `ultimo_acceso` datetime DEFAULT NULL,
  `estado` varchar(20) DEFAULT 'activo' COMMENT 'activo, suspendido, inactivo',
  `token_recuperacion` varchar(255) DEFAULT NULL COMMENT 'Token para recuperar contraseña',
  `token_expiracion` datetime DEFAULT NULL,
  `email_verificado` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_email` (`email`),
  KEY `idx_id_rol` (`id_rol`),
  KEY `idx_estado` (`estado`),
  KEY `usuarios_email` (`email`),
  KEY `usuarios_id_rol` (`id_rol`),
  KEY `usuarios_estado` (`estado`),
  CONSTRAINT `Usuarios_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `Roles` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tabla central de usuarios - Todos deben tener un rol';

-- Data for Usuarios
LOCK TABLES `Usuarios` WRITE;
INSERT INTO `Usuarios` (`id`, `nombre`, `email`, `contraseña`, `id_rol`, `telefono`, `avatar`, `fecha_registro`, `ultimo_acceso`, `estado`, `token_recuperacion`, `token_expiracion`, `email_verificado`, `created_at`, `updated_at`) VALUES (1, 'Admin Principal', 'admin@hrplatform.com', '$2b$10$RIp4/K0mBzg86HT99VknNuHxpVzFz8qrDE9gbNVFVwJCf4FUw0QBy', 1, '+52 55 1234 5678', NULL, '2025-10-26 11:38:01', '2025-11-19 12:15:52', 'activo', NULL, NULL, 0, '2025-10-26 11:38:01', '2025-11-19 12:15:52');
INSERT INTO `Usuarios` (`id`, `nombre`, `email`, `contraseña`, `id_rol`, `telefono`, `avatar`, `fecha_registro`, `ultimo_acceso`, `estado`, `token_recuperacion`, `token_expiracion`, `email_verificado`, `created_at`, `updated_at`) VALUES (2, 'Carlos Mendoza', 'rh@techcorp.com', '$2b$10$2fqgZffZIMH4RbpzP4ty.eogi/DuaGQdvjZA4xy0ZwxU/Xa4TplTm', 2, '+52 55 9876 5432', NULL, '2025-10-26 11:39:51', '2025-10-28 08:55:30', 'activo', NULL, NULL, 0, '2025-10-26 11:39:51', '2025-10-29 05:35:35');
INSERT INTO `Usuarios` (`id`, `nombre`, `email`, `contraseña`, `id_rol`, `telefono`, `avatar`, `fecha_registro`, `ultimo_acceso`, `estado`, `token_recuperacion`, `token_expiracion`, `email_verificado`, `created_at`, `updated_at`) VALUES (3, 'María García López', 'maria.garcia@email.com', '$2b$10$40jr5J51tIEx9PxcXZf18.tMSxX2RvyBVfopbHfg46rUGk1m7gmHa', 3, '+52 55 1111 2222', NULL, '2025-10-26 11:42:22', '2025-11-19 09:24:07', 'activo', NULL, NULL, 0, '2025-10-26 11:42:22', '2025-11-19 09:24:07');
INSERT INTO `Usuarios` (`id`, `nombre`, `email`, `contraseña`, `id_rol`, `telefono`, `avatar`, `fecha_registro`, `ultimo_acceso`, `estado`, `token_recuperacion`, `token_expiracion`, `email_verificado`, `created_at`, `updated_at`) VALUES (4, 'Juan Pérez Hernández', 'juan.perez@email.com', '$2b$10$7JPgAJcC7AT04eFAKhWH..VUlu.KqJpfx1xgMv6cnJdEjQBCzUsfq', 3, '+52 55 3333 4444', NULL, '2025-10-26 11:42:55', NULL, 'activo', NULL, NULL, 0, '2025-10-26 11:42:55', '2025-10-26 11:42:55');
INSERT INTO `Usuarios` (`id`, `nombre`, `email`, `contraseña`, `id_rol`, `telefono`, `avatar`, `fecha_registro`, `ultimo_acceso`, `estado`, `token_recuperacion`, `token_expiracion`, `email_verificado`, `created_at`, `updated_at`) VALUES (5, 'Juan carlos', 'rh1@techcorp.com', '$2b$10$MA.i5nkmMPuQyEQ2fODK2uCeLF3ltPmC8BSQO/wczISjWWuYHSXTi', 2, '+52 55 9876 5432', NULL, '2025-10-27 09:42:39', NULL, 'activo', NULL, NULL, 0, '2025-10-27 09:42:39', '2025-10-29 05:35:35');
INSERT INTO `Usuarios` (`id`, `nombre`, `email`, `contraseña`, `id_rol`, `telefono`, `avatar`, `fecha_registro`, `ultimo_acceso`, `estado`, `token_recuperacion`, `token_expiracion`, `email_verificado`, `created_at`, `updated_at`) VALUES (6, 'JUlio elias', 'rh2@techcorp.com', '$2b$10$878/sqbyF.3jxalZNSz14uAXG355s16o6sDadjAmuGqf6lkR5QK/2', 2, '+52 55 9876 5432', NULL, '2025-10-27 09:43:27', NULL, 'activo', NULL, NULL, 0, '2025-10-27 09:43:27', '2025-10-29 05:35:35');
INSERT INTO `Usuarios` (`id`, `nombre`, `email`, `contraseña`, `id_rol`, `telefono`, `avatar`, `fecha_registro`, `ultimo_acceso`, `estado`, `token_recuperacion`, `token_expiracion`, `email_verificado`, `created_at`, `updated_at`) VALUES (7, 'Admin Principal 2', 'admin1@hrplatform.com', '$2b$10$dTou0sbrDVHfkhKHsuYwwel1Kt6OA2D.1qMbEACl6kZqMTjs880z2', 1, '+52 55 1234 5678', NULL, '2025-10-27 09:43:50', NULL, 'activo', NULL, NULL, 0, '2025-10-27 09:43:50', '2025-10-29 05:35:16');
INSERT INTO `Usuarios` (`id`, `nombre`, `email`, `contraseña`, `id_rol`, `telefono`, `avatar`, `fecha_registro`, `ultimo_acceso`, `estado`, `token_recuperacion`, `token_expiracion`, `email_verificado`, `created_at`, `updated_at`) VALUES (8, 'Carlos Eliseo', 'rh4@techcorp.com', '$2b$10$FN1s0aft.h2xLdxGGKzpCOMx5JOHjsQdEVUjkge3pDiI5vpY58rmW', 2, '+52 55 9876 5432', NULL, '2025-10-27 09:45:29', '2025-11-19 12:04:42', 'activo', NULL, NULL, 0, '2025-10-27 09:45:29', '2025-11-19 12:04:42');
INSERT INTO `Usuarios` (`id`, `nombre`, `email`, `contraseña`, `id_rol`, `telefono`, `avatar`, `fecha_registro`, `ultimo_acceso`, `estado`, `token_recuperacion`, `token_expiracion`, `email_verificado`, `created_at`, `updated_at`) VALUES (9, 'Carlos martinez', 'lufi@gmail.com', '$2b$10$F8Dl2kVgIIcemVIhVr/.rOzHGxBNcsuyYiJv1Dy4/O6LkFibAr/26', 3, '5555-1234', NULL, '2025-11-10 20:56:47', NULL, 'activo', NULL, NULL, 0, '2025-11-10 20:56:47', '2025-11-10 20:56:47');
INSERT INTO `Usuarios` (`id`, `nombre`, `email`, `contraseña`, `id_rol`, `telefono`, `avatar`, `fecha_registro`, `ultimo_acceso`, `estado`, `token_recuperacion`, `token_expiracion`, `email_verificado`, `created_at`, `updated_at`) VALUES (10, 'Carlos Alfredo Lopez Perez', 'carlos.alfredo@email.com', '$2b$10$anyDN2N8Zt1.d/ojnSa3lePj4v2wL9XYNUI/.d3kDS5z9ZetHyLaa', 3, NULL, NULL, '2025-11-19 04:02:48', NULL, 'activo', NULL, NULL, 0, '2025-11-19 04:02:48', '2025-11-19 04:02:48');
INSERT INTO `Usuarios` (`id`, `nombre`, `email`, `contraseña`, `id_rol`, `telefono`, `avatar`, `fecha_registro`, `ultimo_acceso`, `estado`, `token_recuperacion`, `token_expiracion`, `email_verificado`, `created_at`, `updated_at`) VALUES (11, 'Fernanda Lopez Acu', 'fernanda.lopez@email.com', '$2b$10$37XHWF6swFxYxK87xeDiD.ViWTVB0aT39EWCy0qQq1seedMTOfy/q', 3, '5555-1234', NULL, '2025-11-19 09:18:18', '2025-11-19 09:26:44', 'activo', NULL, NULL, 0, '2025-11-19 09:18:18', '2025-11-19 09:26:44');
INSERT INTO `Usuarios` (`id`, `nombre`, `email`, `contraseña`, `id_rol`, `telefono`, `avatar`, `fecha_registro`, `ultimo_acceso`, `estado`, `token_recuperacion`, `token_expiracion`, `email_verificado`, `created_at`, `updated_at`) VALUES (12, 'Diego Julián Barrios', 'julianbarrios12282004@gmail.com', '$2b$10$3PR8.AB0YGAeTZ4V3gSoq.ocgwVeGdzPdY5XV4GnVPzOIkE92A7ri', 3, '1234-1092', NULL, '2025-11-19 11:51:24', '2025-11-19 12:03:28', 'activo', NULL, NULL, 0, '2025-11-19 11:51:24', '2025-11-19 12:03:28');
UNLOCK TABLES;

-- Table: Vacantes
DROP TABLE IF EXISTS `Vacantes`;
CREATE TABLE `Vacantes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_empresa` int(11) NOT NULL,
  `titulo` varchar(200) NOT NULL,
  `descripcion` text NOT NULL,
  `requisitos` text DEFAULT NULL,
  `responsabilidades` text DEFAULT NULL,
  `beneficios` text DEFAULT NULL,
  `salario_minimo` decimal(10,2) DEFAULT NULL,
  `salario_maximo` decimal(10,2) DEFAULT NULL,
  `mostrar_salario` tinyint(1) DEFAULT 0,
  `tipo_contrato` varchar(50) DEFAULT NULL COMMENT 'indefinido, temporal, freelance, practicas',
  `jornada` varchar(50) DEFAULT NULL COMMENT 'tiempo_completo, medio_tiempo, por_proyecto',
  `modalidad` varchar(50) DEFAULT NULL COMMENT 'presencial, remoto, hibrido',
  `ubicacion` varchar(255) DEFAULT NULL,
  `pais` varchar(100) DEFAULT NULL,
  `ciudad` varchar(100) DEFAULT NULL,
  `años_experiencia_min` int(11) DEFAULT NULL,
  `nivel_educacion` varchar(50) DEFAULT NULL,
  `vacantes_disponibles` int(11) DEFAULT 1,
  `fecha_publicacion` datetime DEFAULT current_timestamp(),
  `fecha_cierre` date DEFAULT NULL,
  `estado` varchar(20) DEFAULT 'activa' COMMENT 'activa, pausada, cerrada, cancelada',
  `vistas` int(11) DEFAULT 0 COMMENT 'Contador de vistas',
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_id_empresa` (`id_empresa`),
  KEY `idx_estado` (`estado`),
  KEY `idx_fecha_publicacion` (`fecha_publicacion`),
  KEY `idx_pais` (`pais`),
  KEY `idx_modalidad` (`modalidad`),
  KEY `vacantes_id_empresa` (`id_empresa`),
  KEY `vacantes_estado` (`estado`),
  KEY `vacantes_fecha_publicacion` (`fecha_publicacion`),
  KEY `vacantes_pais` (`pais`),
  KEY `vacantes_modalidad` (`modalidad`),
  CONSTRAINT `Vacantes_ibfk_1` FOREIGN KEY (`id_empresa`) REFERENCES `Empresas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Vacantes publicadas por las empresas';

-- Data for Vacantes
LOCK TABLES `Vacantes` WRITE;
INSERT INTO `Vacantes` (`id`, `id_empresa`, `titulo`, `descripcion`, `requisitos`, `responsabilidades`, `beneficios`, `salario_minimo`, `salario_maximo`, `mostrar_salario`, `tipo_contrato`, `jornada`, `modalidad`, `ubicacion`, `pais`, `ciudad`, `años_experiencia_min`, `nivel_educacion`, `vacantes_disponibles`, `fecha_publicacion`, `fecha_cierre`, `estado`, `vistas`, `created_at`, `updated_at`) VALUES (1, 1, 'Desarrollador Full Stack Senior', 'Buscamos desarrollador con experiencia en tecnologías web modernas', 'Mínimo 3 años de experiencia en React y Node.js, conocimientos de bases de datos SQL', 'Desarrollar nuevas features, mantener código existente, code reviews, mentoría a junior developers', 'Seguro de gastos médicos, vales de despensa, home office flexible, capacitaciones', NULL, NULL, 0, NULL, NULL, 'hibrido', 'Ciudad de México', NULL, NULL, NULL, NULL, 1, '2025-10-27 09:55:10', '2025-12-31 06:00:00', 'activa', 1, '2025-10-27 09:55:10', '2025-10-29 00:11:08');
INSERT INTO `Vacantes` (`id`, `id_empresa`, `titulo`, `descripcion`, `requisitos`, `responsabilidades`, `beneficios`, `salario_minimo`, `salario_maximo`, `mostrar_salario`, `tipo_contrato`, `jornada`, `modalidad`, `ubicacion`, `pais`, `ciudad`, `años_experiencia_min`, `nivel_educacion`, `vacantes_disponibles`, `fecha_publicacion`, `fecha_cierre`, `estado`, `vistas`, `created_at`, `updated_at`) VALUES (2, 1, 'Desarrolador Python', 'Buscamos a persona con ganas de chambear', 'Minimos', 'pocas', 'NInguno', NULL, NULL, 0, 'temporal', NULL, 'hibrido', 'Xela', NULL, NULL, NULL, NULL, 2, '2025-10-29 00:06:27', '2025-11-30 06:00:00', 'activa', 13, '2025-10-29 00:06:27', '2025-11-19 11:53:54');
UNLOCK TABLES;

-- Table: Verificacion_Documentos
DROP TABLE IF EXISTS `Verificacion_Documentos`;
CREATE TABLE `Verificacion_Documentos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_candidato` int(11) NOT NULL,
  `id_postulacion` int(11) DEFAULT NULL COMMENT 'Postulación asociada',
  `tipo_documento` varchar(100) NOT NULL COMMENT 'titulo, certificado, antecedentes, carta_recomendacion, identificacion, comprobante_domicilio, otro',
  `nombre_documento` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `es_obligatorio` tinyint(1) DEFAULT 0,
  `archivo_url` varchar(500) DEFAULT NULL COMMENT 'URL del documento subido',
  `fecha_subida` datetime DEFAULT NULL,
  `estado_verificacion` varchar(50) DEFAULT 'pendiente' COMMENT 'pendiente, en_revision, verificado, rechazado, no_aplica',
  `fecha_verificacion` datetime DEFAULT NULL,
  `verificado_por` int(11) DEFAULT NULL COMMENT 'Usuario que verificó el documento',
  `motivo_rechazo` text DEFAULT NULL COMMENT 'Si fue rechazado, explicar por qué',
  `observaciones` text DEFAULT NULL,
  `fecha_emision` date DEFAULT NULL,
  `fecha_vencimiento` date DEFAULT NULL COMMENT 'Si el documento tiene vigencia',
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `verificado_por` (`verificado_por`),
  KEY `idx_id_candidato` (`id_candidato`),
  KEY `idx_id_postulacion` (`id_postulacion`),
  KEY `idx_tipo_documento` (`tipo_documento`),
  KEY `idx_estado_verificacion` (`estado_verificacion`),
  KEY `idx_es_obligatorio` (`es_obligatorio`),
  KEY `verificacion__documentos_id_candidato` (`id_candidato`),
  KEY `verificacion__documentos_id_postulacion` (`id_postulacion`),
  KEY `verificacion__documentos_tipo_documento` (`tipo_documento`),
  KEY `verificacion__documentos_estado_verificacion` (`estado_verificacion`),
  KEY `verificacion__documentos_es_obligatorio` (`es_obligatorio`),
  CONSTRAINT `Verificacion_Documentos_ibfk_1` FOREIGN KEY (`id_candidato`) REFERENCES `Candidatos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Verificacion_Documentos_ibfk_2` FOREIGN KEY (`id_postulacion`) REFERENCES `Postulaciones` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Verificacion_Documentos_ibfk_3` FOREIGN KEY (`verificado_por`) REFERENCES `Usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Checklist de documentos del candidato: títulos, certificaciones, antecedentes, identificación';

SET FOREIGN_KEY_CHECKS = 1;
