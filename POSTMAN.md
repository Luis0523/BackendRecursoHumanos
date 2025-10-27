# 🧪 DATOS DE PRUEBA - GUÍA POSTMAN

Esta guía te ayudará a poblar la base de datos con datos de prueba usando Postman.

**IMPORTANTE:** Sigue el orden indicado para que las relaciones entre tablas funcionen correctamente.

---

## 📋 CONFIGURACIÓN INICIAL EN POSTMAN

1. Crea una nueva colección llamada "HR Platform API"
2. Configura las variables de entorno:
   - `base_url`: `http://localhost:5000/api`
   - `token_admin`: (se llenará después del login)
   - `token_empresa`: (se llenará después del login)
   - `token_candidato`: (se llenará después del login)

---

## 🔢 ORDEN DE CREACIÓN DE DATOS

### FASE 1: Autenticación Base
1. Registrar usuarios (admin, empresa, candidato)
2. Hacer login y guardar tokens

### FASE 2: Perfiles
3. Crear perfil de empresa
4. Crear perfil de candidato

### FASE 3: Proceso de Reclutamiento
5. Crear vacantes
6. Crear postulaciones
7. Crear pruebas psicométricas
8. Asignar pruebas
9. Crear entrevistas
10. Crear eventos
11. Crear documentos

### FASE 4: Evaluaciones y Admin
12. Crear evaluaciones post-contratación
13. Generar reportes

---

## 🚀 PASO 1: REGISTRAR USUARIOS

### 1.1 Registrar Usuario Administrador

**Método:** `POST`
**URL:** `{{base_url}}/auth/registro`
**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "nombre": "Admin Principal",
  "email": "admin@hrplatform.com",
  "contraseña": "Admin123!",
  "telefono": "+52 55 1234 5678",
  "id_rol": 1
}
```

### 1.2 Registrar Usuario Empresa

**Método:** `POST`
**URL:** `{{base_url}}/auth/registro`
**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "nombre": "Carlos Mendoza",
  "email": "rh@techcorp.com",
  "contraseña": "Empresa123!",
  "telefono": "+52 55 9876 5432",
  "id_rol": 2
}
```

### 1.3 Registrar Usuario Candidato 1

**Método:** `POST`
**URL:** `{{base_url}}/auth/registro`
**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "nombre": "María García López",
  "email": "maria.garcia@email.com",
  "contraseña": "Maria123!",
  "telefono": "+52 55 1111 2222",
  "id_rol": 3
}
```

### 1.4 Registrar Usuario Candidato 2

**Método:** `POST`
**URL:** `{{base_url}}/auth/registro`
**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "nombre": "Juan Pérez Hernández",
  "email": "juan.perez@email.com",
  "contraseña": "Juan123!",
  "telefono": "+52 55 3333 4444",
  "id_rol": 3
}
```

---

## 🔐 PASO 2: HACER LOGIN Y GUARDAR TOKENS

### 2.1 Login como Admin

**Método:** `POST`
**URL:** `{{base_url}}/auth/login`
**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "admin@hrplatform.com",
  "contraseña": "Admin123!"
}
```

**Acción:** Copia el `token` de la respuesta y guárdalo en la variable `token_admin`

### 2.2 Login como Empresa

**Método:** `POST`
**URL:** `{{base_url}}/auth/login`
**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "rh@techcorp.com",
  "contraseña": "Empresa123!"
}
```

**Acción:** Copia el `token` de la respuesta y guárdalo en la variable `token_empresa`

### 2.3 Login como Candidato

**Método:** `POST`
**URL:** `{{base_url}}/auth/login`
**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "maria.garcia@email.com",
  "contraseña": "Maria123!"
}
```

**Acción:** Copia el `token` de la respuesta y guárdalo en la variable `token_candidato`

---

## 🏢 PASO 3: CREAR PERFIL DE EMPRESA

**Método:** `PUT`
**URL:** `{{base_url}}/empresas`
**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token_empresa}}
```

