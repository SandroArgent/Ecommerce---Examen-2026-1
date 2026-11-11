


¿Qué hace un CONTROLADOR?
Un controlador recibe una solicitud HTTP, procesa la información necesaria y devuelve una respuesta.

Por ejemplo, cuando alguien se registra:
Frontend React

-Envía nombre, email y contraseña

Ruta POST /api/auth/register

Recibe la solicitud

authController.js

Valida, genera el hash y crea el cliente

MySQL

Guarda el nuevo cliente


La idea es mantener separadas las responsabilidades:
- routes: define las direcciones y los métodos HTTP.
- controllers: procesa las solicitudes y prepara las respuestas.
- services: contiene funcionalidades reutilizables, como bcrypt.
- models: representa las tablas de la base de datos.



--------------------------------------------------------------------------------------------------------------------



¿QUE HACE UNA RUTA?
La ruta determina qué controlador se ejecuta cuando llega una solicitud HTTP.

POST en app, acordate que app agrega un middeware a la ruta register, se importa la ruta por supuesto.
http://localhost:3000/api/auth/register

Recorrido de la solicitud
Frontend → Express → authRoutes → authController → passwordService / Sequelize → MySQL




Implementar el login de clientes
Entendamos qué debe suceder cuando un cliente intenta iniciar sesión:
1. El frontend envía su correo electrónico y contraseña.
2. El backend busca al cliente en MySQL.
3. Si existe, compara la contraseña ingresada con el hash almacenado mediante bcrypt.
4. Si las credenciales son correctas, genera un token JWT.
5. Devuelve el token al frontend.

El flujo sería:

Frontend

Email + contraseña

authController

Busca al cliente y verifica sus credenciales

bcrypt.compare()

Comprueba la contraseña

JWT

Genera un token de autenticación


Funcionamiento
Imaginá esta situación:
1. Entrás a tu e-commerce con tu correo y contraseña.
2. El backend comprueba que las credenciales son correctas.
3. El backend genera un JWT y se lo entrega al frontend.
4. El frontend guarda ese token.
5. Cuando querés acceder a una ruta protegida, el frontend envía el token.
6. El backend verifica su autenticidad y decide si permite el acceso.
Es decir, el JWT funciona como una credencial temporal de autenticación.

Conclusion

comparePassword() verifica que la contraseña sea correcta.
jwt.sign() genera el token cuando la autenticación fue exitosa.
JWT_SECRET no es la firma en sí misma: es la clave secreta que utiliza el backend para generar y verificar esa firma.
Middleware	Verifica el token en futuras solicitudes.

_______________________________________________________________________________________________________________________________




Crear verifyToken

Hasta ahora, cuando alguien inicia sesión, el servidor le entrega un JWT. Pero todavía nos falta algo fundamental: comprobar ese token cuando el usuario intenta acceder a una ruta protegida.

Imaginá este escenario:
1. Un administrador inicia sesión y recibe un JWT.
2. Intenta acceder a /api/productos.
3. El navegador envía el token al servidor.
4. El servidor debe verificar que sea válido antes de permitir el acceso.
Para eso vamos a crear un middleware llamado verifyToken.
1. ¿Qué es un middleware?
Es una función que se ejecuta durante el recorrido de una petición HTTP, antes de llegar al controlador final.


Recorrido de una petición protegida:

Cliente
Envía petición con JWT

verifyToken
Comprueba la firma y vigencia del JWT


Token válido
Continúa con next()


Token inválido
Responde 401



Express ejecuta los middlewares de izquierda a derecha.

Por ejemplo, si un cliente intenta acceder a /perfil-admin:
1. verifyToken: comprueba su JWT. Es válido.
2. isAdmin: comprueba req.user.type. Encuentra client.
3. Devuelve HTTP 403.
4. getAdminProfile nunca llega a ejecutarse.