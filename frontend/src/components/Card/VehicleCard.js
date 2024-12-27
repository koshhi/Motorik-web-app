import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Button from '../Button/Button';
import Typography from '../Typography';
import { theme } from '../../theme';

/**
 * Este componente recibe:
 * - vehicle: Objeto con la información del vehículo (brand, model, etc.)
 * - isOwnGarage: booleano que indica si el garage pertenece al usuario (para mostrar acciones)
 * - openEditModal: función para abrir el modal de edición de vehículo
 * - handleDeleteVehicle: función para eliminar el vehículo
 */
function VehicleCard({ vehicle, isOwnGarage, openEditModal, handleDeleteVehicle }) {
  // Estado local para controlar la visibilidad del menú
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // Toggle para abrir/cerrar el menú
  const toggleMenu = () => {
    setShowMenu((prev) => !prev);
  };

  // Cierra el menú si el usuario hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  return (
    <Vehicle>
      {vehicle?.image && (
        <VehicleImage src={vehicle.image} alt={vehicle.brand} />
      )}
      <VehicleData>
        {vehicle.nickname ? (
          <>
            <Typography $variant="body-1-medium" color={theme.colors.inverseMain}>
              {vehicle?.brand}
              <Typography as="span" color={theme.colors.inverseStrong} style={{ marginLeft: '4px' }}>
                {vehicle?.model}
              </Typography>
            </Typography>
            <Typography $variant="title-5-semibold" color={theme.colors.inverseMain}>{vehicle.nickname}</Typography>
            <Typography $variant="body-3-medium" color={theme.colors.inverseStrong}>{vehicle.year}</Typography>
          </>
        ) : (
          <>
            <Typography $variant="body-1-medium" color={theme.colors.inverseMain}>
              {vehicle?.brand}
            </Typography>
            <Typography $variant="title-5-semibold" color={theme.colors.inverseMain}>{vehicle.model}</Typography>
            <Typography $variant="body-3-medium" color={theme.colors.inverseStrong}>{vehicle.year}</Typography>
          </>
        )}
      </VehicleData>


      {/* Si el garaje es del usuario, mostramos el menú */}
      {isOwnGarage && (
        <Dropdown>
          {/* Ícono de menú (tres puntos) o lo que quieras mostrar */}
          <MenuIcon onClick={toggleMenu}>
            <img src="/icons/ellipsis-vertical-white.svg" alt="Menu" />
          </MenuIcon>

          {/* Renderizamos el contenedor del menú si showMenu es true */}
          {showMenu && (
            <DropdownMenu ref={menuRef}>
              <MenuItem onClick={() => openEditModal(vehicle)}>
                Editar
              </MenuItem>
              <MenuItem
                $danger
                onClick={() => handleDeleteVehicle(vehicle._id)}
              >
                Eliminar
              </MenuItem>
            </DropdownMenu>
          )}
        </Dropdown>
      )}
    </Vehicle>
  );
}

export default VehicleCard;

const Vehicle = styled.li`
  border-radius: ${({ theme }) => theme.radius.xs};
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: stretch;
  overflow: hidden;
  position: relative;
  aspect-ratio: 4 / 3;
`;

const VehicleImage = styled.img`
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: 8px;
  object-fit: cover;
`;

const VehicleData = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding: ${({ theme }) => theme.sizing.sm};
  padding-top: 88px;
  background: linear-gradient(180deg, rgba(16, 17, 15, 0.00) 0%, rgba(16, 17, 15, 0.01) 6.67%, rgba(16, 17, 15, 0.04) 13.33%, rgba(16, 17, 15, 0.08) 20%, rgba(16, 17, 15, 0.15) 26.67%, rgba(16, 17, 15, 0.23) 33.33%, rgba(16, 17, 15, 0.33) 40%, rgba(16, 17, 15, 0.44) 46.67%, rgba(16, 17, 15, 0.56) 53.33%, rgba(16, 17, 15, 0.67) 60%, rgba(16, 17, 15, 0.77) 66.67%, rgba(16, 17, 15, 0.85) 73.33%, rgba(16, 17, 15, 0.92) 80%, rgba(16, 17, 15, 0.96) 86.67%, rgba(16, 17, 15, 0.99) 93.33%, #10110F 100%);
`;

const Dropdown = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 4px;
  flex-direction: column;
  align-items: flex-end;
`;

const MenuIcon = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) => theme.fill.inverseAlphaMain16};
  border: none;
  cursor: pointer;
  width: ${({ theme }) => theme.sizing.lg};
  height: ${({ theme }) => theme.sizing.lg};
  border-radius: ${({ theme }) => theme.radius.xs};
  transition: all 0.3s ease-in-out;

  img {
    width: 20px;
    height: 20px;
  }

  &:hover {
    background: ${({ theme }) => theme.fill.inverseAlphaMain24};
  }
`;

const DropdownMenu = styled.div`
  border: 1px solid ${({ theme }) => theme.border.defaultSubtle};
  background-color: ${({ theme }) => theme.fill.defaultMain};
  border-radius: ${({ theme }) => theme.radius.xs};
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.06);
  z-index: 999;
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.sizing.xxs};
`;

const MenuItem = styled.button`
  background: transparent;
  border: none;
  font-size: 16px;
  padding: ${({ theme }) => theme.sizing.xs};
  text-align: left;
  cursor: pointer;
  border-radius: ${({ theme }) => theme.radius.xxs};
  color: ${(props) => (props.$danger ? theme.colors.errorMain : theme.colors.defaultMain)};
  transition: all 0.3s ease-in-out;

  &:hover {
    // background-color: ${({ theme }) => theme.fill.defaultWeak};
    background-color: ${(props) => (props.$danger ? theme.fill.elserrorAlphaMain16 : theme.fill.defaultWeak)};
  }
`;