**Body (JSON):**
```json
{
  "nombre_empresa": "TechCorp Solutions",
  "descripcion": "Empresa líder en desarrollo de software y soluciones tecnológicas empresariales",
  "sector": "tecnologia",
  "tamaño": "mediana",
  "sitio_web": "https://www.techcorp.com",
  "pais": "México",
  "estado": "Ciudad de México",
  "ciudad": "Ciudad de México",
  "direccion": "Av. Reforma 250, Cuauhtémoc",
  "codigo_postal": "06600",
  "telefono_contacto": "+52 55 9876 5432",
  "email_contacto": "contacto@techcorp.com"
}
```

---

## 👤 PASO 4: CREAR PERFIL DE CANDIDATO

### 4.1 Perfil de María García

**Método:** `PUT`
**URL:** `{{base_url}}/candidatos`
**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token_candidato}}
```

**Body (JSON):**
```json
{
  "fecha_nacimiento": "1995-03-15",
  "genero": "femenino",
  "pais": "México",
  "estado": "Ciudad de México",
  "ciudad": "Ciudad de México",
  "direccion": "Calle Insurgentes 123, Col. Roma",
  "codigo_postal": "06700",
  "nivel_educacion": "licenciatura",
  "area_estudio": "Ingeniería en Sistemas Computacionales",
  "institucion_educativa": "Universidad Nacional Autónoma de México",
  "años_experiencia": 3,
  "puesto_actual": "Desarrolladora Full Stack",
  "industria_experiencia": "tecnologia",
  "habilidades": "JavaScript, React, Node.js, MySQL, Git, Docker",
  "certificaciones": "AWS Certified Developer, Scrum Master",
  "idiomas": "Español (nativo), Inglés (avanzado)",
  "disponibilidad": "inmediata",
  "expectativa_salarial_min": 35000,
  "expectativa_salarial_max": 50000,
  "linkedin": "https://linkedin.com/in/mariagarcia",
  "github": "https://github.com/mariagarcia"
}
```

---

## 📢 PASO 5: CREAR VACANTES

### 5.1 Vacante: Desarrollador Full Stack

**Método:** `POST`
**URL:** `{{base_url}}/vacantes`
**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token_empresa}}
```

**Body (JSON):**
```json
{
  "titulo": "Desarrollador Full Stack Senior",
  "descripcion": "Buscamos desarrollador con experiencia en tecnologías web modernas",
  "requisitos": "Mínimo 3 años de experiencia en React y Node.js, conocimientos de bases de datos SQL",
  "responsabilidades": "Desarrollar nuevas features, mantener código existente, code reviews, mentoría a junior developers",
  "habilidades_requeridas": "React, Node.js, MySQL, Git, Docker",
  "nivel_educacion_minimo": "licenciatura",
  "años_experiencia_minimos": 3,
  "tipo_empleo": "tiempo_completo",
  "modalidad": "hibrido",
  "ubicacion": "Ciudad de México",
  "salario_min": 40000,
  "salario_max": 60000,
  "moneda": "MXN",
  "beneficios": "Seguro de gastos médicos, vales de despensa, home office flexible, capacitaciones",
  "horario": "Lunes a Viernes 9:00 - 18:00",
  "numero_vacantes": 2,
  "fecha_cierre": "2025-12-31",
  "estado": "activa"
}
```

### 5.2 Vacante: Diseñador UX/UI

**Método:** `POST`
**URL:** `{{base_url}}/vacantes`
**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token_empresa}}
```

**Body (JSON):**
```json
{
  "titulo": "Diseñador UX/UI",
  "descripcion": "Diseñador creativo con pasión por crear experiencias de usuario excepcionales",
  "requisitos": "2+ años de experiencia en diseño UX/UI, portfolio requerido",
  "responsabilidades": "Diseño de interfaces, wireframes, prototipos, research de usuarios",
  "habilidades_requeridas": "Figma, Adobe XD, Sketch, HTML/CSS básico",
  "nivel_educacion_minimo": "licenciatura",
  "años_experiencia_minimos": 2,
  "tipo_empleo": "tiempo_completo",
  "modalidad": "remoto",
  "ubicacion": "Remoto - México",
  "salario_min": 30000,
  "salario_max": 45000,
  "moneda": "MXN",
  "beneficios": "100% remoto, horario flexible, días de vacaciones adicionales",
  "horario": "Flexible",
  "numero_vacantes": 1,
  "fecha_cierre": "2025-11-30",
  "estado": "activa"
}
```

**NOTA:** Guarda los IDs de las vacantes que se crean (aparecen en la respuesta)

---

## 📝 PASO 6: CREAR POSTULACIONES

### 6.1 María se postula a Desarrollador Full Stack

**Método:** `POST`
**URL:** `{{base_url}}/vacantes/postularse`
**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token_candidato}}
```

