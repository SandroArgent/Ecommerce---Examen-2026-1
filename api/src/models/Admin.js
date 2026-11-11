import sequelize from "../config/database.js"; // importante poner js al final para evitar error
import { DataTypes } from "sequelize";

const Admin = sequelize.define('Admin',{
    
    nombre:{
        type: DataTypes.STRING,
        allowNull: false
    },

    email: {
        type: DataTypes.STRING,
        allowNull:false,
        unique: true
    },

    password: { // (hasheado con bcryptjs).
        type: DataTypes.STRING,
        allowNull: false
    },

    rol: {
        type: DataTypes.ENUM( // DataTypes.ENUM restringe el valor a una lista de opciones previamente definidas. En nuestro caso, los roles de administrador.
            'superadmin',
            'gestor_productos',
            'auditor'
        ),
        allowNull:false,
        defaultValue: 'auditor' // si no especificamos un rol al crear un administrador, se le asignará automáticamente el rol auditor.
    }



})
export default Admin; //si es asi, para importar solo poner admn sin {}


// Por ejemplo, STRING podría almacenar superadmin, auditor o incluso cualquier_cosa. En cambio, ENUM solamente permite los valores que declaramos.