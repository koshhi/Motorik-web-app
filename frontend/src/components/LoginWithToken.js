import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginWithToken = () => {
  const { setUser } = useAuth();  // Obtener la función para actualizar el estado del usuario
  const navigate = useNavigate();

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');
    // const profileFilled = new URLSearchParams(window.location.search).get('profileFilled') === 'true';

    const loginWithToken = async () => {
      try {
        const response = await axios.get(`http://localhost:5002/api/users/login-with-token?token=${token}`);
        localStorage.setItem('authToken', response.data.token);  // Guardar el token
        setUser(response.data.user);  // Actualizar estado del usuario en el AuthContext
        console.log(response.data.user)
        console.log(response.data.user.profileFilled)

        if (!response.data.user.profileFilled) {
          navigate('/complete-profile');
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error logging in with token:', error);
      }
    };

    if (token) {
      loginWithToken();  // Solo ejecutar si hay un token en la URL
    }
  }, [setUser, navigate]);

  return <div>Iniciando sesión...</div>;  // Mensaje mientras se inicia sesión

};

export default LoginWithToken;
