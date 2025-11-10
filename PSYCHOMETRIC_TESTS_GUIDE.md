# Psychometric Tests System - Complete Implementation Guide

## Quick Navigation

- **Detailed Database Report**: See `DATABASE_STRUCTURE_REPORT.md` (28 KB, 935 lines)
- **This Guide**: Overview and quick reference

---

## System Overview

The HR Management Platform backend includes a complete psychometric testing system with 6 dedicated database tables, 9 API endpoints, and 9 controller functions. The system manages the entire test lifecycle from creation to evaluation.

### Key Components

1. **Database**: MySQL 8.0+ with Sequelize ORM
2. **Framework**: Node.js with Express 5.1
3. **Authentication**: JWT with role-based access control
4. **Total Tables**: 20 (6 dedicated to psychometric tests)

---

## 1. Core Database Tables

### 1.1 Pruebas (Tests)
Master table for all psychometric tests.

**Model File**: `/src/models/pruebas-psicometricas/prueba.model.js`

**Key Columns**:
- `id` - Primary key
- `nombre` - Test name (required)
- `tipo` - Type: cognitive, personality, skills, knowledge
- `duracion_minutos` - Estimated duration
- `puntaje_minimo_aprobacion` - Passing score threshold
- `estado` - Status: activa, inactiva, borrador
- `creador_id` - Reference to user who created test
- `es_publica` - Whether other companies can use it

**Relationships**:
- 1:N → Preguntas (Questions)
- 1:N → AsignacionPrueba (Test Assignments)
- 1:N → ResultadoPrueba (Test Results)

---

### 1.2 Preguntas (Questions)
Questions that make up each test.

**Model File**: `/src/models/pruebas-psicometricas/pregunta.model.js`

**Key Columns**:
- `id` - Primary key
- `id_prueba` - Foreign key to Pruebas
- `texto_pregunta` - The question text
- `tipo_pregunta` - Type: multiple, verdadero_falso, abierta, escala
- `puntaje_maximo` - Points for correct answer (default: 1)
- `orden` - Display order in test
- `es_obligatoria` - Is question mandatory?

**Relationships**:
- M:1 → Pruebas
- 1:N → OpcionRespuesta (Answer Options)
- 1:N → RespuestaCandidato (Candidate Responses)

---

### 1.3 Opciones_Respuesta (Answer Options)
Options for multiple-choice and similar questions.

**Model File**: `/src/models/pruebas-psicometricas/opcion-respuesta.model.js`

**Key Columns**:
- `id` - Primary key
- `id_pregunta` - Foreign key to Preguntas
- `texto_opcion` - The option text
- `es_correcta` - Is this the correct answer?
- `puntaje` - Points awarded if selected
- `retroalimentacion` - Feedback message

**Relationships**:
- M:1 → Preguntas
- 1:N → RespuestaCandidato (when selected)

---

### 1.4 Asignaciones_Prueba (Test Assignments) - CRITICAL
Controls which tests are assigned to which candidates.

**Model File**: `/src/models/pruebas-psicometricas/asignacion-prueba.model.js`

**Key Columns**:
- `id` - Primary key
- `id_candidato` - Foreign key to Candidatos (required)
- `id_prueba` - Foreign key to Pruebas (required)
- `id_vacante` - Foreign key to Vacantes (optional, job-specific)
- `id_empresa` - Foreign key to Empresas (which company assigned it)
- `fecha_asignacion` - When test was assigned
- `fecha_limite` - Deadline to complete
- `fecha_inicio` - When candidate started
- `fecha_completado` - When candidate finished
- `estado` - Status tracking
- `intentos_permitidos` - How many attempts allowed
- `intentos_realizados` - How many attempts used
- `ip_inicio` / `ip_fin` - IP addresses for security

**Status Values**:
- `pendiente` - Assigned but not started
- `en_progreso` - Currently being taken
- `completada` - Finished
- `vencida` - Deadline passed
- `cancelada` - Manually cancelled

**Relationships**:
- M:1 → Candidatos
- M:1 → Pruebas
- M:1 → Vacantes
- M:1 → Empresas
- 1:N → RespuestaCandidato
- 1:1 → ResultadoPrueba

---

### 1.5 Respuestas_Candidato (Candidate Responses)
Individual answers from candidates.

**Model File**: `/src/models/pruebas-psicometricas/respuesta-candidato.model.js`

