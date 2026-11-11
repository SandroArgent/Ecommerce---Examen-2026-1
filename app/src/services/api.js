import axios from 'axios';

// Una sola instancia de Axios para toda la aplicación.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' }
});

export default api;
