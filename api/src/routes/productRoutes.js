import { Router } from 'express';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import {
  verifyToken,
  isAdmin,
  authorizeRoles
} from '../middlewares/authMiddleware.js';

const router = Router();

// Lectura pública del catálogo.
router.get('/', getProducts);

// Superadmin y gestor pueden crear y editar productos.
router.post('/', verifyToken, isAdmin, authorizeRoles('superadmin', 'gestor_productos'), createProduct);
router.put('/:id', verifyToken, isAdmin, authorizeRoles('superadmin', 'gestor_productos'), updateProduct);

// Solamente superadmin puede eliminar.
router.delete('/:id', verifyToken, isAdmin, authorizeRoles('superadmin'), deleteProduct);

export default router;
