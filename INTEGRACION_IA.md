# 🤖 Integración de IA con OpenAI

## ✅ Backend - Completado

### Instalación
```bash
npm install openai
```

### Configuración

1. **Obtener API Key de OpenAI:**
   - Ve a https://platform.openai.com/api-keys
   - Crea una cuenta o inicia sesión
   - Genera una nueva API Key
   - Copia la clave (comienza con `sk-...`)

2. **Configurar en el Backend:**
   Edita el archivo `/backend/.env` y agrega:
   ```
   OPENAI_API_KEY=sk-tu-clave-aqui
   ```

### Funcionalidades Implementadas

#### 1. **Análisis de Compatibilidad Candidato-Vacante**
- **Endpoint:** `POST /api/ia/analizar-compatibilidad/:id_postulacion`
- **Descripción:** Analiza automáticamente qué tan compatible es un candidato con una vacante
- **Retorna:**
  - Porcentaje de compatibilidad (0-100%)
  - Fortalezas del candidato
  - Áreas de preocupación
  - Recomendación (Altamente Recomendado, Recomendado, Considerar, No Recomendado)
  - Resumen ejecutivo

#### 2. **Análisis de Pruebas Psicométricas**
- **Endpoint:** `POST /api/ia/analizar-prueba/:id_asignacion`
- **Descripción:** Analiza las respuestas de pruebas psicométricas con IA
- **Retorna:**
  - Características de personalidad identificadas
  - Fortalezas del candidato
  - Áreas de desarrollo
  - Puntos destacados
  - Recomendaciones para el proceso de selección
  - Resumen ejecutivo

#### 3. **Generación de Preguntas de Entrevista**
- **Endpoint:** `POST /api/ia/generar-preguntas/:id_postulacion`
- **Descripción:** Genera preguntas personalizadas para entrevistas
- **Retorna:**
  - 10 preguntas estratégicas
  - Objetivo de cada pregunta
  - Tipo (técnica, comportamental, situacional)

#### 4. **Verificar Estado del Servicio**
- **Endpoint:** `GET /api/ia/estado`
- **Descripción:** Verifica si la API Key está configurada correctamente

### Archivos Creados

```
backend/
├── src/
│   ├── services/
│   │   └── ia.service.js          # Servicio principal de IA
│   ├── controllers/
│   │   └── ia.controller.js       # Controlador de endpoints
│   └── routes/
│       └── ia.routes.js            # Rutas de la API
└── .env                             # Configuración (agregar OPENAI_API_KEY)
```

### Uso desde el Frontend

```javascript
// Ejemplo 1: Analizar compatibilidad
const analisisCompatibilidad = async (idPostulacion) => {
    const response = await API.post(`/ia/analizar-compatibilidad/${idPostulacion}`);
    console.log(response.analisis.porcentaje_compatibilidad); // 85
    console.log(response.analisis.recomendacion); // "Altamente Recomendado"
};

// Ejemplo 2: Analizar prueba psicométrica
const analisisPrueba = async (idAsignacion) => {
    const response = await API.post(`/ia/analizar-prueba/${idAsignacion}`);
    console.log(response.analisis.caracteristicas_personalidad);
    console.log(response.analisis.resumen_ejecutivo);
};

// Ejemplo 3: Generar preguntas de entrevista
const preguntasIA = async (idPostulacion) => {
    const response = await API.post(`/ia/generar-preguntas/${idPostulacion}`);
    console.log(response.preguntas); // Array de 10 preguntas
};

// Ejemplo 4: Verificar estado
const verificarIA = async () => {
    const response = await API.get('/ia/estado');
    console.log(response.disponible); // true/false
};
```

### Consideraciones

- **Costos:** OpenAI cobra por tokens usados. Cada análisis consume ~500-1500 tokens
- **Rate Limits:** La API gratuita tiene límites. Considera usar con moderación
- **Seguridad:** La API Key debe mantenerse privada (nunca en frontend)
- **Fallback:** El sistema funciona sin IA, pero con funcionalidad reducida

### Próximos Pasos - Frontend

1. Agregar botón "🤖 Analizar con IA" en la página de postulaciones
2. Mostrar el porcentaje de compatibilidad en la lista de candidatos
3. Agregar sección de análisis IA en el perfil del candidato
4. Botón para generar preguntas de entrevista
5. Mostrar análisis psicométrico con IA en resultados de pruebas

### Dónde Integrar en el Frontend

#### Página de Postulaciones (`postulaciones.html`)
- Agregar columna "% IA" en la tabla
- Botón "Analizar con IA" en cada postulación
- Modal para mostrar análisis detallado

#### Página de Resultados de Pruebas
- Botón "Análisis IA" junto a "Ver Respuestas"
- Mostrar características de personalidad
- Recomendaciones automáticas

#### Página de Seguimiento (`seguimiento.html`)
- Columna "Análisis IA" con porcentaje
- Código de colores según recomendación:
  - Verde: Altamente Recomendado
  - Azul: Recomendado
  - Amarillo: Considerar
  - Rojo: No Recomendado

#### Página de Entrevistas
- Botón "Generar Preguntas con IA"
- Lista de preguntas sugeridas
- Exportar a PDF

---

**Estado:** ✅ Backend completado
**Siguiente:** Implementar UI en el frontend
