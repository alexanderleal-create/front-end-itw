import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8002/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ================= REQUEST =================
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ================= RESPONSE =================
api.interceptors.response.use(
  (response) => response,
  (error) => {

    // Rutas que usan 401 como respuesta normal (no son sesión expirada)
    const ignorar401 = [
      'itwframe/',           // login
      'password-reset',      // recuperación de contraseña
      'password-reset-confirm', // confirmación de nueva contraseña
    ];

    const url = error.config?.url || '';
    const es401 = error.response?.status === 401;
    const esRutaIgnorada = ignorar401.some(ruta => url.includes(ruta));

    if (es401 && !esRutaIgnorada) {
      sessionStorage.removeItem('user');
      localStorage.removeItem('token_exp');

      if (window.location.pathname !== '/auth/boxed-signin') {
        window.location.href = '/auth/boxed-signin';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
