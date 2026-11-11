import { Router } from 'express';
import {
  registerClient,
  loginClient,
  loginAdmin,
  refreshSession
} from '../controllers/authController.js';
import {
  isAdmin,
  isClient,
  verifyToken,
  authorizeRoles
} from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/register', registerClient);
router.post('/login', loginClient);
router.post('/admin/login', loginAdmin);
router.post('/refresh', refreshSession);

router.get('/test-client', verifyToken, isClient, (req, res) => {
  res.json({ message: 'Acceso autorizado para cliente' });
});

router.get('/test-admin', verifyToken, isAdmin, (req, res) => {
  res.json({ message: 'Acceso autorizado para administrador' });
});

router.get(
  '/test-rbac/consulta',
  verifyToken,
  isAdmin,
  authorizeRoles('superadmin', 'gestor_productos', 'auditor'),
  (req, res) => res.json({ message: 'Acceso autorizado: consulta' })
);

router.post(
  '/test-rbac/productos',
  verifyToken,
  isAdmin,
  authorizeRoles('superadmin', 'gestor_productos'),
  (req, res) => res.json({ message: 'Acceso autorizado: crear productos' })
);

router.delete(
  '/test-rbac/productos/:id',
  verifyToken,
  isAdmin,
  authorizeRoles('superadmin'),
  (req, res) => res.json({ message: 'Acceso autorizado: eliminar producto' })
);

export default router;
