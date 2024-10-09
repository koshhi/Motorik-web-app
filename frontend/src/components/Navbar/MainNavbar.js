import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../Button/Button';
import AccountDropdown from '../AccountDropdown';
import { useAuth } from '../../context/AuthContext';

const MainNavbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const isAuthenticated = !!user;

  const handleCreateEvent = () => {
    if (isAuthenticated) {
      navigate('/create-event'); // Redirigir a la página de creación de eventos si está autenticado
    } else {
      navigate('/signin'); // Redirigir al login si no está autenticado
    }
  };

  return (
    <Topbar>
      {isAuthenticated ? (
        <div className='container'>
          <Link to="/" >
            <img src='/motorik-logo.svg' alt="Motorik Logo" />
          </Link>
          <NavLinks>
            <Link to="/" className='NavLink'>
              <img src='/icons/find-plan.svg' alt="Encuentra Plan" /><p>Encuentra Plan</p>
            </Link>
            <Link to="/" className='NavLink'>
              <img src='/icons/my-calendar.svg' alt="Mi Calendario" /><p>Calendario</p>
            </Link>
            <Link to="/my-events" className='NavLink'>
              <img src='/icons/my-events.svg' alt="Mis Eventos" /><p>Mis Eventos</p>
            </Link>
            {user && (
              <Link to={`/user/${user.id}`} className='NavLink'>
                <img src='/icons/my-profile.svg' alt="Mi Perfil" /><p>Mi Perfil</p>
              </Link>
            )}
          </NavLinks>
          <ActionsContainer>
            <Button size="small" $variant="defaultInverse" onClick={handleCreateEvent}>Crear evento</Button>
            <AccountDropdown userAvatar={user.userAvatar} />
          </ActionsContainer>
        </div>
      ) : (
        <div className='container'>
          <Link to="/" >
            <img src='/motorik-logo.svg' alt="Motorik Logo" />
          </Link>
          <ActionsContainer>
            <Button size="small" $variant="defaultInverse" onClick={handleCreateEvent}>Crear evento</Button>
            <Link to="/signin"><Button size="small" $variant="outlineInverse">Entra o únete</Button></Link>
          </ActionsContainer>
        </div>
      )}
    </Topbar>
  );
};

export default MainNavbar;


//Estilos del componente

export const Topbar = styled.header`
  background-color: ${({ theme }) => theme.fill.inverseMain};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  .container {
    
    display: flex;
    color: white;
    flex-direction: row;
    align-items: center;
    flex-grow: 1;
    justify-content: space-between;
    padding: ${({ theme }) => theme.sizing.sm} ${({ theme }) => theme.sizing.md};
    max-width: 1400px;
  }
`;


export const NavLinks = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;

  .NavLink {
    display: flex;
    flex-direction: row;
    padding: 6px 8px;
    align-items: center;
    gap: 8px;
    border-radius: ${({ theme }) => theme.radius.xs};

    &:hover {
      background-color: ${({ theme }) => theme.fill.inverseWeak};
    }

    p {
      color: ${({ theme }) => theme.colors.inverseMain};
      font-variant-numeric: lining-nums tabular-nums;
      font-feature-settings: 'ss01' on, 'ss04' on;
      font-family: "Mona Sans";
      font-size: 15px;
      font-style: normal;
      font-weight: 500;
      line-height: 140%; /* 21px */
    }
  }

`;

export const ActionsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`;

