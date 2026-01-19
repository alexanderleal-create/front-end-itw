import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8002/',
  withCredentials: true, // 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado - las cookies no son válidas
      sessionStorage.removeItem('user');
      localStorage.removeItem('token_exp');
      
      // Redirigir al login solo si no estamos ya ahí
      if (window.location.pathname !== '/auth/boxed-signin') {
        window.location.href = '/auth/boxed-signin';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
