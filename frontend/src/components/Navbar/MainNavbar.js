import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../Button/Button';


const MainNavbar = () => {
  const navigate = useNavigate();

  // Verificar si el usuario está autenticado
  const isAuthenticated = !!localStorage.getItem('authToken');

  const handleLogout = () => {
    // Eliminar el token del almacenamiento local
    localStorage.removeItem('authToken');

    // Redirigir al login
    navigate('/login', { state: { message: 'You have been logged out successfully.' } });
  };

  const handleCreateEvent = () => {
    if (isAuthenticated) {
      navigate('/create-event'); // Redirigir a la página de creación de eventos si está autenticado
    } else {
      navigate('/login', { state: { message: 'You need to log in to create an event.' } }); // Redirigir al login si no está autenticado
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
            <Link to="/" className='NavLink'>
              <img src='/icons/my-profile.svg' alt="Mi Perfil" /><p>Mi Perfil</p>
            </Link>
          </NavLinks>
          <ActionsContainer>
            <Button size="small" variant="defaultInverse" onClick={handleCreateEvent}>Create event</Button>
            <Button size="small" variant="outlineInverse" onClick={handleLogout}>Logout</Button>
          </ActionsContainer>
        </div>
      ) : (
        <div className='container'>
          <Link to="/" >
            <img src='/motorik-logo.svg' alt="Motorik Logo" />
          </Link>
          <ActionsContainer>
            <Button size="small" variant="defaultInverse" onClick={handleCreateEvent}>Create event</Button>
            <Link to="/login"><Button size="small" variant="outlineInverse">Entra</Button></Link>
            <Link to="/signup"><Button size="small" variant="outlineInverse">Únete</Button></Link>
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