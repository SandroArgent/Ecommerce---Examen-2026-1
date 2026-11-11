import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="site-header">
      <Link className="brand" to="/">Tienda Musical</Link>

      <nav className="header-actions" aria-label="Navegación principal">
        <Link to="/">Catálogo</Link>
        {isAuthenticated && user?.type === 'admin' && ['superadmin', 'gestor_productos'].includes(user.role) && <Link to="/admin">Administración</Link>}
        {isAuthenticated && <span className="user-label">{user?.nombre} {user?.role ? `· ${user.role}` : ''}</span>}
        <button className="button button-secondary" onClick={toggleTheme} type="button">
          {theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
        </button>
        {isAuthenticated
          ? <button className="button" onClick={handleLogout} type="button">Cerrar sesión</button>
          : <Link className="button" to="/login">Ingresar</Link>}
      </nav>
    </header>
  );
}
