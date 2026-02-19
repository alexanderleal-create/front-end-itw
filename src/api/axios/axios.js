import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8002/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {

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
