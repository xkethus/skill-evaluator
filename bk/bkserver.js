// Importar las dependencias necesarias
const express = require('express'); // Framework web para manejar rutas y peticiones
const bodyParser = require('body-parser'); // Middleware para manejar datos en JSON
const cors = require('cors'); // Permite el acceso desde diferentes dominios

// Crear la aplicación Express
const app = express();

// Configurar middleware
app.use(cors({
  origin: 'https://skill-evaluator.vercel.app', // Cambia esta URL al dominio de tu frontend en Vercel
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
  allowedHeaders: ['Content-Type', 'Authorization'] // Headers permitidos
})); // Habilitar CORS para permitir peticiones desde el frontend
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