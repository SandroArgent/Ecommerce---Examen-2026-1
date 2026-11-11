import { Navigate, Route, Routes } from 'react-router-dom';

import { useAuth } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminRoleGuard from './components/AdminRoleGuard.jsx';
import Header from './components/Header.jsx';

import Home from './pages/Home.jsx';
import Products from './pages/Products.jsx';
import AdminProducts from './pages/AdminProducts.jsx';
import Login from './pages/Login.jsx';
import AdminLogin from './pages/AdminLogin.jsx';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="app-shell">
      <Header />

      <Routes>
        {/* Página pública: no requiere iniciar sesión. */}
        <Route path="/" element={<Home />} />

        {/* Formularios de acceso. */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/catalogo" replace /> : <Login />}
        />
        <Route
          path="/admin/login"
          element={isAuthenticated ? <Navigate to="/catalogo" replace /> : <AdminLogin />}
        />

        {/* Todo lo que esté dentro de este grupo requiere sesión. */}
        <Route element={<ProtectedRoute />}>
          <Route path="/catalogo" element={<Products />} />

          {/* Ejemplo de ruta exclusiva para administradores con permisos de gestión. */}
          <Route element={<AdminRoleGuard allowedRoles={['superadmin', 'gestor_productos']} />}>
            <Route path="/admin" element={<AdminProducts />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <footer className="site-footer">
        <span>Tienda Musical · Proyecto Integrador Full Stack</span>
      </footer>
    </div>
  );
}

export default App;
