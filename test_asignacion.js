const axios = require('axios');

// Login primero
async function test() {
    try {
        // Login
        const loginRes = await axios.post('http://localhost:5010/api/auth/login', {
            email: 'usuario@test.com',
            contraseña: 'Usuario123!'
        });
        
        console.log('✅ Login exitoso');
        const token = loginRes.data.token;
        
        // Probar obtener asignación
        const asignacionRes = await axios.get('http://localhost:5010/api/pruebas-psicometricas/asignacion/1', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('✅ Asignación obtenida:', JSON.stringify(asignacionRes.data, null, 2));
        
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
        if (error.response?.data) {
            console.error('Detalles:', error.response.data);
        }
    }
}

test();
