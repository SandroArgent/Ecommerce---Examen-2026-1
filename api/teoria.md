
AWAIT:
¿Por qué utilizamos await cuando buscamos un cliente o generamos el hash?


Lo que pensaba: Await se usa porque la generacion de contraseña con hash es asincronica, el servidor espera a recibir un argumento como contraseña desde  el front end

Tu razonamiento es correcto respecto a bcrypt, pero hay un detalle: await no espera a recibir la contraseña desde el frontend.

La contraseña ya llegó mediante req.body. Lo que hace await es esperar a que termine una operación asíncrona, como generar el hash o consultar MySQL.

Por ejemplo:
const hashedPassword = await hashPassword(password);


Sin esperar el resultado, podríamos intentar guardar en MySQL una promesa en lugar del hash generado.

También utilizamos await en Client.findOne() y Client.create() porque ambas operaciones interactúan con la base de datos de forma asíncrona.


_____________________________________________________________________________________________________


DESESTRUCTURACION Y USO DEL PARANTECIS Y LAS LLAVES {}:
La razón por la que se usan llaves {} y no paréntesis () es porque req.body es un objeto (un contenedor de datos con clave-valor), y en JavaScript las llaves se utilizan tanto para crear objetos como para extraer propiedades específicas de ellos.

¿Por qué no se usan ()?
Los paréntesis () en JavaScript tienen otros propósitos muy diferentes:

Se usan para llamar funciones (ej. console.log()).

Para agrupar operaciones matemáticas (ej. (2 + 3) * 5).

O para definir los parámetros de una función flecha (ej. (req, res) => {}).

¿Cuando se usan los parentesis?
Los paréntesis en las funciones siempre tienen que ver con el flujo de datos (parámetros o argumentos):

¿Cuando se usan las Llaves {}: 
El cuerpo de la función (el bloque de código): Delimitan el conjunto de instrucciones que la función va a ejecutar por dentro.
Desestructuración en los parámetros (¡Muy útil en Node.js/Express!):

¿Vas a recibir o enviar datos (parámetros/llamadas)?  Usa Paréntesis ( ) ¿Vas a escribir el código interno de la función o desestructurar un objeto que te pasan? Usa Llaves { }


--------------------------------------------------------------------------------------------------------------------

JWT TEORIA:

type: 'admin' identifica la categoría de usuario que inició sesión. Nos permite distinguir un administrador de un cliente.
role: 'auditor' identifica qué permisos tiene ese administrador dentro del sistema

rol es el atributo que definimos en nuestro modelo Sequelize. No tienen que llamarse igual.

_________________________________________________________________________________________________________________

¿Qué es un middleware?

Un middleware (que se traduce como "intermediario") es una función que se ejecuta en el medio del ciclo de vida de una petición HTTP, antes de que esa petición llegue a su destino final (tu controlador o ruta).

La función para verificar un token (generalmente implementada con jwt.verify()) es el "guardia de seguridad" de tu API.
 Su trabajo es comprobar que el token que te envía el cliente es legítimo, no ha sido alterado y sigue vigente. 
 
Vamos a separar las responsabilidades:
Middleware      	Responsabilidad
verifyToken	    Comprueba que el JWT sea válido.
isClient	    Comprueba que el usuario sea cliente.
isAdmin	        Comprueba que el usuario sea administrador

ejemplo:
router.get('/admin/productos', verifyToken, isAdmin, getProducts);

El recorrido será:
1. verifyToken verifica el JWT.
2. isAdmin comprueba req.user.type.
3. Si es administrador, ejecuta next().
4. Si es cliente, devuelve HTTP 403 (Forbidden).
 ¿Por qué 403 y no 401?
- 401 Unauthorized: no está autenticado correctamente.
- 403 Forbidden: está autenticado, pero no tiene autorización para acceder.
 

 ¿CUANDO PUEDO DARME CUENTA DE USAR AWIT O NO?
 Usá await cuando estes ejecutando una operacion que tarda un tiempo en responder y necesite ese resultado para continuar el siguiente codigo. 
  ¿Cuando se usa si o si?
    En funciones que devuelven promesas (es decir, no ocurren de inmediato porque dependen de un agente externo)
¿Cuando NO usar Await?
    No debes usar await con operaciones síncronas, es decir, tareas que JavaScript resuelve de manera instantánea en la memoria de la computadora.

REQUISITO: async 
    Para poder usar await la funcion contenedora debe ser declarada obligatoriamente como async.




GUIA DE METODOS PARA USAR

Si quiero comprobar algo en un lugar especifico, usar findOne( y where:{} )

Si quiero manipular o agregar cosas a un objeto, primero pensar en como hacerlo, en este caso creando una variable nueva y operando con spread ...(los datos) y lo nuevo a agregar.

 */