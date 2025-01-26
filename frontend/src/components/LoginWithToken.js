import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginWithToken = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { refreshUserData, setToken } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const loginWithToken = async () => {
      try {
        const token = new URLSearchParams(location.search).get('token');
        const response = await axiosClient.get(`/api/users/login-with-token?token=${token}`);


        if (response.data.success) {
          // 1. Guardar en localStorage
          localStorage.setItem('authToken', response.data.authToken);

          // 2. También avisa al AuthContext de que hay un token nuevo
          setToken(response.data.authToken);

          // 3. Refresca el usuario en el contexto
          await refreshUserData();

          // 4. Redirige según profileFilled
          if (!response.data.user.profileFilled) {
            navigate('/complete-profile');
          } else {
            navigate('/');
          }
        }
      } catch (error) {
        setError('Error al iniciar sesión');
        console.error('Error:', error);
      }
    };

    loginWithToken();
    // }, [navigate, refreshUserData]);
  }, [navigate, refreshUserData, setToken, location.search]);


  if (error) return <div>{error}</div>;
  return <div>Iniciando sesión...</div>;
};

export default LoginWithToken;
