// En tu archivo de servicios (api.js o similar)
import axios from 'axios';

// Configurar axios base
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

// Interceptor para agregar token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const donacionService = {
  // Donar a la plataforma
  donateToPlatform: (data) => {
    return axios.post('/donacion/registrar', data);
  },
  
  // Confirmar donación
  confirmDonation: (data) => {
    return axios.post('/donacion/confirmar', data);
  },
  
  // Obtener mis donaciones
  getMyDonations: () => {
    return axios.get('/donaciones/mis-donaciones');
  },
  
  // Obtener todas las donaciones (admin)
  getAllDonations: () => {
    return axios.get('/donaciones/todas');
  }
};

export default axios;