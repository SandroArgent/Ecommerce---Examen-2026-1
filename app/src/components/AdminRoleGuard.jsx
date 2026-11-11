import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Recibe los roles que pueden acceder a las rutas hijas.
export default function AdminRoleGuard({ allowedRoles = [] }) {
  const { user } = useAuth();

  if (user?.type !== 'admin') return <Navigate to="/" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;

  return <Outlet />;
}
