/* La función para verificar un token (generalmente implementada con jwt.verify()) es el "guardia de seguridad" de tu API.
 Su trabajo es comprobar que el token que te envía el cliente es legítimo, no ha sido alterado y sigue vigente.
 
 Un middleware (que se traduce como "intermediario") es una función que se ejecuta en el medio del ciclo de vida de una petición HTTP, antes de que esa petición llegue a su destino final (tu controlador o ruta).
 */
import jwt from 'jsonwebtoken';






export const verifyToken = (req, res, next) => { //Verifica el JWT y guarda el payload en req.user.
    
    try{
        // 1. Obtener encabezado
        const authHeader = req.headers.authorization;
        

        // 2. Comprobar que exista y tenga Bearer
        if (!authHeader || !authHeader.startsWith('Bearer ')) { //!authHeader: comprueba que el encabezado no esté ausente.   .startsWith('Bearer '): comprueba que comience con el esquema esperado.
            return res.status(401).json({
            message: 'Token no proporcionado'
        });
        }

        // 3. Extraer token (Ya vimos que esto separa Bearer del JWT.)
        const token = authHeader.split(' ')[1]; //slip me divide en un array de dos partes, 0 y 1, justo por donde hay un espacio. En este caso sacamos en Bearer y el token.
        
        
        // 4. Verificar JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // jwt.verify() comprueba: Que la firma del token sea válida. Que haya sido firmado con nuestra clave secreta. Que no haya expirado.
            /* Si todo está correcto, devuelve el contenido del payload decodificado.
                ej:
                {
                    id: 5,
                    type: 'admin',
                    role: 'auditor',
                    iat: 1794200000,
                    exp: 1794203600
                }
                    decoded contiene los datos que recuperamos del JWT mediante jwt.verify(), cuando Express ejecute posteriormente isAdmin, puede acceder a estos datos.
 */


        // 5. Guardar payload en req.user
        req.user = decoded;                         //Estamos guardando los datos del usuario dentro del objeto req, para que los siguientes middlewares y controladores puedan acceder a ellos.
        /*  Mas adelante podemos hacer:
            req.user.type
            req.user.role
            req.user.id

 */
        // 6. Continua.               en express podriamos tener esta ruta:  router.get('/productos', verifyToken, getProducts); 
        next();                      // Entonces: Esto le indica a Express que puede continuar con el siguiente middleware o controlador.


        //verifyToken es el guardia de seguridad de un edificio. next() es permitir que la persona continúe hacia el siguiente sector. No la transporta fuera del edificio.

    } catch (error){
        console.log('Error al verificar el token:', error) // Y utilizar console.error() para registrar el error.
        return res.status(401).json({
            message: 'Token inválido o expirado'
        })
    }
}





//Arriba, anteriormente decoded contiene los datos que recuperamos del JWT mediante jwt.verify()
// Luego guardamos los datos del usuario dentro del objeto req que es usado aqui

export const isClient = (req, res, next) =>{  //	Permite continuar solamente a clientes.
    //Comprobar que req.user.type sea 'client'
    
    if(!req.user || req.user.type !== 'client'){ //si el tipo es diferente de client" es usar !==
       return res.status(403).json({ //403 Forbidden: está autenticado, pero no tiene autorización para acceder.
            message: 'Acceso denegado'
        })  
    }
    // 3. Si todo está bien, pasamos a la siguiente función
    next();

}





export const isAdmin = (req, res, next) =>{ // Permite continuar solamente a administradores.
    // Comprobar que req.user.type sea 'admin'
    if(!req.user || req.user.type !== 'admin'){
        return res.status(403).json({
            message: 'Acceso denegado'
        })
    }
    next();
}



export const authorizeRoles = (...allowedRoles) =>{ // ...allowedRoles: es el operador rest. Permite recibir una cantidad variable de argumentos. (Los roles de admin) Es una variable vacia que recibe y guarda como array.


    return (req, res, next) =>{
        //comprobamos si el usuario  tiene un rol type permitido. 
        if (!req.user || req.user.type !== 'admin'){
            return res.status(403).json({
                message: 'Acceso denegado'
            })
        }
        // . Validamos si el rol NO está incluido en los permitidos
        if (!allowedRoles.includes(req.user.role)){ //includes() comprueba si un elemento existe dentro de un array. comprueba si req.user.role está dentro de allowedRoles
            return res.status(403).json({
                message: 'Acceso denegado'
            })
            
        } // Si pasa ambas validaciones, continúa con la ejecución
        return next();
    }
}


