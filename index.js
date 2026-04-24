// Importamos las herramientas que instalamos
// dotenv su funcion es leer el archivo oculto .env y añadir la clave secreta en la memoria de node
// generativeAI libreria de google que contiene todo lo necesario para que el ordenador se comunique con los servidores 
// de gemini sin tener que programar peticiones HTTP complejas a mano
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const express = require('express');
const cors = require('cors');

// Inicializamos el servidor Express
const app = express();
app.use(cors());
app.use(express.json()); // Para poder leer JSON en las peticiones
app.use(express.static('public')); // Esto expone tu carpeta public al navegador

// Inicializamos la conexión usando tu clave secreta del archivo .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Creamos la ruta (endpoint) que recibirá los datos del perro
app.post('/api/consultar-perro', async (req, res) => {
    try {
        console.log("🐶 Recibiendo nueva consulta canina...");
        
        // Atrapamos los datos que nos enviará el Frontend
        const perfilPerro = req.body;

        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        const prompt = `
        Eres un experto etólogo canino y nutricionista veterinario.
        Analiza el siguiente perfil de un perro:
        - Raza: ${perfilPerro.raza}
        - Edad: ${perfilPerro.edad}
        - Peso: ${perfilPerro.peso}
        - Nivel de Actividad: ${perfilPerro.nivelActividad}
        - Problema de comportamiento: ${perfilPerro.problemaPrincipal}

        Devuelve tu respuesta con la siguiente estructura exacta:
        {
            "analisis_psicologico": "Explicación breve de por qué hace eso",
            "plan_adiestramiento": ["Paso 1", "Paso 2", "Paso 3"],
            "recomendacion_nutricional": "Calorías sugeridas y tipo de comida ideal"
        }
        `;

        const result = await model.generateContent(prompt);
        const textoJSON = result.response.text();

        // Enviamos la respuesta mágica de vuelta a la web
        res.json(JSON.parse(textoJSON));
        console.log("✅ Respuesta enviada con éxito.");

    } catch (error) {
        console.error("❌ Error del servidor:", error);
        res.status(500).json({ error: "Hubo un problema procesando la consulta canina." });
    }
});

// Usamos el puerto que nos dé Render, o el 3000 si estamos en local
const PUERTO = process.env.PORT || 3000;
app.listen(PUERTO, () => {
    console.log(`🚀 Servidor perruno activo en el puerto ${PUERTO}`);
});