import axios from 'axios';

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

// Interceptor de solicitud para adjuntar el token de acceso a cada solicitud
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuesta para manejar errores 401 y renovar tokens
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si el error es 401 y no se ha reintentado aún, intentamos refrescar el token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Intentar refrescar el token de acceso
        const { data } = await axiosClient.post('/api/users/refresh-token');
        const newAuthToken = data.authToken;

        // Actualizar el localStorage y los encabezados de solicitud
        localStorage.setItem('authToken', newAuthToken);
        axiosClient.defaults.headers['Authorization'] = `Bearer ${newAuthToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAuthToken}`;

        // Reintentar la solicitud original
        return axiosClient(originalRequest);
      } catch (refreshError) {
        // Si falla la renovación, cerrar sesión del usuario
        localStorage.removeItem('authToken');
        window.location.href = '/signin'; // Redirigir al inicio de sesión
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