**Key Columns**:
- `id` - Primary key
- `id_asignacion` - Foreign key to Asignaciones_Prueba
- `id_pregunta` - Foreign key to Preguntas
- `id_opcion_seleccionada` - Foreign key to Opciones_Respuesta (NULL for open questions)
- `respuesta_texto` - Text answer for open-ended questions
- `tiempo_respuesta_segundos` - Time spent on this question
- `puntaje_obtenido` - Points awarded

**Relationships**:
- M:1 → AsignacionPrueba
- M:1 → Preguntas
- M:1 → OpcionRespuesta

---

### 1.6 Resultados_Prueba (Test Results Summary)
Summary results after test completion.

**Model File**: `/src/models/pruebas-psicometricas/resultado-prueba.model.js`

**Key Columns**:
- `id` - Primary key
- `id_asignacion` - Foreign key to Asignaciones_Prueba (UNIQUE - 1:1 relationship)
- `id_candidato` - Foreign key to Candidatos
- `id_prueba` - Foreign key to Pruebas
- `puntaje_total` - Total points scored
- `puntaje_maximo` - Maximum possible points
- `porcentaje` - Calculated percentage
- `aprobado` - Boolean: did they pass?
- `respuestas_correctas` - Count
- `respuestas_incorrectas` - Count
- `preguntas_sin_responder` - Count
- `analisis_detallado` - JSON field for detailed breakdown

**Relationships**:
- 1:1 → AsignacionPrueba
- M:1 → Candidatos
- M:1 → Pruebas

---

## 2. Supporting Tables

### 2.1 Candidatos (Candidates)
**File**: `/src/models/candidatos/candidato.model.js`

Linked to tests via `AsignacionPrueba`. Contains:
- `id_usuario` - Reference to user account
- CV and professional information
- Availability and location data

### 2.2 Vacantes (Job Vacancies)
**File**: `/src/models/vacantes/vacante.model.js`

Tests can be assigned per vacancy (optional). Contains:
- Job title, description, requirements
- Salary, contract type, location

### 2.3 Usuarios (Users)
**File**: `/src/models/auth/usuario.model.js`

Test creators and participants. Contains:
- Authentication credentials
- Profile information
- Role assignment

### 2.4 Empresas (Companies)
**File**: `/src/models/empresas/empresa.model.js`

Companies that can create and assign tests. Contains:
- Company information
- Contact details

---

## 3. API Endpoints

### All Endpoints Require JWT Authentication

**Routes File**: `/src/routes/pruebas-psicometricas/pruebas-psicometricas.routes.js`
**Controller**: `/src/controllers/pruebas-psicometricas/pruebas.controller.js`

---

### POST /api/pruebas-psicometricas
**Create Psychometric Test**

Access: Private (Admin or Enterprise)

Request Body:
```json
{
  "nombre": "Cognitive Assessment",
  "descripcion": "Test description",
  "tipo": "cognitive",
  "categoria": "Category name",
  "duracion_minutos": 60,
  "instrucciones": "Instructions for test takers",
  "puntaje_minimo_aprobacion": 70,
  "es_publica": false
}
```

Response: `201 Created`
```json
{
  "success": true,
  "message": "Prueba creada exitosamente",
  "data": { test object with id }
}
```

---

### GET /api/pruebas-psicometricas
**Get All Available Tests**

Access: Private

Query Parameters:
- `tipo` - Filter by type (cognitive, personality, skills, knowledge)
- `estado` - Filter by status (activa, inactiva, borrador)

Response: `200 OK`
```json
{
  "success": true,
  "message": "Pruebas obtenidas exitosamente",
  "data": [
    {
      "id": 1,
      "nombre": "Test Name",
      "tipo": "cognitive",
      "estado": "activa",
      "creador": { name }
    }
  ]
}
```

---

### GET /api/pruebas-psicometricas/:id
**Get Complete Test with Questions**

Access: Private

**Important**: Correct answers and point values are hidden from candidates!

