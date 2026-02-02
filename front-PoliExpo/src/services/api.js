import axios from 'axios';

// URL base de tu API - usa la variable de entorno que ya tienes configurada
const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api';

// Configuración base de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos de timeout
});

// Interceptor para agregar token automáticamente a todas las peticiones
api.interceptors.request.use((config) => {
  const storedUser = JSON.parse(localStorage.getItem('auth-token'));
  
  if (storedUser?.state?.token) {
    config.headers.Authorization = `Bearer ${storedUser.state.token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor para manejar respuestas de error
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el token expiró o no es válido
    if (error.response?.status === 401) {
      // Puedes redirigir al login o limpiar el storage aquí
      localStorage.removeItem('auth-token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/* =========================
   SERVICIOS DE AUTENTICACIÓN
========================= */
export const authService = {
  // Registro tradicional
  register: (userData) => api.post('/registro', userData),
  
  // Login tradicional
  login: (email, password) => api.post('/login', { email, password }),
  
  // Google OAuth (redirección)
  googleAuth: () => {
    window.location.href = `${API_URL}/auth/google`;
  },
  
  // Obtener perfil del usuario
  getProfile: () => api.get('/perfil'),
  
  // Actualizar perfil
  updateProfile: (id, data) => api.put(`/actualizarperfil/${id}`, data),
  
  // Actualizar contraseña
  updatePassword: (id, data) => api.put(`/actualizarpassword/${id}`, data),
  
  // Recuperar contraseña
  forgotPassword: (email) => api.post('/recuperarpassword', { email }),
  
  // Verificar token de recuperación
  verifyResetToken: (token) => api.get(`/recuperarpassword/${token}`),
  
  // Restablecer contraseña
  resetPassword: (token, data) => api.post(`/nuevopassword/${token}`, data),
  
  // Confirmar email
  confirmEmail: (token) => api.get(`/confirmar/${token}`),
};

/* =========================
   SERVICIOS DE PROYECTOS
========================= */
export const proyectoService = {
  // Obtener todos los proyectos
  getAll: () => api.get('/proyectos'),
  
  // Obtener proyecto por ID
  getById: (id) => api.get(`/proyecto/${id}`),
  
  // Crear nuevo proyecto
  create: (data) => api.post('/proyecto/registro', data),
  
  // Actualizar proyecto
  update: (id, data) => api.put(`/proyecto/actualizar/${id}`, data),
  
  // Eliminar proyecto
  delete: (id) => api.delete(`/proyecto/eliminar/${id}`),
  
  // Dar like a proyecto
  like: (id) => api.post(`/proyecto/like/${id}`),
  
  // Quitar like de proyecto
  unlike: (id) => api.delete(`/proyecto/like/${id}`),
  
  // Agregar comentario
  addComment: (id, comment) => 
    api.post(`/proyecto/comentario/${id}`, { comentario: comment }),
  
  // Buscar proyectos
  search: (query) => api.get(`/proyectos/buscar?q=${encodeURIComponent(query)}`),
  
  // Proyectos destacados
  destacados: () => api.get('/proyectos/destacados'),
  
  // Proyectos por categoría
  porCategoria: (categoria) => api.get(`/proyectos/categoria/${categoria}`),
  
  // Proyectos por carrera
  porCarrera: (carrera) => api.get(`/proyectos/carrera/${carrera}`),
  
  // Obtener proyectos del usuario actual
  getMyProjects: () => api.get('/proyectos'),
};

/* =========================
   SERVICIOS DE DONACIONES
========================= */
export const donacionService = {
  // Donar a la plataforma
  donateToPlatform: (data) => api.post('/donacion/registrar', data),
  
  // Confirmar donación pendiente
  confirmDonation: (data) => api.post('/donacion/confirmar', data),
  
  // Obtener mis donaciones
  getMyDonations: () => api.get('/donaciones/mis-donaciones'),
  
  // Obtener todas las donaciones (admin)
  getAllDonations: () => api.get('/donaciones/todas'),
  
};

/* =========================
   SERVICIOS DE DASHBOARD
========================= */
export const dashboardService = {
  // Dashboard para administrador
  getAdminDashboard: () => api.get('/dashboard/admin'),
  
  // Dashboard para estudiante
  getStudentDashboard: () => api.get('/dashboard/estudiante'),
};

/* =========================
   SERVICIOS DE IA
========================= */
export const iaService = {
  // Sugerir títulos para proyectos
  suggestTitles: (data) => api.post('/ia/sugerir-titulos', data),
};

/* =========================
   SERVICIOS DE MENSAJES
========================= */
export const mensajeService = {
  // Obtener mensajes de un proyecto
  getByProject: (proyectoId) => api.get(`/${proyectoId}`),
  
  // Enviar mensaje a un proyecto
  sendMessage: (proyectoId, contenido) => 
    api.post(`/${proyectoId}`, { contenido }),
};

/* =========================
   SERVICIOS DE PUBLICACIONES
   (Compatibilidad con tu código existente)
========================= */
export const publicacionService = {
  // Registrar publicación
  register: (data) => {
    // Convertir FormData si es necesario
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return api.post('/publicacion/registro', data, config);
  },
  
  // Listar publicaciones
  list: () => api.get('/publicaciones'),
  
  // Obtener detalle de publicación
  getById: (id) => api.get(`/publicacion/${id}`),
  
  // Actualizar publicación
  update: (id, data) => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return api.put(`/publicacion/actualizar/${id}`, data, config);
  },
  
  // Eliminar publicación
  delete: (id, data) => api.delete(`/publicacion/eliminar/${id}`, { data }),
};

/* =========================
   SERVICIOS DE RECONOCIMIENTO FACIAL
========================= */
export const reconocimientoService = {
  // Reconocer rostro
  reconocer: (image) => api.post('/reconocer', { image }),
};

export default api;