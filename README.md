# E-commerce Full Stack — Proyecto de examen

Proyecto dividido en dos aplicaciones: API REST (Express + Sequelize + MySQL) y cliente web (React + Vite).

## Requisitos

- Node.js 20.19+ (recomendado Node 22).
- MySQL en ejecución.
- Una base de datos local para el proyecto.

## Configuración inicial

### 1. Backend

```bash
cd api
npm install
```

Copiar `.env.example` como `.env` y completar los datos de MySQL, los secretos JWT y las credenciales de los administradores de prueba. No subir `.env` a Git.

Crear la base de datos indicada en `DB_NAME` en MySQL. Luego:

```bash
npm run seed:admins
npm run dev
```

La API queda disponible en `http://localhost:3000`. Comprobar `http://localhost:3000/api/status`.

### 2. Frontend

En otra terminal:

```bash
cd app
npm install
```

Copiar `.env.example` como `.env`. El valor por defecto es:

```env
VITE_API_URL=http://localhost:3000/api
```

Iniciar Vite:

```bash
npm run dev
```

Abrir la URL que informa Vite (normalmente `http://localhost:5173`).

## Funcionalidades incluidas

- Registro e inicio de sesión de clientes.
- Inicio de sesión de administradores.
- JWT de acceso y refresh token con renovación automática ante una respuesta 401.
- Persistencia de sesión en el navegador.
- Middleware de autenticación y autorización por roles.
- Roles `superadmin`, `gestor_productos` y `auditor`.
- CRUD de productos protegido por rol en la API.
- Catálogo React con búsqueda, categoría, ordenamiento y paginación del servidor.
- Componentes separados por responsabilidad.
- Contexto global de autenticación y contexto de tema claro/oscuro.
- Página de inicio responsive y rutas protegidas.

## Rutas principales

| Método | Ruta | Acceso |
|---|---|---|
| POST | `/api/auth/register` | Público |
| POST | `/api/auth/login` | Público |
| POST | `/api/auth/admin/login` | Público |
| POST | `/api/auth/refresh` | Refresh token |
| GET | `/api/products` | Público |
| POST | `/api/products` | Admin: superadmin / gestor_productos |
| PUT | `/api/products/:id` | Admin: superadmin / gestor_productos |
| DELETE | `/api/products/:id` | Admin: superadmin |

## Consideraciones de seguridad

Este proyecto es una implementación didáctica para el examen. El refresh token se guarda en `localStorage` para simplificar la integración y demostrar el flujo; en producción conviene usar una cookie `HttpOnly`, `Secure`, `SameSite` y un mecanismo de revocación/rotación persistido en el servidor. Los secretos y credenciales reales deben permanecer únicamente en el `.env` local.