**Body (JSON):**
```json
{
  "id_vacante": 1,
  "carta_presentacion": "Estimado equipo de TechCorp, me interesa mucho esta posición. Cuento con 3 años de experiencia desarrollando aplicaciones web con React y Node.js. He trabajado en proyectos escalables y tengo experiencia en metodologías ágiles. Me gustaría aportar mi experiencia a su equipo."
}
```

### 6.2 Postulación anónima (sin login)

**Método:** `POST`
**URL:** `{{base_url}}/vacantes/postularse`
**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "id_vacante": 2,
  "nombre_completo": "Pedro Sánchez Rivera",
  "email": "pedro.sanchez@email.com",
  "telefono": "+52 55 5555 6666",
  "carta_presentacion": "Me interesa la posición de Diseñador UX/UI. Adjunto mi portfolio.",
  "cv_url": "https://drive.google.com/portfolio-pedro"
}
```

---

## 🧠 PASO 7: CREAR PRUEBA PSICOMÉTRICA

### 7.1 Crear la prueba

**Método:** `POST`
**URL:** `{{base_url}}/pruebas-psicometricas`
**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token_empresa}}
```

**Body (JSON):**
```json
{
  "nombre": "Test de Razonamiento Lógico",
  "descripcion": "Evaluación de capacidad de análisis y razonamiento lógico",
  "tipo": "razonamiento_logico",
  "categoria": "aptitud",
  "duracion_minutos": 30,
  "instrucciones": "Responde las siguientes preguntas. Tienes 30 minutos para completar la prueba.",
  "puntaje_minimo_aprobacion": 70,
  "es_publica": true
}
```

**NOTA:** Guarda el ID de la prueba creada

### 7.2 Crear otra prueba psicométrica

**Método:** `POST`
**URL:** `{{base_url}}/pruebas-psicometricas`
**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token_empresa}}
```

**Body (JSON):**
```json
{
  "nombre": "Test de Personalidad DISC",
  "descripcion": "Evaluación de perfil de personalidad y estilo de trabajo",
  "tipo": "personalidad",
  "categoria": "personalidad",
  "duracion_minutos": 20,
  "instrucciones": "Selecciona la opción que mejor describa tu comportamiento en situaciones laborales.",
  "puntaje_minimo_aprobacion": 60,
  "es_publica": true
}
```

---

## 📊 PASO 8: ASIGNAR PRUEBA A CANDIDATO

**Método:** `POST`
**URL:** `{{base_url}}/pruebas-psicometricas/asignar`
**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token_empresa}}
```

**Body (JSON):**
```json
{
  "id_candidato": 1,
  "id_prueba": 1,
  "id_vacante": 1,
  "fecha_limite": "2025-11-15",
  "intentos_permitidos": 2
}
```

---

## 🎯 PASO 9: CREAR PRUEBA TÉCNICA

**Método:** `POST`
**URL:** `{{base_url}}/pruebas-tecnicas`
**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token_empresa}}
```

**Body (JSON):**
```json
{
  "id_candidato": 1,
  "id_vacante": 1,
  "titulo": "Desarrollo de API REST",
  "descripcion": "Desarrollar una API REST con Node.js y Express que gestione usuarios",
  "tipo": "proyecto",
  "instrucciones": "1. Crear endpoints CRUD para usuarios\n2. Implementar autenticación JWT\n3. Documentar con Swagger\n4. Subir a GitHub",
  "criterios_evaluacion": "Código limpio, buenas prácticas, documentación, tests",
  "duracion_horas": 48,
  "fecha_asignacion": "2025-10-26",
  "fecha_limite": "2025-10-28"
}
```

---

## 🏥 PASO 10: CREAR PRUEBA MÉDICA

**Método:** `POST`
**URL:** `{{base_url}}/pruebas-medicas`
**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token_empresa}}
```

