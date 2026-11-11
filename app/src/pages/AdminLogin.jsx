import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/admin/login', form);
      login(response.data);
      // Superadmin y gestor van directo al panel; el auditor no tiene acceso a /admin.
      const role = response.data.user?.role;
      navigate(['superadmin', 'gestor_productos'].includes(role) ? '/admin' : '/');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'No se pudo iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-layout">
      <form className="auth-card" onSubmit={handleSubmit}>
        <p className="eyebrow">PANEL PRIVADO</p>
        <h1>Administración</h1>
        <p className="muted">Ingresá con las credenciales de administrador.</p>

        <label>
          Email
          <input type="email" autoComplete="username" value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        </label>

        <label>
          Contraseña
          <input type="password" autoComplete="current-password" value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })} required />
        </label>

        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="button button-primary button-full" disabled={loading}>
          {loading ? 'Ingresando...' : 'Ingresar como administrador'}
        </button>

        <div className="auth-footer"><Link to="/login">Volver al acceso de clientes</Link></div>
      </form>
    </main>
  );
}
