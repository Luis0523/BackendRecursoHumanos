# Backend Database Structure Report - Psychometric Tests

## Executive Summary

This report provides a comprehensive overview of the database structure for psychometric tests in the HR Management Platform backend. The system uses MySQL with Sequelize ORM and follows an MVC pattern with 20 tables implementing a complete talent management system.

---

## 1. DATABASE SCHEMA OVERVIEW

### Location
- **SQL Schema File**: `/home/lufi/Programacion/PlataformaRecursoHumanos/backend/SQL/schema_gestion_talento.sql`
- **Database Name**: `gestion_talento_humano`
- **Character Set**: utf8mb4
- **Total Tables**: 20
- **ORM**: Sequelize (Node.js)

### Database Connection
- **Location**: `/home/lufi/Programacion/PlataformaRecursoHumanos/backend/db/db.js`
- **Type**: MySQL 8.0+
- **Configuration**: Variables stored in `.env` file

---

## 2. PSYCHOMETRIC TESTS CORE TABLES

### 2.1 Pruebas (Tests)
**File**: `/home/lufi/Programacion/PlataformaRecursoHumanos/backend/src/models/pruebas-psicometricas/prueba.model.js`

**Columns**:
| Column | Type | Key | Description |
|--------|------|-----|-------------|
| id | INT | PK | Primary Key, auto-increment |
| nombre | VARCHAR(200) | | Test name (required) |
| descripcion | TEXT | | Test description |
| tipo | VARCHAR(50) | | Type: cognitive, personality, skills, knowledge |
| categoria | VARCHAR(100) | | Test category |
| duracion_minutos | INT | | Estimated duration in minutes |
| instrucciones | TEXT | | Instructions for test takers |
| puntaje_minimo_aprobacion | INT | | Minimum passing score |
| estado | VARCHAR(20) | IDX | Status: active, inactive, draft (default: 'active') |
| creador_id | INT | FK,IDX | Foreign key to Usuarios (test creator) |
| es_publica | BOOLEAN | | If other companies can use it (default: false) |
| created_at | DATETIME | | Creation timestamp |
| updated_at | DATETIME | | Last update timestamp |

**Indexes**: tipo, estado, creador_id
**Relationships**:
- 1:N with Preguntas (questions)
- 1:N with AsignacionPrueba (test assignments)
- 1:N with ResultadoPrueba (test results)
- M:1 with Usuarios (creator)

---

### 2.2 Preguntas (Questions)
**File**: `/home/lufi/Programacion/PlataformaRecursoHumanos/backend/src/models/pruebas-psicometricas/pregunta.model.js`

**Columns**:
| Column | Type | Key | Description |
|--------|------|-----|-------------|
| id | INT | PK | Primary Key |
| id_prueba | INT | FK,IDX | Foreign key to Pruebas (required) |
| texto_pregunta | TEXT | | Question text (required) |
| tipo_pregunta | VARCHAR(50) | | Type: multiple, true_false, open, scale (required) |
| puntaje_maximo | INT | | Maximum points (default: 1) |
| tiempo_limite_segundos | INT | | Time limit per question |
| orden | INT | IDX | Display order in test |
| es_obligatoria | BOOLEAN | | Is question mandatory (default: true) |
| imagen_url | VARCHAR(500) | | URL to associated image |
| created_at | DATETIME | | Creation timestamp |

**Indexes**: id_prueba, orden
**Relationships**:
- M:1 with Pruebas
- 1:N with OpcionRespuesta (answer options)
- 1:N with RespuestaCandidato (candidate responses)

---

### 2.3 Opciones_Respuesta (Answer Options)
**File**: `/home/lufi/Programacion/PlataformaRecursoHumanos/backend/src/models/pruebas-psicometricas/opcion-respuesta.model.js`

