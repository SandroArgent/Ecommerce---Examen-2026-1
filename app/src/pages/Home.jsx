import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Página de inicio simple y responsive.
export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <main className="page-container home-content">
      <h1>Tienda Musical</h1>
      <p>Consultá nuestro catálogo de instrumentos y accesorios.</p>
      <Link className="button button-primary" to={isAuthenticated ? '/catalogo' : '/login'}>
        {isAuthenticated ? 'Ver catálogo' : 'Ingresar'}
      </Link>
    </main>
  );
}
