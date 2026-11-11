import 'dotenv/config';
import sequelize from "../config/database.js";
import Admin from '../models/Admin.js'  //para consultar e insertar administradores.
import { hashPassword } from "../services/passwordService.js"; //para guardar contraseñas protegidas, nunca en texto plano

const adminsToCreate = [ // los corchetes definen un array, guarda una lista de elementos ordenados.
    {                    //objeto
        nombre: 'superadministrador',
        email: process.env.SEED_SUPERADMIN_EMAIL,
        password: process.env.SEED_SUPERADMIN_PASSWORD,
        rol: 'superadmin'
    },
    {
        nombre: 'Gestor de productos',
        email: process.env.SEED_GESTOR_EMAIL,
        password: process.env.SEED_GESTOR_PASSWORD,
        rol: 'gestor_productos'
    },
    {
        nombre: 'Auditor',
        email: process.env.SEED_AUDITOR_EMAIL,
        password: process.env.SEED_AUDITOR_PASSWORD,
        rol: 'auditor'
    }
]


const createAdmins = async () =>{
    try{
        //1. Comprobar la conexion de la base de datos
        await sequelize.authenticate(); //authenticate es asincrono
        console.log('Conexión a la base de datos establecida correctamente.');


        //2. Recorrer adminsToCreate usando for...of.
        for (const adminData of adminsToCreate){ //recorrer elementos de una lista (arrays), cadenas de texto, mapas o conjuntos.
            
            //3. Buscar si el administrador ya existe por email
            const existingAdmin = await Admin.findOne({
                where: {email: adminData.email}
            });

            
            //4. Si existe, informar y continuar
            if (existingAdmin){
                console.log('El admin existe');
                continue; //¡IMPORTANTE! saltar a la siguiente interaccion del for. Continue interrumpe la iteración actual y pasa directamente al siguiente elemento del for.

            } 

            //5. Si no existe:
            //    -Hashear su contraseña
            const hashedPassword = await hashPassword(adminData.password);
            const newAdmin = {
                ...adminData, // spread
                password: hashedPassword
            };
            //    -Crear el administrador con Admin.create().
            await Admin.create(newAdmin);
        }
        
    } catch (error){
        console.error('Error durante la creacion de administradores', error)
    } finally {
        //Cerrar la conexion con  sequelize
        await sequelize.close(); //cierra la conexion incluso si ocurre un error.
    }
}

createAdmins();


//El bucle for...of es una de las formas más modernas, limpias y legibles que tiene JavaScript para recorrer elementos de una lista (arrays), cadenas de texto, mapas o conjuntos.

/* //PARA QUE FUNCIONE: 
En api/package.json, agregá este script:
"seed:admins": "node src/seeders/createAdmins.js"
npm run seed:admins */