//Este arcbivo esta dentro de service para funcionalidades reutilizables, aqui definimos el  bcrypt.

import bcrypt from  'bcryptjs' 

const SALT_ROUND = 10; //costo computacional utilizado por bcrypt, cuanto mayor el valor, mas trabajo en generar y verificar un hash.

export const hashPassword = async (password) => { // Recibe una contraseña y devuelve su hash.
    return await bcrypt.hash(password, SALT_ROUND);
};

export const comparePassword = async (password, hashedPassword) => { //Recibe la contraseña ingresada y el hash almacenado y verifica si coincide
    return await bcrypt.compare(password, hashedPassword) //el compare aqui toma la clave y extra la salt y los parametros ocultos dentro de hashedPassword
}



/* 
Aunque ambas contraseñas sean idénticas, los hashes serán diferentes.
El Salt es un valor aleatorio que se incorpora al proceso de generación del hash.
Su finalidad es evitar que dos usuarios con la misma contraseña tengan necesariamente el mismo hash almacenado. */