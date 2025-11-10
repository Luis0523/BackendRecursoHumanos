-- ============================================================
-- INSERTAR USUARIOS DE PRUEBA
-- Base de Datos: gestion_talento_humano
-- ============================================================

USE gestion_talento_humano;

-- ============================================================
-- 1. ASEGURAR QUE EXISTEN LOS ROLES
-- ============================================================
INSERT INTO Roles (id, nombre, descripcion, permisos) VALUES
(1, 'administrador', 'Administrador del sistema con todos los permisos', '{"all": true}'),
(2, 'empresa', 'Empresa reclutadora que publica vacantes', '{"vacantes": true, "postulaciones": true}'),
(3, 'candidato', 'Candidato que se postula a empleos', '{"postulaciones": true, "perfil": true}')
ON DUPLICATE KEY UPDATE nombre=nombre;

-- ============================================================
-- 2. INSERTAR USUARIO ADMINISTRADOR
-- ============================================================
-- Email: admin@hrplatform.com
-- Contraseña: Admin123!
INSERT INTO Usuarios (nombre, email, contraseña, id_rol, telefono, estado, email_verificado, fecha_registro) 
VALUES (
    'Admin Principal',
    'admin@hrplatform.com',
    '$2b$10$PDq2K0rbyWzZ.37MFgJB7.ISHxdZN3GT3urEB0Swq.s3WqrHWeWoa',
    1,
    '+52 55 1234 5678',
    'activo',
    TRUE,
    NOW()
);

-- ============================================================
-- 3. INSERTAR USUARIO CANDIDATO (Usuario Normal)
-- ============================================================
-- Email: usuario@test.com
-- Contraseña: Usuario123!
INSERT INTO Usuarios (nombre, email, contraseña, id_rol, telefono, estado, email_verificado, fecha_registro) 
VALUES (
    'Usuario Test',
    'usuario@test.com',
    '$2b$10$85W.wILp/xUkrCSMS7hq6O86Soz8ccRQi8EN8R9rNYzFYaD4PoYiy',
    3,
    '+52 55 9876 5432',
    'activo',
    TRUE,
    NOW()
);

-- ============================================================
-- 4. CREAR PERFIL DE CANDIDATO PARA EL USUARIO NORMAL
-- ============================================================
INSERT INTO Candidatos (id_usuario, disponibilidad, created_at) 
VALUES (
    (SELECT id FROM Usuarios WHERE email = 'usuario@test.com'),
    'inmediata',
    NOW()
);

-- ============================================================
-- VERIFICAR INSERCIONES
-- ============================================================
SELECT 
    u.id,
    u.nombre,
    u.email,
    r.nombre as rol,
    u.telefono,
    u.estado,
    u.email_verificado,
    u.fecha_registro
FROM Usuarios u
INNER JOIN Roles r ON u.id_rol = r.id
WHERE u.email IN ('admin@hrplatform.com', 'usuario@test.com');

-- ============================================================
-- CREDENCIALES DE ACCESO
-- ============================================================
-- 
-- ADMINISTRADOR:
--   Email: admin@hrplatform.com
--   Contraseña: Admin123!
--
-- CANDIDATO (Usuario Normal):
--   Email: usuario@test.com
--   Contraseña: Usuario123!
--
-- ============================================================
