import 'dotenv/config';
import app from './src/app.js';
import sequelize from './src/config/database.js';  // importante poner js al final para evitar error
import './src/models/index.js'

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await sequelize.authenticate(); //sequelize.authenticate() comprueba que exista conexión con MySQL.

        console.log('Conexión a MySQL establecida correctamente');

        await sequelize.sync();
        console.log('Modelos sincronizados correctamente')

        app.listen(PORT, () => {
            console.log(`Servidor funcionando en puerto ${PORT}`);
        });

    } catch (error) {
        console.error('Error al conectar con MySQL:', error.message);
    }
};

startServer ();


/*
¿Cual es la diferencia entre app e index?
app (La configuracion): guarda las rutas globales y configura el servidor de express, su estructura. Se configura los middlewaves para leer Json. Configura las rutas globales. 
    mientras que
index (El arranque):escucha los puertos y lee las variables de entorno. importa app ya configurado.


sequelize.authenticate() comprueba que exista conexión con MySQL.
sequelize.sync() sincroniza los modelos con la base de datos y crea las tablas que todavía no existen.


importaciones sin variables:
Le indica a Node.js que ejecute todo el código que está dentro de ese archivo index.js, pero sin importar ninguna variable o función específica a tu archivo actual
*/