Response: `200 OK`
```json
{
  "success": true,
  "data": {
    "id": 1,
    "nombre": "Test Name",
    "preguntas": [
      {
        "id": 1,
        "texto_pregunta": "Question?",
        "tipo_pregunta": "multiple",
        "orden": 1,
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

---

### POST /api/pruebas-psicometricas/asignar
**Assign Test to Candidate**

Access: Private (Enterprise only)

Request Body:
```json
{
  "id_candidato": 1,
  "id_prueba": 1,
  "id_vacante": 1,
  "fecha_limite": "2024-12-31",
  "intentos_permitidos": 2
}
```

Response: `201 Created`
```json
{
  "success": true,
  "message": "Prueba asignada exitosamente",
  "data": { assignment object }
}
```

**Validations**:
- Candidate must exist
- Test must exist and be active
- Vacancy (if provided) must belong to requesting enterprise
- Prevents duplicate assignments

---

### GET /api/pruebas-psicometricas/mis-asignaciones
**Get My Assigned Tests**

Access: Private (Candidate only)

Response: `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "id_candidato": 1,
      "id_prueba": 1,
      "estado": "pendiente",
      "fecha_asignacion": "2024-01-15",
      "fecha_limite": "2024-01-31",
      "intentos_permitidos": 1,
      "intentos_realizados": 0,
      "prueba": {
        "nombre": "Test Name",
        "tipo": "cognitive",
        "duracion_minutos": 60
      },
      "resultado": null
    }
  ]
}
```

---

### POST /api/pruebas-psicometricas/iniciar/:id_asignacion
**Start Test**

Access: Private (Candidate only)

Response: `200 OK`
```json
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

**Validations**:
- Checks if deadline has passed
- Verifies attempt limit not exceeded
- Records start time and IP address
- Updates status to "en_progreso"

---

### POST /api/pruebas-psicometricas/respuesta
**Save Candidate Response**

Access: Private (Candidate only)

Request Body:
```json
{
  "id_asignacion": 1,
  "id_pregunta": 1,
  "id_opcion_seleccionada": 1,
  "respuesta_texto": "Open text response",
  "tiempo_respuesta_segundos": 45
}
```

Response: `201 Created`
```json
{
  "success": true,
  "message": "Respuesta guardada exitosamente",
  "data": {
    "id": 1,
    "puntaje_obtenido": 1,
    "fecha_respuesta": "2024-01-15T10:35:00Z"
  }
}
```

**Scoring**:
- Multiple choice: Auto-scored if `es_correcta=true`
- Open-ended: Stored for manual evaluation
- `id_opcion_seleccionada` is NULL for open questions

---

### POST /api/pruebas-psicometricas/finalizar/:id_asignacion
**Finalize Test & Calculate Results**

Access: Private (Candidate only)

Response: `200 OK`
```json
{
  "success": true,
  "message": "Prueba finalizada exitosamente",
  "data": {
    "id": 1,
    "id_asignacion": 1,
    "puntaje_total": 85,
    "puntaje_maximo": 100,
    "porcentaje": 85.00,
    "aprobado": true,
    "tiempo_total_segundos": 3600,
    "respuestas_correctas": 17,
    "respuestas_incorrectas": 3,
    "preguntas_sin_responder": 0
  }
}
```

**Automatic Calculations**:
- Aggregates all individual responses
- Calculates total and maximum scores
- Computes percentage
- Determines pass/fail status
- Counts correct/incorrect/unanswered
- Calculates time spent
- Updates `AsignacionPrueba` status to "completada"
- Increments `intentos_realizados`

---

### GET /api/pruebas-psicometricas/resultado/:id_asignacion
**Get Test Result**

Access: Private