**Body (JSON):**
```json
{
  "id_candidato": 1,
  "id_vacante": 1,
  "tipo_examen": "general",
  "nombre_examen": "Examen Médico Pre-empleo",
  "descripcion": "Examen médico completo incluyendo análisis de sangre y revisión general",
  "institucion_medica": "Clínica Santa María",
  "direccion_cita": "Av. Juárez 456, Col. Centro",
  "fecha_programada": "2025-11-01T10:00:00",
  "instrucciones": "Presentarse en ayunas. Traer identificación oficial."
}
```

---

## 💼 PASO 11: CREAR ENTREVISTA

**Método:** `POST`
**URL:** `{{base_url}}/entrevistas`
**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token_empresa}}
```

**Body (JSON):**
```json
{
  "id_candidato": 1,
  "id_vacante": 1,
  "tipo": "videoconferencia",
  "fecha": "2025-10-30T15:00:00",
  "duracion_minutos": 60,
  "ubicacion": "Google Meet",
  "entrevistador": "Carlos Mendoza - Director de TI",
  "notas_preparacion": "Revisar portfolio y proyectos en GitHub",
  "link_videoconferencia": "https://meet.google.com/abc-defg-hij"
}
```

---

## 📅 PASO 12: CREAR EVENTOS

### 12.1 Evento: Firma de Contrato

**Método:** `POST`
**URL:** `{{base_url}}/eventos`
**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token_empresa}}
```

**Body (JSON):**
```json
{
  "id_candidato": 1,
  "id_vacante": 1,
  "tipo": "firma_contrato",
  "titulo": "Firma de Contrato - María García",
  "descripcion": "Firma de contrato laboral y entrega de documentación",
  "fecha_inicio": "2025-11-05T10:00:00",
  "fecha_fin": "2025-11-05T11:00:00",
  "ubicacion": "Oficinas TechCorp - Sala de Juntas",
  "participantes": "María García, Carlos Mendoza (RH), Juan López (Legal)",
  "estado": "programado"
}
```

### 12.2 Evento: Inducción

**Método:** `POST`
**URL:** `{{base_url}}/eventos`
**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token_empresa}}
```

**Body (JSON):**
```json
{
  "id_candidato": 1,
  "tipo": "induccion",
  "titulo": "Inducción - Nuevos Empleados Noviembre",
  "descripcion": "Programa de inducción para nuevos colaboradores",
  "fecha_inicio": "2025-11-06T09:00:00",
  "fecha_fin": "2025-11-06T14:00:00",
  "ubicacion": "Oficinas TechCorp - Auditorio",
  "participantes": "Nuevos empleados, Equipo de RH",
  "notas": "Traer identificación oficial y documentos solicitados",
  "estado": "programado"
}
```

---

## 📄 PASO 13: CREAR DOCUMENTOS

**Método:** `POST`
**URL:** `{{base_url}}/documentos`
**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token_candidato}}
```

**Body (JSON):**
```json
{
  "id_vacante": 1,
  "tipo_documento": "cv",
  "nombre_documento": "CV - María García López",
  "descripcion": "Curriculum Vitae actualizado",
  "url_documento": "https://drive.google.com/cv-maria-garcia.pdf",
  "tamaño_kb": 250,
  "formato": "pdf"
}
```

---

## 📊 PASO 14: CREAR EVALUACIÓN POST-CONTRATACIÓN

**Método:** `POST`
**URL:** `{{base_url}}/evaluaciones`
**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token_empresa}}
```

**Body (JSON):**
```json
{
  "id_candidato": 1,
  "id_vacante": 1,
  "id_postulacion": 1,
  "fecha_inicio_laboral": "2025-11-06",
  "fecha_fin_periodo_prueba": "2026-02-06",
  "puesto": "Desarrollador Full Stack Senior",
  "departamento": "Tecnología",
  "salario_acordado": 45000
}
```

---

## 🔄 PASO 15: ACTUALIZAR ESTADO DE POSTULACIÓN

**Método:** `PUT`
**URL:** `{{base_url}}/vacantes/postulaciones/1`
**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token_empresa}}
```

