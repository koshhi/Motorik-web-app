import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginWithToken = () => {
  const { setUser } = useAuth();  // Obtener la función para actualizar el estado del usuario
  const navigate = useNavigate();

  // useEffect(() => {
  //   const token = new URLSearchParams(window.location.search).get('token'); // Obtener el token de la URL

  //   const verifyUser = async () => {
  //     try {
  //       const response = await axios.get(`http://localhost:5002/api/users/verify-email?token=${token}`);
  //       localStorage.setItem('authToken', response.data.token);  // Guardar el token
  //       setUser(response.data.user);  // Actualizar el estado del AuthContext con los datos del usuario
  //       navigate('/');  // Redirigir al home
  //     } catch (error) {
  //       console.error('Error verifying email:', error);
  //       // Aquí puedes manejar el error, por ejemplo, mostrar un mensaje de error al usuario.
  //     }
  //   };

  //   if (token) {
  //     verifyUser();  // Solo se llama si hay un token en la URL
  //   }
  // }, [setUser, navigate]);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');  // Capturar el token de la URL

    const loginWithToken = async () => {
      try {
        const response = await axios.get(`http://localhost:5002/api/users/login-with-token?token=${token}`);
        localStorage.setItem('authToken', response.data.token);  // Guardar el token
        setUser(response.data.user);  // Actualizar estado del usuario en el AuthContext
        navigate('/');  // Redirigir al home
      } catch (error) {
        console.error('Error logging in with token:', error);
      }
    };

    if (token) {
      loginWithToken();  // Solo ejecutar si hay un token en la URL
    }
  }, [setUser, navigate]);

  return <div>Iniciando sesión...</div>;  // Mensaje mientras se inicia sesión


  // return <div>Verificando email...</div>;  // Mostrar un mensaje mientras se verifica
};

export default LoginWithToken;