Response: `200 OK`
```json
{
  "success": true,
  "data": {
    "id": 1,
    "puntaje_total": 85,
    "porcentaje": 85.00,
    "aprobado": true,
    "tiempo_total_segundos": 3600,
    "respuestas_correctas": 17,
    "respuestas_incorrectas": 3,
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

## 4. Controller Functions

**File**: `/src/controllers/pruebas-psicometricas/pruebas.controller.js`

1. **crearPrueba(req, res)**
   - Creates new test
   - Sets creator to current user
   - Returns 201 Created

2. **obtenerPruebas(req, res)**
   - Lists all public tests + user's tests
   - Filters by tipo and estado
   - Returns 200 OK

3. **obtenerPruebaCompleta(req, res)**
   - Gets test with all questions
   - Hides correct answers from candidates
   - Returns 200 OK

4. **asignarPrueba(req, res)**
   - Assigns test to candidate
   - Validates enterprise ownership
   - Prevents duplicates
   - Returns 201 Created

5. **misPruebasAsignadas(req, res)**
   - Gets candidate's assigned tests
   - Includes test details
   - Includes results if available
   - Returns 200 OK

6. **iniciarPrueba(req, res)**
   - Starts test taking
   - Validates deadline
   - Checks attempts
   - Records IP and start time
   - Returns 200 OK

7. **guardarRespuesta(req, res)**
   - Saves individual response
   - Auto-scores multiple choice
   - Records time spent
   - Returns 201 Created

8. **finalizarPrueba(req, res)**
   - Completes test
   - Calculates all statistics
   - Creates result record
   - Updates assignment status
   - Returns 200 OK

9. **obtenerResultado(req, res)**
   - Gets result summary
   - Includes related data
   - Returns 200 OK

---

## 5. Data Flow

### Test Creation Flow
1. Admin/Enterprise creates test → POST `/api/pruebas-psicometricas`
2. Creates Prueba record
3. Returns test object with ID

### Test Assignment Flow
1. Enterprise assigns test → POST `/api/pruebas-psicometricas/asignar`
2. Creates AsignacionPrueba (status='pendiente')
3. Candidate sees it → GET `/mis-asignaciones`

### Test Execution Flow
1. Candidate starts → POST `/iniciar/:id_asignacion`
   - Updates status to 'en_progreso'
   - Records start time and IP
2. Candidate answers → POST `/respuesta` (multiple times)
   - Creates RespuestaCandidato records
   - Auto-scores if applicable
3. Candidate submits → POST `/finalizar/:id_asignacion`
   - Creates ResultadoPrueba
   - Updates AsignacionPrueba status to 'completada'
   - Increments attempts_realizados

### Result Viewing Flow
1. Candidate/Enterprise views → GET `/resultado/:id_asignacion`
2. Gets summary from ResultadoPrueba

---

## 6. Key Features

### Test Types
- `cognitive` - Intelligence and reasoning
- `personality` - Personality assessment
- `skills` - Job-related skills
- `knowledge` - Domain knowledge

### Question Types
- `multiple` - Multiple choice
- `verdadero_falso` - True/false
- `abierta` - Open-ended text
- `escala` - Likert scale

### Scoring
- **Automatic**: Multiple choice with es_correcta=true
- **Manual**: Open-ended questions (via comments field)
- **Pass/Fail**: Based on puntaje_minimo_aprobacion
- **Analytics**: Percentage, counts, timing

### Security
- JWT authentication on all endpoints
- Role-based access control
- IP logging (start & end)
- Deadline enforcement
- Answer hiding from candidates
- Attempt limiting

### Attempt Management
- `intentos_permitidos` - How many tries allowed
- `intentos_realizados` - Tracks current attempts
- Prevents retaking if limit exceeded

### Time Tracking
- `duracion_minutos` - Est. duration
- `tiempo_limite_segundos` - Per question
- `tiempo_total_segundos` - Total spent

---

## 7. Database Query Examples

### Find all pending tests for a candidate
```sql
SELECT ap.*, p.nombre 
FROM Asignaciones_Prueba ap
JOIN Pruebas p ON ap.id_prueba = p.id
WHERE ap.id_candidato = 1 AND ap.estado = 'pendiente'
ORDER BY ap.fecha_limite ASC;
```

### Get test results for a candidate
```sql
SELECT rp.*, p.nombre, p.tipo
FROM Resultados_Prueba rp
JOIN Pruebas p ON rp.id_prueba = p.id
WHERE rp.id_candidato = 1
ORDER BY rp.fecha_resultado DESC;
```

### Find expired tests
```sql
SELECT ap.id, ap.id_candidato, p.nombre
FROM Asignaciones_Prueba ap
JOIN Pruebas p ON ap.id_prueba = p.id
WHERE ap.fecha_limite < NOW()
AND ap.estado IN ('pendiente', 'en_progreso');
```

### Test difficulty analysis
```sql
SELECT p.nombre, p.tipo,
       COUNT(rp.id) as total_takers,
       AVG(rp.porcentaje) as avg_score,
       SUM(CASE WHEN rp.aprobado THEN 1 ELSE 0 END) as passed
FROM Pruebas p
LEFT JOIN Resultados_Prueba rp ON p.id = rp.id_prueba
WHERE rp.id IS NOT NULL
GROUP BY p.id, p.nombre, p.tipo;
```

---

## 8. Model Relationships (All 48 Associations)

**File**: `/src/models/index.js`

Key psychometric test relationships:
```
Usuario (1:N) Prueba
Prueba (1:N) Pregunta (1:N) OpcionRespuesta
Prueba (1:N) AsignacionPrueba
AsignacionPrueba (1:N) RespuestaCandidato
AsignacionPrueba (1:1) ResultadoPrueba
AsignacionPrueba (M:1) Candidato
AsignacionPrueba (M:1) Vacante
AsignacionPrueba (M:1) Empresa
```

---

## 9. Configuration Files

### Database Connection
**File**: `/db/db.js`
- MySQL 8.0+ connection
- Sequelize ORM configuration
- Environment-based config

### Environment Variables (.env)
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=gestion_talento_humano
DB_PORT=3306
PORT=5000
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
NODE_ENV=development
```

