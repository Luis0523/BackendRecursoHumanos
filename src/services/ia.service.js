const OpenAI = require('openai');

class IAService {
    constructor() {
        if (!process.env.OPENAI_API_KEY) {
            console.warn('⚠️ OPENAI_API_KEY no configurada');
        }
        
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
    }

    /**
     * Analiza el perfil de un candidato y lo compara con los requisitos de una vacante
     * @param {Object} candidato - Información del candidato
     * @param {Object} vacante - Información de la vacante
     * @returns {Object} Resultado del análisis con porcentaje de compatibilidad
     */
    async analizarCompatibilidadCandidato(candidato, vacante) {
        try {
            const prompt = `
Eres un experto en recursos humanos. Analiza la compatibilidad entre el siguiente candidato y la vacante:

**CANDIDATO:**
- Nombre: ${candidato.nombre}
- Título profesional: ${candidato.titulo_profesional || 'No especificado'}
- Años de experiencia: ${candidato.años_experiencia || 0}
- Perfil: ${candidato.perfil || 'No especificado'}
- Salario esperado: $${candidato.salario_esperado || 'No especificado'}
- Disponibilidad: ${candidato.disponibilidad || 'No especificado'}
- Ubicación: ${candidato.ciudad || 'No especificado'}, ${candidato.pais || 'No especificado'}

**VACANTE:**
- Título: ${vacante.titulo}
- Descripción: ${vacante.descripcion}
- Requisitos: ${vacante.requisitos}
- Salario ofrecido: $${vacante.salario_min} - $${vacante.salario_max}
- Ubicación: ${vacante.ubicacion}
- Tipo de empleo: ${vacante.tipo_empleo}

Por favor, proporciona:
1. Un porcentaje de compatibilidad (0-100)
2. Fortalezas del candidato para esta posición
3. Áreas de preocupación o debilidades
4. Recomendación final (Altamente Recomendado, Recomendado, Considerar, No Recomendado)
5. Un resumen breve (máximo 2 líneas)

Responde en formato JSON con esta estructura:
{
    "porcentaje_compatibilidad": number,
    "fortalezas": ["fortaleza1", "fortaleza2", ...],
    "areas_preocupacion": ["preocupacion1", "preocupacion2", ...],
    "recomendacion": "string",
    "resumen": "string"
}
`;

            const completion = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "Eres un experto en recursos humanos con años de experiencia en reclutamiento y selección de personal. Proporciona análisis objetivos y profesionales."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 1000
            });

            const respuesta = completion.choices[0].message.content;
            
            // Intentar parsear la respuesta como JSON
            let resultado;
            try {
                // Limpiar la respuesta de posibles markdown code blocks
                const jsonText = respuesta.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
                resultado = JSON.parse(jsonText);
            } catch (parseError) {
                console.error('Error al parsear respuesta de IA:', parseError);
                // Respuesta fallback
                resultado = {
                    porcentaje_compatibilidad: 50,
                    fortalezas: ['Análisis no disponible'],
                    areas_preocupacion: ['Error al procesar análisis'],
                    recomendacion: 'Considerar',
                    resumen: 'No se pudo completar el análisis automático. Se recomienda revisión manual.'
                };
            }

