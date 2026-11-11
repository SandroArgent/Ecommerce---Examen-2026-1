import Client from "./Client.js"; //el export default individual se importa sin {}
import Admin from "./Admin.js";
import Product from "./Product.js";


export {
    Client,
    Admin,
    Product
};

/* 
Centralizamos las exportaciones. En lugar de importar cada modelo desde su archivo individual, podremos importarlos desde models/index.js */