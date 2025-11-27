import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import peliculasRoutes from './routes/peliculas.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Necesario para poder usar __dirname con ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔹 Servir el frontend desde la carpeta /client
app.use(express.static(path.join(__dirname, '..', 'client')));

// 🔹 Rutas de la API
app.use('/peliculas', peliculasRoutes);

// 🔹 Para que cualquier ruta no API muestre el index.html
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});

// 🔹 Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