**Columns**:
| Column | Type | Key | Description |
|--------|------|-----|-------------|
| id | INT | PK | Primary Key |
| id_pregunta | INT | FK,IDX | Foreign key to Preguntas (required) |
| texto_opcion | TEXT | | Option text (required) |
| es_correcta | BOOLEAN | | If this is the correct answer (default: false) |
| puntaje | INT | | Points awarded if selected (default: 0) |
| orden | INT | | Display order of options |
| retroalimentacion | TEXT | | Feedback shown if selected |
| created_at | DATETIME | | Creation timestamp |

**Indexes**: id_pregunta
**Relationships**:
- M:1 with Preguntas
- 1:N with RespuestaCandidato (when selected)

---

### 2.4 Asignaciones_Prueba (Test Assignments) - CRITICAL TABLE
**File**: `/home/lufi/Programacion/PlataformaRecursoHumanos/backend/src/models/pruebas-psicometricas/asignacion-prueba.model.js`

**Purpose**: Controls which tests are assigned to which candidates

**Columns**:
| Column | Type | Key | Description |
|--------|------|-----|-------------|
| id | INT | PK | Primary Key |
| id_candidato | INT | FK,IDX | Foreign key to Candidatos (required) |
| id_prueba | INT | FK,IDX | Foreign key to Pruebas (required) |
| id_vacante | INT | FK | Foreign key to Vacantes (optional) |
| id_empresa | INT | FK | Foreign key to Empresas (assigning company) |
| fecha_asignacion | DATETIME | IDX | Assignment date (default: NOW()) |
| fecha_limite | DATEONLY | | Deadline to complete test |
| fecha_inicio | DATETIME | | When candidate started test |
| fecha_completado | DATETIME | | When test was completed |
| estado | VARCHAR(50) | IDX | Status: pending, in_progress, completed, expired, cancelled (default: 'pending') |
| intentos_permitidos | INT | | Number of attempts allowed (default: 1) |
| intentos_realizados | INT | | Number of attempts made (default: 0) |
| tiempo_total_segundos | INT | | Total time spent on test |
| ip_inicio | VARCHAR(45) | | IP when test started |
| ip_fin | VARCHAR(45) | | IP when test completed |
| created_at | DATETIME | | Creation timestamp |
| updated_at | DATETIME | | Last update timestamp |

