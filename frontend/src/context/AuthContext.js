// context/AuthContext.js

import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true);

  // Estado de Stripe (hasStripeAccount, chargesEnabled, etc.)
  const [stripeStatus, setStripeStatus] = useState({
    hasStripeAccount: false,
    chargesEnabled: false,
    loading: true,
  });

  const navigate = useNavigate();

  /**
   * Carga o refresca la información del usuario logueado (user),
   * llamando a /api/users/profile
   */
  const refreshUserData = useCallback(async () => {
    if (!token) {
      setUser(null);
      return null;
    }

    try {
      const response = await axiosClient.get('/api/users/profile');

      if (response.data.success) {
        const updatedUser = response.data.user;
        setUser(updatedUser);
        return updatedUser;
      } else {
        setUser(null);
        return null;
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
      if (error?.response?.status === 401) {
        // Token no válido o expirado -> cerrar sesión
        localStorage.removeItem('authToken');
        setToken(null);
        setUser(null);
      }
      return null;
    }
  }, [token]);

  /**
   * Refresca el estado de Stripe para saber si
   * hasStripeAccount (true|false) y chargesEnabled (true|false)
   */
  const refreshStripeStatus = useCallback(async (userId) => {
    setStripeStatus(prev => ({ ...prev, loading: true }));
    try {
      const response = await axiosClient.get(`/api/stripe/refresh-account-status?userId=${userId}`);
      setStripeStatus({
        loading: false,
        hasStripeAccount: response.data.hasStripeAccount,
        chargesEnabled: response.data.chargesEnabled,
      });
    } catch (error) {
      console.error('Error fetching Stripe status:', error);
      setStripeStatus({
        loading: false,
        hasStripeAccount: false,
        chargesEnabled: false,
      });
    }
  }, []);

  /**
   * Carga inicial del usuario si hay token en localStorage
   */
  useEffect(() => {
    const init = async () => {
      if (token) {
        await refreshUserData();
      }
      setLoading(false);
    };
    init();
  }, [token, refreshUserData]);

  /**
   * Logging informativo cada vez que cambia `user`
   */
  useEffect(() => {
    if (user) {
      console.log('Usuario en contexto:', user);
    } else {
      console.log('Sin usuario en contexto.');
    }
  }, [user]);

  /**
   * Iniciar sesión por email (Magic Link)
   */
  const login = async (email) => {
    try {
      await axiosClient.post('/api/users/check-or-register', { email });
      toast.success('Revisa tu correo. Se ha enviado un enlace de inicio de sesión.');
    } catch (error) {
      console.error('Error logging in', error);
      toast.error('Error al iniciar sesión.');
    }
  };

  /**
   * Logout
   */
  const logout = async () => {
    try {
      await axiosClient.post('/api/users/logout');
      localStorage.removeItem('authToken');
      setToken(null);
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Error al cerrar sesión.');
    }
  };


  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      token,
      setToken,
      loading,
      login,
      logout,
      refreshUserData,
      stripeStatus,
      refreshStripeStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;

