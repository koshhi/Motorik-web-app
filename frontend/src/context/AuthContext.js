import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (token) {
        try {
          const response = await axiosClient.get('/api/users/profile');
          if (response.data.success) {
            setUser(response.data.user);
          } else {
            console.error('Error fetching user profile:', response.data.message);
            setUser(null);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setUser(null);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [token]);

  const login = async (email) => {
    try {
      const response = await axiosClient.post('/api/users/check-or-register', { email });
      // Aquí podrías mostrar un mensaje al usuario indicando que se ha enviado el enlace
      alert('Se ha enviado un enlace de inicio de sesión a tu correo electrónico.');
    } catch (error) {
      console.error('Error logging in', error);
    }
  };

  const logout = async () => {
    try {
      await axiosClient.post('/api/users/logout');
      localStorage.removeItem('authToken');
      setToken(null);
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const refreshUserData = async () => {
    if (token) {
      try {
        const response = await axiosClient.get('/api/users/profile');
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

