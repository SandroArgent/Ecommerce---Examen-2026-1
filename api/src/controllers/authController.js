import { Client, Admin } from '../models/index.js';
import { hashPassword, comparePassword } from '../services/passwordService.js';
import jwt from 'jsonwebtoken';

// Access token: se envía en Authorization y dura poco.
// Refresh token: permite obtener un nuevo access token sin volver a pedir credenciales.
const createAccessToken = (payload) => jwt.sign(
  payload,
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
);

const createRefreshToken = (payload) => {
  if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error('Falta configurar JWT_REFRESH_SECRET en api/.env');
  }

  return jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
};

const sendSession = (res, identity, user) => {
  const accessToken = createAccessToken(identity);
  const refreshToken = createRefreshToken(identity);

  return res.status(200).json({
    message: 'Inicio de sesión exitoso',
    accessToken,
    token: accessToken, // Alias para mantener compatibilidad con clientes que esperaban `token`.
    refreshToken,
    user
  });
};

// Registro público de clientes.
export const registerClient = async (req, res) => {
  try {
    const { nombre, email, password } = req.body ?? {};

    if (!nombre?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ message: 'Nombre, email y contraseña son obligatorios' });
    }

    if (String(password).length < 8) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingClient = await Client.findOne({ where: { email: normalizedEmail } });

    if (existingClient) {
      return res.status(409).json({ message: 'El correo electrónico ya está registrado' });
    }

    const newClient = await Client.create({
      nombre: nombre.trim(),
      email: normalizedEmail,
      password: await hashPassword(password)
    });

    return res.status(201).json({
      message: 'Cliente registrado correctamente',
      client: {
        id: newClient.id,
        nombre: newClient.nombre,
        email: newClient.email
      }
    });
  } catch (error) {
    console.error('Error al registrar cliente:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const loginClient = async (req, res) => {
  try {
    const { email, password } = req.body ?? {};
    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
    }

    const client = await Client.findOne({ where: { email: email.trim().toLowerCase() } });
    if (!client || !(await comparePassword(password, client.password))) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    return sendSession(res, {
      id: client.id,
      type: 'client'
    }, {
      id: client.id,
      nombre: client.nombre,
      email: client.email,
      type: 'client'
    });
  } catch (error) {
    console.error('Error al iniciar sesión de cliente:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body ?? {};
    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
    }

    const admin = await Admin.findOne({ where: { email: email.trim().toLowerCase() } });
    if (!admin || !(await comparePassword(password, admin.password))) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    return sendSession(res, {
      id: admin.id,
      type: 'admin',
      role: admin.rol
    }, {
      id: admin.id,
      nombre: admin.nombre,
      email: admin.email,
      type: 'admin',
      role: admin.rol
    });
  } catch (error) {
    console.error('Error al iniciar sesión de administrador:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Verifica el refresh token y emite un nuevo par de tokens.
export const refreshSession = async (req, res) => {
  try {
    const { refreshToken } = req.body ?? {};
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token no proporcionado' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const identity = { id: decoded.id, type: decoded.type };

    if (decoded.type === 'admin') identity.role = decoded.role;

    // Comprobamos que la cuenta siga existiendo.
    const account = decoded.type === 'admin'
      ? await Admin.findByPk(decoded.id)
      : decoded.type === 'client'
        ? await Client.findByPk(decoded.id)
        : null;

    if (!account) {
      return res.status(401).json({ message: 'La cuenta ya no existe' });
    }

    const user = decoded.type === 'admin'
      ? { id: account.id, nombre: account.nombre, email: account.email, type: 'admin', role: account.rol }
      : { id: account.id, nombre: account.nombre, email: account.email, type: 'client' };

    return res.status(200).json({
      accessToken: createAccessToken(identity),
      refreshToken: createRefreshToken(identity),
      user
    });
  } catch (error) {
    return res.status(401).json({ message: 'Refresh token inválido o expirado' });
  }
};
