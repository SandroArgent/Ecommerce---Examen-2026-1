import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import api from '../services/api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Se recupera la sesión al iniciar o actualizar el navegador.
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('accessToken'));
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem('refreshToken'));
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null;
    } catch {
      return null;
    }
  });

  const logout = useCallback(() => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    delete api.defaults.headers.common.Authorization;
  }, []);

  const login = useCallback((session) => {
    const newAccessToken = session.accessToken || session.token;
    const newRefreshToken = session.refreshToken;

    if (!newAccessToken) {
      throw new Error('El servidor no devolvió un access token.');
    }

    const sessionUser = session.user || session.admin || session.client || null;

    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken || null);
    setUser(sessionUser);

    localStorage.setItem('accessToken', newAccessToken);
    if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken);
    localStorage.setItem('user', JSON.stringify(sessionUser));
    api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
  }, []);

  // Mantiene Axios sincronizado con el token actual.
  useEffect(() => {
    if (accessToken) {
      api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    } else {
      delete api.defaults.headers.common.Authorization;
    }
  }, [accessToken]);

  // Si una petición devuelve 401, intentamos renovar el access token una sola vez.
  useEffect(() => {
    const interceptorId = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          error.response?.status === 401 &&
          originalRequest &&
          !originalRequest._retry &&
          refreshToken &&
          !originalRequest.url?.includes('/auth/refresh')
        ) {
          originalRequest._retry = true;

          try {
            const response = await api.post('/auth/refresh', { refreshToken });
            const session = response.data;

            setAccessToken(session.accessToken);
            setRefreshToken(session.refreshToken);
            setUser(session.user);

            localStorage.setItem('accessToken', session.accessToken);
            localStorage.setItem('refreshToken', session.refreshToken);
            localStorage.setItem('user', JSON.stringify(session.user));

            originalRequest.headers.Authorization = `Bearer ${session.accessToken}`;
            return api(originalRequest);
          } catch (refreshError) {
            logout();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => api.interceptors.response.eject(interceptorId);
  }, [refreshToken, logout]);

  // En el primer montaje, si hay refresh token pero no access token,
  // el interceptor renovará la sesión cuando una petición lo necesite.
  const value = useMemo(() => ({
    accessToken,
    refreshToken,
    user,
    isAuthenticated: Boolean(accessToken && user),
    login,
    logout
  }), [accessToken, refreshToken, user, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe utilizarse dentro de AuthProvider.');
  return context;
};
