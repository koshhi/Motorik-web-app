// src/hooks/useUserProfile.js

import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const useUserProfile = (userId) => {
  const [profileUser, setProfileUser] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [errorProfile, setErrorProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosClient.get(`/api/users/${userId}`);
        if (response.data.success) {
          setProfileUser(response.data.user);
        } else {
          setErrorProfile('Error al obtener el perfil del usuario.');
        }
      } catch (err) {
        console.error('Error al obtener el perfil:', err);
        setErrorProfile('Error al obtener el perfil. Por favor, intenta de nuevo.');
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [userId]);

  return { profileUser, loadingProfile, errorProfile };
};

export default useUserProfile;
