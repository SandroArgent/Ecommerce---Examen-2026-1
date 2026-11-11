/* import { hash } from 'bcryptjs';    
import {
    hashPassword,
    comparePassword
} from './src/services/passwordService.js';


const probarPassword = async () => { // funciono de prueba de password
    const password ='miPassword123';  //definimos la clave

    const hash = await hashPassword(password) //esto hashea la password

    console.log('hash generado:', hash)


const resultadoCorrecto = await comparePassword( //acá estoy guardando el resultado en una variable y haciendo un llamado a la funcion
    password,
    hash //le estoy pasando el argumento hash, o sea contraseña hasheada al parametro hashedpassword
);

const resultadoIncorrecto = await comparePassword(
    'otraPassword',
    hash
);

console.log ('Contraseña Correcta', resultadoCorrecto);
console.log ('Contraseña Incorrecta', resultadoIncorrecto);
};

probarPassword(); */




/* 
Aunque ambas contraseñas sean idénticas, los hashes serán diferentes.
El Salt es un valor aleatorio que se incorpora al proceso de generación del hash. Su finalidad es evitar que dos usuarios con la misma contraseña tengan necesariamente el mismo hash almacenado. */