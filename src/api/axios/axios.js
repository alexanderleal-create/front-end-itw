import axios from "axios";

const api=axios.create({
    baseURL: 'http://localhost:8002/',
    withCredentials: true,
});

api.interceptors.request.use(
    response => response,     
    error => {const config = error.config;
        if (config && config.meta  && config.meta.triggeredByButton) {
    console.log('Error lanzado desde el botón → no mostrar alerta global');
      return Promise.reject(error); // Lo dejamos para que lo maneje el componente
    }
    
    else{ if(error.response && error.response.status === 401) {
    
      window.dispatchEvent(new CustomEvent('unauthorized',{detail:{mensaje:'No estás autorizado. Por favor, inicia sesión.'}})); // igual a cont event = new customEvent('Nombre del evento){ detail}
    }}
    return Promise.reject(error);
    }
);

export default api;