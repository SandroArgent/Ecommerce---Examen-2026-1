import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [registerMode, setRegisterMode] = useState(false);
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (registerMode) {
        await api.post('/auth/register', {
          nombre,
          email: form.email,
          password: form.password
        });
      }

      const response = await api.post('/auth/login', form);
      login(response.data);
      navigate('/');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'No se pudo completar la operación.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-layout">
      <form className="auth-card" onSubmit={handleSubmit}>
        <p className="eyebrow">TIENDA MUSICAL</p>
        <h1>{registerMode ? 'Crear cuenta' : 'Bienvenido'}</h1>
        <p className="muted">{registerMode ? 'Registrate para acceder al catálogo.' : 'Ingresá con tu cuenta de cliente.'}</p>

        {registerMode && (
          <label>
            Nombre
            <input value={nombre} onChange={(event) => setNombre(event.target.value)} required />
          </label>
        )}

        <label>
          Email
          <input type="email" autoComplete="email" value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        </label>

        <label>
          Contraseña
          <input type="password" autoComplete={registerMode ? 'new-password' : 'current-password'}
            minLength={registerMode ? 8 : undefined} value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })} required />
        </label>

        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="button button-primary button-full" disabled={loading}>
          {loading ? 'Procesando...' : registerMode ? 'Registrarme' : 'Iniciar sesión'}
        </button>

        <button className="text-button" type="button" onClick={() => { setRegisterMode(!registerMode); setError(''); }}>
          {registerMode ? 'Ya tengo una cuenta' : 'Crear una cuenta'}
        </button>

      </form>
    </main>
  );
}
