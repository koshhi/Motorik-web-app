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
      <div className='container'>
        <Link to="/" >
          <img src='/motorik-logo.svg' alt="Motorik Logo" />
        </Link>
        {isAuthenticated ? (
          <ActionsContainer>
            <Button size="small" variant="defaultInverse" onClick={handleCreateEvent}>Create event</Button>
            <Button size="small" variant="outlineInverse" onClick={handleLogout}>Logout</Button>
          </ActionsContainer>
        ) : (
          <>
            <ActionsContainer>
              <Button size="small" variant="defaultInverse" onClick={handleCreateEvent}>Create event</Button>
              <Link to="/login"><button className='button'>Login</button></Link>
              <Link to="/signup"><button className='button'>Signup</button></Link>
            </ActionsContainer>
          </>
        )}
      </div>
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
    max-width: 1248px;
  }
`;

export const ActionsContainer = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 8px;
`;