import { Sequelize } from "sequelize";
import 'dotenv/config';

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        logging: false //Controla si Sequelize imprime consultas SQL en consola.
        
    },
);

export default sequelize //Exportamos nuestra instancia para reutilizarla en otros archivos. Ej: Admin, Client
