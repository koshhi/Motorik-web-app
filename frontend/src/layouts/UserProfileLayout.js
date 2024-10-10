import { useState, useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';
import axiosClient from '../api/axiosClient';
import ProfileHeader from '../components/ProfileHeader';
import MainNavbar from '../components/Navbar/MainNavbar';
import useUserProfile from '../hooks/useUserProfile';


const UserProfileLayout = () => {
  const { userId } = useParams();
  const { user, refreshUserData } = useAuth();
  const { profileUser, loadingProfile, errorProfile } = useUserProfile(userId);

  if (loadingProfile) {
    return <LoadingContainer>Cargando perfil...</LoadingContainer>;
  }

  if (errorProfile) {
    return <ErrorContainer>{errorProfile}</ErrorContainer>;
  }

  if (!profileUser) {
    return <ErrorContainer>Perfil no encontrado.</ErrorContainer>;
  }

  return (
    <>
      <MainNavbar />
      <ProfileHeader profileUser={profileUser} user={user} />
      <Outlet context={{ profileUser }} />
    </>
  );
};

export default UserProfileLayout;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const ErrorContainer = styled.div`
  color: red;
  text-align: center;
  margin-top: 20px;
`;
