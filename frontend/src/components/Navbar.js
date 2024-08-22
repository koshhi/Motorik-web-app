import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
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
    <header>
      <nav className='navbar'>
        <Link to="/" className="logo" >
          <img src='/motorik-logo.svg' alt="Motorik Logo" />
        </Link>
        {isAuthenticated ? (
          <div className='navbar_links'>
            <button className='button' onClick={handleCreateEvent}>Create event</button>
            <button className='button' onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <>
            <div className='navbar_links'>
              <button className='button' onClick={handleCreateEvent}>Create event</button>
              <Link to="/login"><button className='button'>Login</button></Link>
              <Link to="/signup"><button className='button'>Signup</button></Link>
            </div>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
