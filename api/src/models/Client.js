import { DataTypes } from "sequelize";
import sequelize from "../config/database.js"; // // importante poner js al final para evitar error

const Client = sequelize.define('Client', {  // sequelize.define() Metodo utilizado para definir modelo: Recibe el nombre del modelo y un objeto con sus atributos. Sequelize utilizará esa definición para crear la tabla correspondiente.
    nombre: {
        type: DataTypes.STRING,
        allowNull: false // Significa que esa columna no puede quedar vacía (NULL).
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false, // Significa que esa columna no puede quedar vacía (NULL).
        unique: true // Impide que dos clientes tengan el mismo correo electrónico
    },

    password: { // el campo password almacenará el hash generado con bcryptjs, no la contraseña original
        type: DataTypes.STRING,
        allowNull: false
    }

    

})
export default Client;


/* 
TIPOS:
STRING: texto.
INTEGER: números enteros.
BOOLEAN: verdadero o falso.
DATE: fechas. 
*/

