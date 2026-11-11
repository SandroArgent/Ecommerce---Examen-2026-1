import { DataTypes } from "sequelize";
import sequelize from "../config/database.js"; // // importante poner js al final para evitar error

const Product = sequelize.define('Product', {  // sequelize.define() Metodo utilizado para definir modelo: Recibe el nombre del modelo y un objeto con sus atributos. Sequelize utilizará esa definición para crear la tabla correspondiente.
    
    name: {
        type: DataTypes.STRING,
        allowNull: false // Significa que esa columna no puede quedar vacía (NULL).
    },

    price: {
        type: DataTypes.DECIMAL,
        allowNull: false // Significa que esa columna no puede quedar vacía (NULL).
    },

    stock: { 
        type: DataTypes.INTEGER,
        allowNull: false
    },

    category: { 
        type: DataTypes.STRING,
        allowNull: false
    }


    

})
export default Product;

/* 
Float: almacena números con decimales, permitiendo un rango muy amplio y notación científica, pero con precisión limitada
Integer: (int) representa números enteros sin parte decimal
Decimal: (común en lenguajes como C# o Python) también maneja decimales pero utiliza aritmética decimal exacta */