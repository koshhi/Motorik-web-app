// src/components/DropdownButton.js

import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Button from './Button/Button';

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownButtonStyled = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DropdownMenu = styled.ul`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  list-style: none;
  padding: 0;
  margin: 4px 0 0 0;
  min-width: 120px;
  z-index: 1000;
`;

const DropdownMenuItem = styled.li`
  padding: 8px 12px;
  cursor: pointer;
  &:hover {
    background-color: #f5f5f5;
  }
`;

const DropdownButton = ({ options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    // Añade un listener para cerrar el menú cuando se hace clic fuera
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Limpia el listener al desmontar el componente
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <DropdownContainer ref={dropdownRef}>
      <Button $variant="outline" onClick={toggleDropdown}>
        <img src="/icons/ellipsis-vertical.svg" alt="More options" />
      </Button>
      {isOpen && (
        <DropdownMenu>
          {options.map((option, index) => (
            <DropdownMenuItem
              key={index}
              onClick={() => {
                option.onClick();
                setIsOpen(false); // Cierra el menú al seleccionar una opción
              }}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenu>
      )}
    </DropdownContainer>
  );
};

export default DropdownButton;