/* 
Entender el encabezado HTTP (headers) es fundamental para comprender cómo funciona JWT.

¿Qué es un encabezado HTTP?
Cuando un cliente (por ejemplo, nuestro frontend React o Postman) envía una petición al servidor, no solamente envía datos como el email y la contraseña.
También envía información adicional sobre esa petición. Esa información se denomina encabezados HTTP (HTTP Headers).

Por ejemplo, imaginá que React realiza esta petición:
GET /api/productos HTTP/1.1
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
Content-Type: application/json


Cada línea tiene una función:     (El encabezado que nos interesa es Authorization.)

Encabezado	                Función
Host	                Indica a qué servidor se dirige la petición.
Authorization	        Transporta las credenciales de autenticación, en nuestro caso el JWT.
Content-Type	        Indica el formato de los datos enviados.



El flujo de esto:

¿Por qué enviamos el JWT en el encabezado?
Recordá lo que hicimos en loginClient() y loginAdmin().

uando el usuario inicia sesión correctamente, el backend genera un JWT y se lo devuelve:

        return res.status(200).json({
            message: 'Inicio de sesión exitoso',
            token
        });

Ahora React tiene ese token. Cuando quiere acceder a una ruta protegida, debe enviárselo nuevamente al backend.

Por convención, utilizamos este formato: 
                                                                                
        Authorization: Bearer TU_TOKEN


Authorization: nombre del encabezado.
Bearer: indica el esquema de autenticación utilizado. En este caso, significa que estamos enviando un token de acceso.
 


¿Cómo lo recibe Express?
Express pone los encabezados recibidos a nuestra disposición mediante: req.headers
Y podemos acceder específicamente al encabezado de autorización así: req.headers.authorization

Por ejemplo, si React envió: Authorization: Bearer abc123 entonces req.headers.authorization y nos devuelve Bearer abc123 
¡Importante! Express normaliza los nombres de los encabezados a minúsculas, por eso usamos authorization.

_____________________________________________________________________________________________________________________________
IMPORTANTE:
Si un usuario inicia sesion y entra a una ruta de admin
verifyToken NO bloquearía al cliente por ser cliente. Lo dejaría pasar porque su JWT es válido. 
Por las siguientes razones: verifyToken solamente comprueba
Que el token exista.
Que su firma sea válida.
Que no haya expirado.
No comprueba si el usuario es cliente o administrador.
Ahí es donde entra isAdmin.

    Vamos a separar las responsabilidades:
Middleware      	Responsabilidad
verifyToken	    Comprueba que el JWT sea válido.
isClient	    Comprueba que el usuario sea cliente.
isAdmin	        Comprueba que el usuario sea administrador
 
_____________________________________________________________________________________________________________________________________

Al finalizar, 
Conectar los middlewares con las rutas
Ahora vamos a comprobar cómo trabajan juntos.

Ejemplos:
router.get('/perfil-cliente', verifyToken, isClient, getClientProfile);

router.get('/perfil-admin', verifyToken, isAdmin, getAdminProfile);

__________________________________________________________________________________________________________________________________________

ROLES DE ADMIN:
Se hace dentro de una funcion y no individual
Con un middleware dinámico evitamos crear funciones como:
- isSuperAdmin()
- isGestorProductos()
- isAuditor()
Tendremos una sola función que recibe los roles permitidos y comprueba si el administrador tiene alguno de ellos.


AutorizeRole

Asi se vería la ruta y autorizerole recibe los argumentos.
router.delete(
    '/productos/:id',
    verifyToken,
    isAdmin,
    authorizeRoles('superadmin', 'gestor_productos'),
    deleteProduct
);


Basicamente allowroles descargar los roles que le pasamos como argumento en app, usando authorizeRole('argumeneto', argumento)
Luego includes verifica si ese argumento (que es un rol) existe en el usuario que está autenticado e intentando acceder a la ruta. 

allowedRoles agrupa los roles que le pasamos como argumentos cuando configuramos el middleware en las rutas.
includes() comprueba si el rol del administrador autenticado (req.user.role) existe dentro de ese conjunto de roles permitidos
*/