---

## 10. File Structure

```
backend/
├── SQL/
│   └── schema_gestion_talento.sql (complete schema)
├── src/
│   ├── models/
│   │   ├── pruebas-psicometricas/
│   │   │   ├── prueba.model.js
│   │   │   ├── pregunta.model.js
│   │   │   ├── opcion-respuesta.model.js
│   │   │   ├── asignacion-prueba.model.js
│   │   │   ├── respuesta-candidato.model.js
│   │   │   └── resultado-prueba.model.js
│   │   └── index.js (all relationships)
│   ├── controllers/
│   │   └── pruebas-psicometricas/
│   │       └── pruebas.controller.js
│   ├── routes/
│   │   └── pruebas-psicometricas/
│   │       └── pruebas-psicometricas.routes.js
│   └── ...
├── db/
│   └── db.js
├── app.js
├── DATABASE_STRUCTURE_REPORT.md (detailed 28KB report)
└── PSYCHOMETRIC_TESTS_GUIDE.md (this file)
```

---

## 11. Error Handling

### HTTP Status Codes
- `201` Created - Successful creation
- `200` OK - Successful operation
- `400` Bad Request - Invalid input
- `403` Forbidden - Authorization denied
- `404` Not Found - Resource missing
- `409` Conflict - Duplicate assignment
- `500` Server Error

### Common Errors
```json
{
  "success": false,
  "message": "El candidato ya tiene esta prueba asignada",
  "statusCode": 409
}
```

---

## 12. Testing the System

### Using Postman or curl

#### Create Test
```bash
POST http://localhost:5000/api/pruebas-psicometricas
Authorization: Bearer <token>
Content-Type: application/json

{
  "nombre": "IQ Test",
  "tipo": "cognitive",
  "duracion_minutos": 90,
  "puntaje_minimo_aprobacion": 70
}
```

#### Get Tests
```bash
GET http://localhost:5000/api/pruebas-psicometricas?tipo=cognitive
Authorization: Bearer <token>
```

#### Assign Test
```bash
POST http://localhost:5000/api/pruebas-psicometricas/asignar
Authorization: Bearer <token>
Content-Type: application/json

{
  "id_candidato": 1,
  "id_prueba": 1,
  "fecha_limite": "2024-12-31"
}
```

---

## 13. For Frontend Integration

### Key Points
1. **Always include JWT token** in Authorization header
2. **Candidate role required** for most endpoints
3. **Enterprise role required** for assigning tests
4. **Hidden answers**: Correct answers not shown when fetching questions
5. **Status tracking**: Check `estado` field for progress
6. **Results**: Available only after test finalization

### Example Frontend Workflow
1. Login → Get token
2. GET `/mis-asignaciones` → Show pending tests
3. POST `/iniciar/:id` → Start test
4. Loop: POST `/respuesta` → Save answers
5. POST `/finalizar/:id` → Submit test
6. GET `/resultado/:id` → Show results

---

## 14. Next Steps for Enhancement

1. **Question Management** - CRUD endpoints for questions
2. **Bulk Import** - CSV/Excel import functionality
3. **Advanced Analytics** - Category-based analysis
4. **Test Reminders** - Email/SMS notifications
5. **Question Bank** - Reusable question library
6. **Test Templates** - Pre-built test templates
7. **Export Results** - PDF/Excel report generation
8. **Partial Scoring** - Rubric-based scoring

---

## 15. Support & Documentation

- **Detailed Report**: `DATABASE_STRUCTURE_REPORT.md`
- **API Specification**: All endpoints documented above
- **Schema**: `SQL/schema_gestion_talento.sql`
- **Model Relationships**: `src/models/index.js`

---

## Quick Reference

| Component | Location |
|-----------|----------|
| Models | `/src/models/pruebas-psicometricas/` |
| Controller | `/src/controllers/pruebas-psicometricas/pruebas.controller.js` |
| Routes | `/src/routes/pruebas-psicometricas/pruebas-psicometricas.routes.js` |
| SQL Schema | `/SQL/schema_gestion_talento.sql` |
| Relationships | `/src/models/index.js` |
| Database Config | `/db/db.js` |
| Express Server | `/app.js` |

---

**Last Updated**: November 7, 2024
**System**: Complete & Production Ready
**Status**: All 9 endpoints implemented and tested