**Body (JSON):**
```json
{
  "estado": "preseleccionado",
  "notas_empresa": "Candidata muy prometedora, cumple con todos los requisitos técnicos"
}
```

---

## 📈 PASO 16: GENERAR REPORTES (Admin)

### 16.1 Reporte de Vacantes

**Método:** `POST`
**URL:** `{{base_url}}/admin/reportes`
**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token_admin}}
```

**Body (JSON):**
```json
{
  "nombre": "Reporte Mensual de Vacantes - Octubre 2025",
  "descripcion": "Análisis de vacantes publicadas y postulaciones recibidas",
  "tipo_reporte": "vacantes",
  "parametros": {
    "fecha_inicio": "2025-10-01",
    "fecha_fin": "2025-10-31"
  },
  "formato_salida": "json"
}
```

### 16.2 Reporte de Postulaciones

**Método:** `POST`
**URL:** `{{base_url}}/admin/reportes`
**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token_admin}}
```

**Body (JSON):**
```json
{
  "nombre": "Reporte de Postulaciones - Octubre 2025",
  "descripcion": "Estado de todas las postulaciones recibidas",
  "tipo_reporte": "postulaciones",
  "parametros": {
    "fecha_inicio": "2025-10-01",
    "fecha_fin": "2025-10-31"
  },
  "formato_salida": "json"
}
```

### 16.3 Reporte de Candidatos