**Indexes**: id_candidato, id_prueba, id_vacante, estado, fecha_asignacion
**Relationships**:
- M:1 with Candidatos
- M:1 with Pruebas
- M:1 with Vacantes
- M:1 with Empresas
- 1:N with RespuestaCandidato (candidate's answers)
- 1:1 with ResultadoPrueba (test result summary)

---

### 2.5 Respuestas_Candidato (Candidate Responses)
**File**: `/home/lufi/Programacion/PlataformaRecursoHumanos/backend/src/models/pruebas-psicometricas/respuesta-candidato.model.js`

**Columns**:
| Column | Type | Key | Description |
|--------|------|-----|-------------|
| id | INT | PK | Primary Key |
| id_asignacion | INT | FK,IDX | Foreign key to Asignaciones_Prueba (required) |
| id_pregunta | INT | FK,IDX | Foreign key to Preguntas (required) |
| id_opcion_seleccionada | INT | FK | Foreign key to Opciones_Respuesta (NULL for open questions) |
| respuesta_texto | TEXT | | Text answer for open questions |
| tiempo_respuesta_segundos | INT | | Time taken to answer this question |
| fecha_respuesta | DATETIME | | When answer was submitted (default: NOW()) |
| puntaje_obtenido | INT | | Points awarded (default: 0) |

**Indexes**: id_asignacion, id_pregunta
**Relationships**:
- M:1 with AsignacionPrueba
- M:1 with Preguntas
- M:1 with OpcionRespuesta

**Note**: Stores each individual answer from each candidate

---

### 2.6 Resultados_Prueba (Test Results) - Summary Table
**File**: `/home/lufi/Programacion/PlataformaRecursoHumanos/backend/src/models/pruebas-psicometricas/resultado-prueba.model.js`

**Columns**:
| Column | Type | Key | Description |
|--------|------|-----|-------------|
| id | INT | PK | Primary Key |
| id_asignacion | INT | FK,UQ | Foreign key to Asignaciones_Prueba (UNIQUE - 1:1) |
| id_candidato | INT | FK,IDX | Foreign key to Candidatos |
| id_prueba | INT | FK,IDX | Foreign key to Pruebas |
| fecha_resultado | DATETIME | IDX | Result date (default: NOW()) |
| puntaje_total | FLOAT | | Total points scored |
| puntaje_maximo | FLOAT | | Maximum possible points |
| porcentaje | DECIMAL(5,2) | | Percentage score |
| aprobado | BOOLEAN | IDX | Whether test was passed |
| tiempo_total_segundos | INT | | Total time spent |
| respuestas_correctas | INT | | Count of correct answers |
| respuestas_incorrectas | INT | | Count of incorrect answers |
| preguntas_sin_responder | INT | | Count of unanswered questions |
| comentarios | TEXT | | Evaluator comments |
| analisis_detallado | JSON | | Category-by-category analysis |
| created_at | DATETIME | | Creation timestamp |

**Indexes**: id_candidato, id_prueba, fecha_resultado, aprobado
**Relationships**:
- 1:1 with AsignacionPrueba
- M:1 with Candidatos
- M:1 with Pruebas

**Purpose**: Stores calculated summary of test completion

---

## 3. SUPPORTING TABLES IN THE ECOSYSTEM

### 3.1 Candidatos (Candidates)
**File**: `/home/lufi/Programacion/PlataformaRecursoHumanos/backend/src/models/candidatos/candidato.model.js`

**Key Columns**:
- id (PK)
- id_usuario (FK, unique) - Links to Users table
- cv_url, perfil, titulo_profesional, años_experiencia, salario_esperado
- disponibilidad, ubicacion, pais, ciudad, linkedin, portfolio, github
- fecha_nacimiento, genero

**Relationships with Tests**:
- 1:N with AsignacionPrueba (tests assigned to candidate)
- 1:N with RespuestaCandidato (via AsignacionPrueba)
- 1:N with ResultadoPrueba (test results)

---

### 3.2 Vacantes (Job Vacancies)
**File**: `/home/lufi/Programacion/PlataformaRecursoHumanos/backend/src/models/vacantes/vacante.model.js`

**Key Columns**:
- id (PK)
- id_empresa (FK)
- titulo, descripcion, requisitos, responsabilidades, beneficios
- salario_minimo, salario_maximo, mostrar_salario
- tipo_contrato, jornada, modalidad, ubicacion, pais, ciudad
- años_experiencia_min, nivel_educacion, vacantes_disponibles
- fecha_publicacion, fecha_cierre, estado (active, paused, closed, cancelled)
- vistas

**Relationships with Tests**:
- 1:N with AsignacionPrueba (tests assigned for this vacancy)

---

### 3.3 Usuarios (Users)
**File**: `/home/lufi/Programacion/PlataformaRecursoHumanos/backend/src/models/auth/usuario.model.js`

**Key Columns**:
- id (PK)
- nombre, email (unique), contraseña (bcrypt hash), id_rol (FK)
- telefono, avatar, estado (active, suspended, inactive)
- token_recuperacion, token_expiracion, email_verificado
- created_at, updated_at

**Relationships with Tests**:
- 1:N with Prueba (as creator/creador_id)

---

### 3.4 Postulaciones (Applications)
**File**: `/home/lufi/Programacion/PlataformaRecursoHumanos/backend/src/models/vacantes/postulacion.model.js`

**Relationship with Tests**:
- Indirect: Tests can be assigned to candidates via vacancy context
- Candidates must have applied (postulado) to be assigned tests

---

## 4. COMPLETE RELATIONSHIP DIAGRAM

### Psychometric Tests Relationship Map

```
Usuarios (1)
    |
    ├─ (1:N) Pruebas [creador_id]
    |         |
    |         ├─ (1:N) Preguntas [id_prueba]
    |         |         |
    |         |         └─ (1:N) Opciones_Respuesta [id_pregunta]
    |         |
    |         ├─ (1:N) AsignacionPrueba [id_prueba]
    |         |         |
    |         |         ├─ (M:1) Candidatos [id_candidato]
    |         |         |         └─ (M:1) Usuarios [id_usuario]
    |         |         |
    |         |         ├─ (M:1) Vacantes [id_vacante]
    |         |         |         └─ (M:1) Empresas [id_empresa]
    |         |         |
    |         |         ├─ (M:1) Empresas [id_empresa]
    |         |         |
    |         |         ├─ (1:N) RespuestaCandidato [id_asignacion]
    |         |         |         ├─ (M:1) Preguntas [id_pregunta]
    |         |         |         └─ (M:1) Opciones_Respuesta [id_opcion_seleccionada]
    |         |         |
    |         |         └─ (1:1) ResultadoPrueba [id_asignacion]
    |         |
    |         └─ (1:N) ResultadoPrueba [id_prueba]
    |
    └─ (1:1) Empresas [id_usuario]
            └─ (1:N) AsignacionPrueba [id_empresa]

Candidatos (1)
    |
    ├─ (1:N) AsignacionPrueba [id_candidato]
    |
    ├─ (1:N) RespuestaCandidato [via AsignacionPrueba]
    |
    └─ (1:N) ResultadoPrueba [id_candidato]

Vacantes (1)
    |
    └─ (1:N) AsignacionPrueba [id_vacante]
```

---

## 5. API ENDPOINTS FOR PSYCHOMETRIC TESTS

### Location
**Routes File**: `/home/lufi/Programacion/PlataformaRecursoHumanos/backend/src/routes/pruebas-psicometricas/pruebas-psicometricas.routes.js`

**Controller**: `/home/lufi/Programacion/PlataformaRecursoHumanos/backend/src/controllers/pruebas-psicometricas/pruebas.controller.js`

### Implemented Endpoints

#### 1. Create Psychometric Test
```
POST /api/pruebas-psicometricas
Authorization: Bearer <token>
Content-Type: application/json
Access: Private (Admin or Enterprise)

Request Body:
{
  "nombre": "Test Name",
  "descripcion": "Test Description",
  "tipo": "cognitive|personality|skills|knowledge",
  "categoria": "Category",
  "duracion_minutos": 60,
  "instrucciones": "Instructions",
  "puntaje_minimo_aprobacion": 70,
  "es_publica": false
}

Response: 201 Created
{
  "success": true,
  "message": "Prueba creada exitosamente",
  "data": { Prueba object }
}
```

#### 2. Get All Available Tests
```
GET /api/pruebas-psicometricas?tipo=cognitive&estado=activa
Authorization: Bearer <token>
Access: Private

Query Parameters:
  - tipo: filter by type
  - estado: filter by status

Response: 200 OK
{
  "success": true,
  "message": "Pruebas obtenidas exitosamente",
  "data": [ { Prueba objects } ]
}
```

#### 3. Get Complete Test with Questions
```
GET /api/pruebas-psicometricas/:id
Authorization: Bearer <token>
Access: Private

Response: 200 OK
{
  "success": true,
  "message": "Prueba obtenida exitosamente",
  "data": {
    "id": 1,
    "nombre": "Test Name",
    "descripcion": "Description",
    "preguntas": [
      {
        "id": 1,
        "texto_pregunta": "Question?",
        "tipo_pregunta": "multiple",
        "puntaje_maximo": 1,
        "opciones": [
          {
            "id": 1,
            "texto_opcion": "Option A",
            "orden": 1
          }
        ]
      }
    ]
  }
}
```

**Note**: Correct answers and point values are hidden from candidates

#### 4. Assign Test to Candidate
```
POST /api/pruebas-psicometricas/asignar
Authorization: Bearer <token>
Content-Type: application/json
Access: Private (Enterprise only)

Request Body:
{
  "id_candidato": 1,
  "id_prueba": 1,
  "id_vacante": 1,
  "fecha_limite": "2024-12-31",
  "intentos_permitidos": 2
}

Response: 201 Created
{
  "success": true,
  "message": "Prueba asignada exitosamente",
  "data": { AsignacionPrueba object }
}
```

#### 5. Get My Assigned Tests
```
GET /api/pruebas-psicometricas/mis-asignaciones
Authorization: Bearer <token>
Access: Private (Candidate only)

Response: 200 OK
{
  "success": true,
  "message": "Pruebas asignadas obtenidas exitosamente",
  "data": [
    {
      "id": 1,
      "id_candidato": 1,
      "id_prueba": 1,
      "fecha_asignacion": "2024-01-15",
      "fecha_limite": "2024-01-31",
      "estado": "pending",
      "intentos_permitidos": 1,
      "intentos_realizados": 0,
      "prueba": {
        "id": 1,
        "nombre": "Test Name",
        "tipo": "cognitive",
        "duracion_minutos": 60
      },
      "resultado": null
    }
  ]
}
```

#### 6. Start Test
```
POST /api/pruebas-psicometricas/iniciar/:id_asignacion
Authorization: Bearer <token>
Access: Private (Candidate only)

Response: 200 OK
{
  "success": true,
  "message": "Prueba iniciada exitosamente",
  "data": {
    "id": 1,
    "estado": "en_progreso",
    "fecha_inicio": "2024-01-15T10:30:00Z",
    "ip_inicio": "192.168.1.1"
  }
}
```

**Validation**:
- Checks if deadline has passed (updates status to 'vencida')
- Verifies attempt count hasn't been exceeded
- Records start IP address

#### 7. Save Candidate Response
```
POST /api/pruebas-psicometricas/respuesta
Authorization: Bearer <token>
Content-Type: application/json
Access: Private (Candidate only)

Request Body:
{
  "id_asignacion": 1,
  "id_pregunta": 1,
  "id_opcion_seleccionada": 1,
  "respuesta_texto": "Open response text",
  "tiempo_respuesta_segundos": 45
}

Response: 201 Created
{
  "success": true,
  "message": "Respuesta guardada exitosamente",
  "data": {
    "id": 1,
    "id_asignacion": 1,
    "id_pregunta": 1,
    "puntaje_obtenido": 1,
    "fecha_respuesta": "2024-01-15T10:35:00Z"
  }
}
```

**Scoring**: 
- For multiple choice: Checks if option is correct and awards points
- For open-ended: Stores text for manual evaluation

#### 8. Finalize Test and Calculate Results
```
POST /api/pruebas-psicometricas/finalizar/:id_asignacion
Authorization: Bearer <token>
Access: Private (Candidate only)

Response: 200 OK
{
  "success": true,
  "message": "Prueba finalizada exitosamente",
  "data": {
    "id": 1,
    "id_asignacion": 1,
    "id_candidato": 1,
    "id_prueba": 1,
    "fecha_resultado": "2024-01-15T11:30:00Z",
    "puntaje_total": 85,
    "puntaje_maximo": 100,
    "porcentaje": 85.00,
    "aprobado": true,
    "tiempo_total_segundos": 3600,
    "respuestas_correctas": 17,
    "respuestas_incorrectas": 3,
    "preguntas_sin_responder": 0,
    "comentarios": null,
    "analisis_detallado": null
  }
}
```

**Automatic Calculations**:
- Total and maximum scores
- Percentage
- Pass/fail status (based on puntaje_minimo_aprobacion)
- Time spent
- Correct/incorrect/unanswered counts

#### 9. Get Test Result
```
GET /api/pruebas-psicometricas/resultado/:id_asignacion
Authorization: Bearer <token>
Access: Private

Response: 200 OK
{
  "success": true,
  "message": "Resultado obtenido exitosamente",
  "data": {
    "id": 1,
    "puntaje_total": 85,
    "puntaje_maximo": 100,
    "porcentaje": 85.00,
    "aprobado": true,
    "tiempo_total_segundos": 3600,
    "respuestas_correctas": 17,
    "respuestas_incorrectas": 3,
    "preguntas_sin_responder": 0,
    "prueba": {
      "nombre": "Test Name",
      "tipo": "cognitive"
    },
    "asignacion": {
      "fecha_inicio": "2024-01-15T10:30:00Z",
      "fecha_completado": "2024-01-15T11:30:00Z"
    }
  }
}
```

---

## 6. CONTROLLER FUNCTIONS IMPLEMENTED

**File**: `/home/lufi/Programacion/PlataformaRecursoHumanos/backend/src/controllers/pruebas-psicometricas/pruebas.controller.js`

### Exported Functions

1. **crearPrueba(req, res)**
   - Creates new psychometric test
   - Sets creator from authenticated user (req.userId)
   - Validates all required fields
   - Returns: 201 Created

2. **obtenerPruebas(req, res)**
   - Gets all public tests or tests created by user
   - Supports filtering by tipo and estado
   - Includes creator information
   - Returns: 200 OK with array of tests

3. **obtenerPruebaCompleta(req, res)**
   - Gets test with all questions and options
   - Hides correct answer indicators and point values from candidates
   - Includes nested relationships
   - Returns: 200 OK with full test structure

4. **asignarPrueba(req, res)**
   - Assigns test to candidate
   - Verifies enterprise owns the vacancy
   - Prevents duplicate assignments
   - Sets status to 'pendiente'
   - Returns: 201 Created

5. **misPruebasAsignadas(req, res)**
   - Gets tests assigned to authenticated candidate
   - Includes test details and results if available
   - Filters by candidate's profile
   - Returns: 200 OK with array of assignments

6. **iniciarPrueba(req, res)**
   - Starts test taking
   - Validates deadline hasn't passed
   - Checks attempt limit
   - Records start time and IP
   - Changes status to 'en_progreso'
   - Returns: 200 OK

7. **guardarRespuesta(req, res)**
   - Saves individual question response
   - Calculates points for multiple choice
   - Stores text for open questions
   - Records response time
   - Returns: 201 Created

8. **finalizarPrueba(req, res)**
   - Completes test and calculates results
   - Aggregates all responses
   - Computes statistics (correct, incorrect, unanswered)
   - Creates ResultadoPrueba record
   - Updates assignment status to 'completada'
   - Increments attempt counter
   - Returns: 200 OK with complete results

9. **obtenerResultado(req, res)**
   - Retrieves test result summary
   - Includes test and assignment details
   - Returns: 200 OK

---

## 7. DATA FLOW DIAGRAMS

### Test Assignment Flow
```
1. Enterprise User
   ├─ Logs in (creates token)
   ├─ Views candidates (via vacancies)
   └─ Assigns test to candidate
       └─ POST /api/pruebas-psicometricas/asignar
           └─ Creates AsignacionPrueba (status='pendiente')
               └─ Candidate receives notification

2. Candidate User
   ├─ Logs in
   ├─ Sees assigned tests
   │   └─ GET /api/pruebas-psicometricas/mis-asignaciones
   ├─ Starts test
   │   └─ POST /api/pruebas-psicometricas/iniciar/:id_asignacion
   │       └─ Updates AsignacionPrueba (status='en_progreso')
   ├─ Answers questions (loop)
   │   └─ POST /api/pruebas-psicometricas/respuesta
   │       └─ Creates RespuestaCandidato records
   └─ Finalizes test
       └─ POST /api/pruebas-psicometricas/finalizar/:id_asignacion
           ├─ Calculates ResultadoPrueba
           └─ Updates AsignacionPrueba (status='completada')

3. Enterprise Evaluator
   └─ Reviews results
       └─ GET /api/pruebas-psicometricas/resultado/:id_asignacion
           └─ Sees summary and analytics
```

### Data Storage Flow
```
Test Creation:
  Pruebas
    ├─ Preguntas (1:N)
    │   └─ Opciones_Respuesta (1:N)
    └─ (created by Usuarios via creador_id)

Test Assignment:
  AsignacionPrueba (1:N from Pruebas, Candidatos, Vacantes, Empresas)

Test Execution:
  RespuestaCandidato (1:N from AsignacionPrueba, Preguntas, Opciones_Respuesta)
    └─ Evaluated during ResultadoPrueba creation

Results Storage:
  ResultadoPrueba (1:1 from AsignacionPrueba)
    └─ Contains aggregated statistics
    └─ Can have detailed JSON analysis
```

---

## 8. KEY FEATURES AND CAPABILITIES

### Test Types Supported
- **Cognitive**: Intelligence and reasoning tests
- **Personality**: Personality assessment tests
- **Skills**: Job-related skill tests
- **Knowledge**: Domain knowledge tests

### Question Types
- **Multiple Choice**: Single best answer
- **True/False**: Binary choice
- **Open-Ended**: Text responses for manual evaluation
- **Scale**: Likert-style responses

### Attempt Management
- Configurable attempts per test
- Attempt tracking and limiting
- Prevention of double-taking

### Time Tracking
- Test duration estimates
- Per-question time limits
- Total time spent calculation

### Scoring System
- Automatic scoring for multiple choice
- Manual scoring capability (via comments)
- Percentage calculation
- Pass/fail determination
- Detailed analytics (JSON field)

### Security Features
- IP address logging (start and end)
- Authentication required for all endpoints
- Role-based access control (Candidate/Enterprise)
- Candidate-specific test hiding (no answer keys shown)
- Deadline enforcement

### Status Management
- **Asignaciones_Prueba**:
  - pending: Assigned but not started
  - en_progreso: Test in progress
  - completada: Test finished
  - vencida: Deadline passed
  - cancelada: Manually cancelled

### Relationship Contexts
- Tests can be assigned per **vacancy** (job-specific)
- Tests can be assigned per **company** (enterprise-wide)
- Multiple candidates can take the same test
- Each candidate can take tests multiple times (based on attempts_permitidos)

---

## 9. TECHNICAL STACK

### Language & Framework
- **Node.js** with **Express 5.1**
- **Sequelize ORM** for database abstraction

### Database
- **MySQL 8.0+**
- **Character Set**: utf8mb4 (supports emojis and special characters)

### Authentication
- **JWT** (JSON Web Tokens)
- **bcrypt** for password hashing

### Validation
- Input sanitization middleware
- ID validation middleware
- Role-based access control

### Response Format
- Consistent JSON responses via ResponseUtil
- Standard error handling with specific status codes

---

## 10. VALIDATION RULES

### Test Creation
- nombre (required): Max 200 characters
- tipo: Must be one of specified types
- duracion_minutos: Positive integer
- puntaje_minimo_aprobacion: Must be ≤ sum of puntaje_maximo values

### Test Assignment
- id_candidato: Must exist and be valid
- id_prueba: Must exist and be in 'activa' status
- id_vacante: If provided, must belong to requesting enterprise
- fecha_limite: Should be in future
- intentos_permitidos: Positive integer

### Response Submission
- id_asignacion: Must exist and be in 'en_progreso' status
- id_pregunta: Must belong to assigned test
- id_opcion_seleccionada: If provided, must be valid option for question

---

## 11. ERROR HANDLING

### HTTP Status Codes
- **201**: Created (successful resource creation)
- **200**: OK (successful operation)
- **400**: Bad Request (invalid input)
- **403**: Forbidden (authorization failure)
- **404**: Not Found (resource doesn't exist)
- **409**: Conflict (duplicate assignment)
- **500**: Server Error

### Example Errors
```
{
  "success": false,
  "message": "El candidato ya tiene esta prueba asignada",
  "statusCode": 409
}
```

---

## 12. IMPORTANT NOTES FOR DEVELOPERS

1. **AsignacionPrueba is Critical**: This table controls access and tracks progress
2. **ResultadoPrueba is 1:1**: Each assignment has exactly one result
3. **RespuestaCandidato Stores All Answers**: Individual responses, not just summary
4. **Correct Answers Hidden**: Frontend receives questions without answer keys
5. **Automatic Scoring**: Only for multiple choice with es_correcta flag
6. **Manual Evaluation**: Open-ended questions stored for evaluator review
7. **Time Tracking**: Useful for detecting cheating or issues
8. **IP Logging**: Can help identify unusual patterns

---

## 13. DATABASE QUERIES EXAMPLES

### Find all tests assigned to a candidate
```sql
SELECT ap.*, p.nombre, p.tipo 
FROM Asignaciones_Prueba ap
JOIN Pruebas p ON ap.id_prueba = p.id
WHERE ap.id_candidato = ? AND ap.estado IN ('pendiente', 'en_progreso', 'completada')
ORDER BY ap.fecha_asignacion DESC;
```

### Get test results for a candidate
```sql
SELECT rp.*, p.nombre, c.nombre as candidato
FROM Resultados_Prueba rp
JOIN Pruebas p ON rp.id_prueba = p.id
JOIN Candidatos c ON rp.id_candidato = c.id
WHERE rp.id_candidato = ? AND rp.aprobado = TRUE
ORDER BY rp.fecha_resultado DESC;
```

### Analyze test difficulty
```sql
SELECT p.nombre, p.tipo, 
       COUNT(DISTINCT ap.id_candidato) as takers,
       AVG(rp.porcentaje) as avg_score,
       MIN(rp.porcentaje) as min_score,
       MAX(rp.porcentaje) as max_score
FROM Pruebas p
LEFT JOIN Asignaciones_Prueba ap ON p.id = ap.id_prueba
LEFT JOIN Resultados_Prueba rp ON ap.id = rp.id_asignacion
WHERE ap.estado = 'completada'
GROUP BY p.id, p.nombre, p.tipo;
```

---

## 14. FILES SUMMARY

| File Path | Purpose |
|-----------|---------|
| `/SQL/schema_gestion_talento.sql` | Complete database schema definition |
| `/src/models/pruebas-psicometricas/*.js` | 6 model definitions (Sequelize) |
| `/src/controllers/pruebas-psicometricas/pruebas.controller.js` | Business logic (9 functions) |
| `/src/routes/pruebas-psicometricas/pruebas-psicometricas.routes.js` | API endpoints (9 routes) |
| `/src/models/index.js` | All model relationships (48 associations) |
| `/db/db.js` | Database connection configuration |
| `app.js` | Express server configuration |

---

## 15. NEXT STEPS FOR ENHANCEMENT

1. **Questions/Preguntas Management**
   - Create CRUD endpoints for questions
   - Bulk import from CSV/Excel
   - Question bank management

2. **Answer Options/Opciones_Respuesta**
   - Options management endpoints
   - Image/media support
   - Randomization functionality

3. **Advanced Scoring**
   - Partial credit for open-ended
   - Different scoring rubrics
   - Score weighting by category

4. **Reporting & Analytics**
   - Candidate performance reports
   - Test difficulty analysis
   - Statistical comparisons

5. **Test Administration**
   - Batch test assignments
   - Bulk result downloads
   - Test scheduling and reminders

6. **Security Enhancements**
   - Browser lockdown (prevent tab switching)
   - Webcam monitoring capability
   - Response randomization options

7. **Performance Optimization**
   - Pagination for large results
   - Caching mechanisms
   - Query optimization for analytics

---

## Conclusion

The psychometric test system is comprehensively designed with 6 dedicated tables that manage the complete lifecycle of test administration from creation to evaluation. The system supports multiple question types, automatic scoring, attempt management, time tracking, and detailed result analytics. All endpoints are secured with role-based access control and implement validation at multiple levels.

