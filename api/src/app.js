import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productRoutes.js';

const app = express();

// Middlewares globales
app.use(cors()); // permite gestionar las solicitudes provenientes de otros orígenes, como nuestro futuro frontend React
app.use(express.json()); // : permite interpretar cuerpos de solicitudes que llegan en formato JSON.

app.use('/api/auth', authRoutes); // La direccion final entonces quedaria como http://localhost:3000/api/auth/register (OJO CON AGREGAR UN PUNTO)
//Frontend → Express → authRoutes → authController → passwordService / Sequelize → MySQ
app.use('/api/products', productRoutes);

// Ruta inicial de prueba
app.get('/api/status', (req, res) => { // req de request/peticion: Representa todo lo que el cliente le envía al servidor. Son argumentos.
    res.status(200).json({ // status(200): indica que la solicitud fue exitosa. .json es que se envia en ese formato.
        message: 'API funcionando correctamente'
    });
});

export default app;



/* 
Parametro: recibe un valor en el futuro, va en la definicion de una funcion. Es algo vacio.
Argumento: Un valor real o dato, se le envia a la función cuando se ejecuta.

¿Qué puedes encontrar en req?

req.body: Los datos que el cliente envía en el cuerpo de la petición (por ejemplo, cuando registras un usuario y mandas su email y contraseña en un formulario).
req.params: Los parámetros dinámicos de la URL (por ejemplo, en la ruta /users/:id, req.params.id te da el ID).
req.query: Los parámetros de consulta en la URL (por ejemplo, en /search?q=javascript, req.query.q es "javascript").
req.headers: Las cabeceras HTTP (tokens de autenticación, tipo de contenido, etc.). */