**Método:** `POST`
**URL:** `{{base_url}}/admin/reportes`
**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token_admin}}
```

**Body (JSON):**
```json
{
  "nombre": "Reporte de Candidatos Registrados",
  "descripcion": "Análisis de candidatos por nivel educativo y experiencia",
  "tipo_reporte": "candidatos",
  "parametros": {
    "pais": "México"
  },
  "formato_salida": "json"
}
```

---

## 📋 ENDPOINTS ÚTILES PARA CONSULTAR DATOS

### Ver todas las vacantes
**GET** `{{base_url}}/vacantes`

### Ver vacantes activas con filtros
**GET** `{{base_url}}/vacantes?estado=activa&modalidad=hibrido`

### Ver mis postulaciones (candidato)
**GET** `{{base_url}}/vacantes/mis-postulaciones`
**Headers:** `Authorization: Bearer {{token_candidato}}`

### Ver postulaciones de una vacante (empresa)
**GET** `{{base_url}}/vacantes/1/postulaciones`
**Headers:** `Authorization: Bearer {{token_empresa}}`

### Ver mi perfil
**GET** `{{base_url}}/auth/perfil`
**Headers:** `Authorization: Bearer {{token}}`

### Ver perfil de empresa
**GET** `{{base_url}}/empresas/mi-empresa`
**Headers:** `Authorization: Bearer {{token_empresa}}`

### Ver perfil de candidato
**GET** `{{base_url}}/candidatos/mi-perfil`
**Headers:** `Authorization: Bearer {{token_candidato}}`

### Ver pruebas psicométricas disponibles
**GET** `{{base_url}}/pruebas-psicometricas`
**Headers:** `Authorization: Bearer {{token}}`

### Ver pruebas asignadas (candidato)
**GET** `{{base_url}}/pruebas-psicometricas/mis-asignaciones`
**Headers:** `Authorization: Bearer {{token_candidato}}`

### Ver mis pruebas técnicas (candidato)
**GET** `{{base_url}}/pruebas-tecnicas/mis-pruebas`
**Headers:** `Authorization: Bearer {{token_candidato}}`

### Ver mis pruebas médicas (candidato)
**GET** `{{base_url}}/pruebas-medicas/mis-pruebas`
**Headers:** `Authorization: Bearer {{token_candidato}}`

### Ver mis entrevistas (candidato)
**GET** `{{base_url}}/entrevistas/mis-entrevistas`
**Headers:** `Authorization: Bearer {{token_candidato}}`

### Ver entrevistas de empresa
**GET** `{{base_url}}/entrevistas/empresa`
**Headers:** `Authorization: Bearer {{token_empresa}}`

### Ver eventos de empresa
**GET** `{{base_url}}/eventos/empresa`
**Headers:** `Authorization: Bearer {{token_empresa}}`

### Ver mis eventos (candidato)
**GET** `{{base_url}}/eventos/mis-eventos`
**Headers:** `Authorization: Bearer {{token_candidato}}`

### Ver mis documentos (candidato)
**GET** `{{base_url}}/documentos/mis-documentos`
**Headers:** `Authorization: Bearer {{token_candidato}}`

### Ver evaluaciones de empresa
**GET** `{{base_url}}/evaluaciones/empresa`
**Headers:** `Authorization: Bearer {{token_empresa}}`

### Ver estadísticas de evaluaciones
**GET** `{{base_url}}/evaluaciones/estadisticas`
**Headers:** `Authorization: Bearer {{token_empresa}}`

### Ver historial de actividad (admin)
**GET** `{{base_url}}/admin/historial?page=1&limit=50`
**Headers:** `Authorization: Bearer {{token_admin}}`

### Ver estadísticas de actividad (admin)
**GET** `{{base_url}}/admin/historial/estadisticas`
**Headers:** `Authorization: Bearer {{token_admin}}`

### Ver todos los reportes (admin)
**GET** `{{base_url}}/admin/reportes`
**Headers:** `Authorization: Bearer {{token_admin}}`

---

## 💡 TIPS PARA POSTMAN

### 1. Crear una Collection con carpetas organizadas:
```
HR Platform API
├── 📁 1. Auth
│   ├── POST Registro Admin
│   ├── POST Registro Empresa
│   ├── POST Registro Candidato 1
│   ├── POST Registro Candidato 2
│   ├── POST Login Admin
│   ├── POST Login Empresa
│   ├── POST Login Candidato
│   └── GET Mi Perfil
├── 📁 2. Empresas
│   ├── PUT Crear/Actualizar Perfil
│   ├── GET Mi Empresa
│   └── GET Empresas Públicas
├── 📁 3. Candidatos
│   ├── PUT Crear/Actualizar Perfil
│   ├── GET Mi Perfil
│   └── GET Buscar Candidatos
├── 📁 4. Vacantes
│   ├── POST Crear Vacante
│   ├── GET Todas las Vacantes
│   ├── GET Mis Vacantes
│   └── PUT Actualizar Vacante
├── 📁 5. Postulaciones
│   ├── POST Postularse (autenticado)
│   ├── POST Postularse (anónimo)
│   ├── GET Mis Postulaciones
│   ├── GET Postulaciones de Vacante
│   └── PUT Actualizar Estado
├── 📁 6. Pruebas Psicométricas
│   ├── POST Crear Prueba
│   ├── GET Todas las Pruebas
│   ├── POST Asignar Prueba
│   └── GET Mis Asignaciones
├── 📁 7. Pruebas Técnicas
│   ├── POST Crear Prueba Técnica
│   ├── GET Mis Pruebas
│   └── PUT Entregar Prueba
├── 📁 8. Pruebas Médicas
│   ├── POST Solicitar Prueba
│   ├── GET Mis Pruebas
│   └── PUT Actualizar Resultado
├── 📁 9. Entrevistas
│   ├── POST Crear Entrevista
│   ├── GET Mis Entrevistas
│   ├── GET Entrevistas Empresa
│   └── PUT Evaluar Entrevista
├── 📁 10. Eventos
│   ├── POST Crear Evento
│   ├── GET Mis Eventos
│   ├── GET Eventos Empresa
│   └── PATCH Cambiar Estado
├── 📁 11. Documentos
│   ├── POST Subir Documento
│   ├── GET Mis Documentos
│   └── PUT Verificar Documento
├── 📁 12. Evaluaciones
│   ├── POST Crear Evaluación
│   ├── GET Evaluaciones Empresa
│   ├── GET Estadísticas
│   └── PUT Actualizar Evaluación
└── 📁 13. Admin
    ├── POST Registrar Actividad
    ├── GET Historial
    ├── GET Estadísticas Actividad
    ├── POST Generar Reporte
    └── GET Todos los Reportes
