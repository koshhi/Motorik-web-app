import styled from 'styled-components';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const AccountDropdown = ({ userAvatar }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);  // Cerrar el menú si el clic está fuera del dropdown
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const handleLogout = () => {
    // Eliminar el token del almacenamiento local
    localStorage.removeItem('authToken');

    // Redirigir a la home
    navigate('/');
  };

  return (
    <AccountDropdownWrapper ref={dropdownRef} >
      <AccountDropdownButton onClick={toggleDropdown}>
        <img className="Hamburger" src="/icons/hamburger.svg" alt="hamburger menu" />
        <img className="UserAvatar" src={userAvatar} alt="user avatar" />
      </AccountDropdownButton>

      {isOpen && (
        <DropdownMenu>
          <MenuItem>Perfil</MenuItem>
          <MenuItem>Mis Eventos</MenuItem>
          <MenuItem>Configuración</MenuItem>
          <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
        </DropdownMenu>
      )}
    </AccountDropdownWrapper>
  )
}

export default AccountDropdown;

const AccountDropdownWrapper = styled.div`
  position: relative;
`;

const AccountDropdownButton = styled.div`
  display: flex;
  padding: 6px;
  align-items: center;
  gap: 4px;
  align-self: stretch;
  border-radius: var(--Spacing-xs, 8px);
  border: 1px solid ${({ theme }) => theme.border.inverseStrong};
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.06);

  &:hover {
    // border: 1px solid ${({ theme }) => theme.border.defaultStrong};
    background-color: ${({ theme }) => theme.fill.inverseWeak};
  }

  .UserAvatar {
    width: 28px;
    height: 28px;
    border-radius: 20px;
    overflow: hidden;
  }

  .Hamburger {
    width: 20px;
    height: 20px;
    margin: 4px; 
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 48px;
  right: 0;
  background-color: white;
  border: 1px solid ${({ theme }) => theme.border.defaultSubtle};
  border-radius: ${({ theme }) => theme.radius.xs};
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.08);
  padding: ${({ theme }) => theme.sizing.xs};
  z-index: 100;
  width: 200px;
`;

const MenuItem = styled.div`
  padding: ${({ theme }) => theme.sizing.xs};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.defaultWeak};
  border-radius: ${({ theme }) => theme.radius.xs};
  transition: all 0.3s;
  font-variant-numeric: lining-nums tabular-nums;
  font-feature-settings: 'ss01' on;
  font-family: "Mona Sans";
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 24px */

  &:hover {
    background-color: ${({ theme }) => theme.fill.defaultWeak};
  }
`;