// Importar las dependencias necesarias
const express = require('express'); // Framework web para manejar rutas y peticiones
const bodyParser = require('body-parser'); // Middleware para manejar datos en JSON
const cors = require('cors'); // Permite el acceso desde diferentes dominios
const questionsRoutes = require('./routes/questionsRoutes');

// Crear la aplicación Express
const app = express();

// Lista de orígenes permitidos
const allowedOrigins = [
    'http://localhost:5173', // Desarrollo local
    'https://skill-evaluator.vercel.app' // Producción
];

// Configurar middleware
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
    allowedHeaders: ['Content-Type', 'Authorization'] // Headers permitidos
}));
app.use(bodyParser.json()); // Permitir recibir datos en formato JSON
app.use(bodyParser.urlencoded({ extended: true })); // Permitir recibir datos en formato URL-encoded

// Ruta inicial para probar el servidor
app.get('/', (req, res) => {
    res.send('¡Servidor funcionando correctamente!');
});

// Configurar puerto
const PORT = process.env.PORT || 3000; // Usar un puerto dinámico o el 3000 por defecto

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
const skillsRoutes = require('./routes/skillsRoutes'); // Importar las rutas
app.use('/api', skillsRoutes); // Usar las rutas con el prefijo '/api'

app.use('/api', questionsRoutes);//usar las rutas con el prefijo api para obterner preguntas