            return {
                success: true,
                analisis: resultado,
                tokens_usados: completion.usage.total_tokens
            };

        } catch (error) {
            console.error('Error al analizar compatibilidad con IA:', error);
            throw new Error('Error al realizar análisis de compatibilidad: ' + error.message);
        }
    }

    /**
     * Analiza las respuestas de una prueba psicométrica
     * @param {Object} prueba - Información de la prueba
     * @param {Array} respuestas - Respuestas del candidato
     * @returns {Object} Análisis de las respuestas
     */
    async analizarRespuestasPsicometricas(prueba, respuestas) {
        try {
            const respuestasTexto = respuestas.map((r, index) => {
                return `Pregunta ${index + 1}: ${r.pregunta.texto_pregunta}
Tipo: ${r.pregunta.tipo_pregunta}
Respuesta: ${r.respuesta_texto || r.opcion_seleccionada?.texto_opcion || 'Sin respuesta'}`;
            }).join('\n\n');

            const prompt = `
Eres un psicólogo organizacional experto. Analiza las siguientes respuestas de una prueba psicométrica:

**PRUEBA:** ${prueba.nombre}
**DESCRIPCIÓN:** ${prueba.descripcion}

**RESPUESTAS DEL CANDIDATO:**
${respuestasTexto}

Proporciona un análisis profesional que incluya:
1. Principales características de personalidad observadas
2. Fortalezas identificadas
3. Áreas de desarrollo
4. Puntos destacados
5. Recomendaciones para el proceso de selección

Responde en formato JSON con esta estructura:
{
    "caracteristicas_personalidad": ["caracteristica1", "caracteristica2", ...],
    "fortalezas": ["fortaleza1", "fortaleza2", ...],
    "areas_desarrollo": ["area1", "area2", ...],
    "puntos_destacados": "string",
    "recomendaciones": "string",
    "resumen_ejecutivo": "string"
}
`;

            const completion = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "Eres un psicólogo organizacional con experiencia en evaluación de personal. Proporciona análisis profesionales y éticos."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 1200
            });

            const respuesta = completion.choices[0].message.content;
            
            let resultado;
            try {
                const jsonText = respuesta.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
                resultado = JSON.parse(jsonText);
            } catch (parseError) {
                console.error('Error al parsear respuesta de IA:', parseError);
                resultado = {
                    caracteristicas_personalidad: ['Análisis no disponible'],
                    fortalezas: ['Análisis no disponible'],
                    areas_desarrollo: ['Análisis no disponible'],
                    puntos_destacados: 'Error al procesar análisis',
                    recomendaciones: 'Se recomienda revisión manual',
                    resumen_ejecutivo: 'No se pudo completar el análisis automático'
                };
            }

            return {
                success: true,
                analisis: resultado,
                tokens_usados: completion.usage.total_tokens
            };

        } catch (error) {
            console.error('Error al analizar respuestas psicométricas:', error);
            throw new Error('Error al realizar análisis psicométrico: ' + error.message);
        }
    }

    /**
     * Genera sugerencias de preguntas de entrevista basadas en el candidato y vacante
     * @param {Object} candidato - Información del candidato
     * @param {Object} vacante - Información de la vacante
     * @returns {Array} Lista de preguntas sugeridas
     */
    async generarPreguntasEntrevista(candidato, vacante) {
        try {
            const prompt = `
Genera 10 preguntas estratégicas para una entrevista basadas en:

**CANDIDATO:**
- Título: ${candidato.titulo_profesional || 'No especificado'}
- Experiencia: ${candidato.años_experiencia || 0} años
- Perfil: ${candidato.perfil || 'No especificado'}

**VACANTE:**
- Título: ${vacante.titulo}
- Descripción: ${vacante.descripcion}
- Requisitos: ${vacante.requisitos}

Las preguntas deben:
1. Evaluar habilidades técnicas específicas
2. Explorar experiencia relevante
3. Verificar ajuste cultural
4. Identificar motivaciones
5. Evaluar capacidad de resolución de problemas

Responde en formato JSON:
{
    "preguntas": [
        {
            "pregunta": "string",
            "objetivo": "string",
            "tipo": "tecnica|comportamental|situacional"
        }
    ]
}
`;

            const completion = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "Eres un experto en entrevistas de trabajo y evaluación de candidatos."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.8,
                max_tokens: 1500
            });

            const respuesta = completion.choices[0].message.content;
            
            let resultado;
            try {
                const jsonText = respuesta.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
                resultado = JSON.parse(jsonText);
            } catch (parseError) {
                console.error('Error al parsear respuesta de IA:', parseError);
                resultado = {
                    preguntas: [
                        {
                            pregunta: "Cuéntame sobre tu experiencia más relevante para esta posición",
                            objetivo: "Evaluar experiencia",
                            tipo: "comportamental"
                        }
                    ]
                };
            }

            return {
                success: true,
                preguntas: resultado.preguntas,
                tokens_usados: completion.usage.total_tokens
            };

        } catch (error) {
            console.error('Error al generar preguntas de entrevista:', error);
            throw new Error('Error al generar preguntas: ' + error.message);
        }
    }

    /**
     * Verifica si el servicio de IA está disponible
     * @returns {Boolean}
     */
    isDisponible() {
        return !!process.env.OPENAI_API_KEY;
    }
}

module.exports = new IAService();