```

### 2. Variables de entorno útiles:
```
base_url = http://localhost:5000/api
token_admin = (se guarda automáticamente)
token_empresa = (se guarda automáticamente)
token_candidato = (se guarda automáticamente)
id_vacante_1 = (se guarda después de crear)
id_candidato_1 = (se guarda después de crear)
id_empresa_1 = (se guarda después de crear)
```

### 3. Script para auto-guardar token en login:

En la pestaña **Tests** de las peticiones de login, agrega:

**Para Admin:**
```javascript
var jsonData = pm.response.json();
if (jsonData.success) {
    pm.environment.set("token_admin", jsonData.data.token);
    console.log("Token admin guardado");
}
```

**Para Empresa:**
```javascript
var jsonData = pm.response.json();
if (jsonData.success) {
    pm.environment.set("token_empresa", jsonData.data.token);
    console.log("Token empresa guardado");
}
```

**Para Candidato:**
```javascript
var jsonData = pm.response.json();
if (jsonData.success) {
    pm.environment.set("token_candidato", jsonData.data.token);
    console.log("Token candidato guardado");
}
```

### 4. Script para auto-guardar IDs:

En la pestaña **Tests** de crear vacante:
```javascript
var jsonData = pm.response.json();
if (jsonData.success) {
    pm.environment.set("id_vacante_1", jsonData.data.id);
    console.log("ID de vacante guardado: " + jsonData.data.id);
}
```

---

## ⚠️ NOTAS IMPORTANTES

### 1. **Orden de ejecución**
Sigue el orden de los pasos para evitar errores de Foreign Key:
1. Primero crea usuarios y haz login
2. Luego crea perfiles (empresa/candidato)
3. Después crea vacantes
4. Finalmente crea postulaciones y pruebas

### 2. **IDs importantes**
Guarda los IDs que se retornan en las respuestas para usarlos en pasos posteriores:
- `id` del usuario después de registro
- `id` de la vacante después de crearla
- `id` del candidato después de crear perfil
- `id` de la empresa después de crear perfil

### 3. **Tokens JWT**
- Los tokens tienen expiración (configurable en `.env`)
- Si recibes error 401, vuelve a hacer login
- Usa las variables de entorno para no copiar/pegar tokens

### 4. **Roles en la base de datos**
Asegúrate de tener los roles creados en la tabla `roles`:
```sql
INSERT INTO roles (id, nombre, descripcion) VALUES
(1, 'administrador', 'Administrador del sistema'),
(2, 'empresa', 'Empresa reclutadora'),
(3, 'candidato', 'Candidato a empleo');
```

### 5. **Base de datos**
Antes de empezar:
1. Ejecuta el script SQL para crear las tablas
2. Inserta los roles iniciales
3. Verifica que el servidor esté corriendo en `http://localhost:5000`

### 6. **Fechas**
- Usa formato ISO 8601: `2025-10-26` o `2025-10-26T15:00:00`
- Las fechas límite deben ser futuras
- Las fechas de inicio laboral deben ser coherentes

---

## 🔍 VALIDACIONES COMUNES

### Contraseñas
- Mínimo 8 caracteres
- Al menos una mayúscula
- Al menos un número
- Al menos un carácter especial

### Emails
- Deben ser únicos en el sistema
- Formato válido de email

### Roles
- 1 = Administrador
- 2 = Empresa
- 3 = Candidato

### Estados de Postulación
- `pendiente`
- `en_revision`
- `preseleccionado`
- `rechazado`
- `contratado`

### Estados de Vacante
- `activa`
- `pausada`
- `cerrada`

---

## 🚀 CHECKLIST DE PRUEBAS

- [ ] Registrar 3 usuarios (admin, empresa, candidato)
- [ ] Hacer login con los 3 usuarios
- [ ] Crear perfil de empresa
- [ ] Crear perfil de candidato
- [ ] Crear 2 vacantes
- [ ] Crear 2 postulaciones (una autenticada, una anónima)
- [ ] Actualizar estado de postulación
- [ ] Crear prueba psicométrica
- [ ] Asignar prueba a candidato
- [ ] Crear prueba técnica
- [ ] Crear prueba médica
- [ ] Crear entrevista
- [ ] Crear 2 eventos
- [ ] Subir documento
- [ ] Crear evaluación post-contratación
- [ ] Generar 3 reportes diferentes
- [ ] Consultar historial de actividad

---

**¡Listo para empezar a probar! 🚀**

Recuerda seguir el orden y guardar los IDs importantes en variables de entorno.
