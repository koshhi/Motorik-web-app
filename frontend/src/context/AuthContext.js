import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    // console.log(token)

    if (token) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUser(response.data.user);
        })
        .catch(() => {
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, { email, password });
      localStorage.setItem('authToken', response.data.token); // Guardar el token en localStorage
      setUser(response.data.user);
      navigate('/'); // Redirigir a la home después del login
    } catch (error) {
      console.error('Error logging in', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken'); // Eliminar el token de localStorage

    setUser(null);
    navigate('/');
  };

  const refreshUserData = async () => {
    const token = localStorage.getItem('authToken');

    if (token) {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.user);
      } catch (error) {
        console.error('Error refreshing user data:', error);
        setUser(null);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, setUser, refreshUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
