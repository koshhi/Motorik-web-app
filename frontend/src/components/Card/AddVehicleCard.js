// AddVehicleCard.jsx
import styled from 'styled-components';
import Typography from '../Typography';

function AddVehicleCard({ onClick }) {
  return (
    <CardContainer onClick={onClick}>
      <CardContent>
        <img src="/icons/add-solid.svg" alt="Añadir" />
        <Typography $variant="title-5-medium">
          Añadir vehículo
        </Typography>
      </CardContent>
    </CardContainer>
  );
}

export default AddVehicleCard;

// Estilos de ejemplo
const CardContainer = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;  
  border-radius: ${({ theme }) => theme.radius.xs};
  border: 2px dashed ${({ theme }) => theme.border.defaultWeak};
  background: var(--bg-default-main, #FFF);
  padding: ${({ theme }) => theme.sizing.sm};
  aspect-ratio: 4 / 3;
  transition: all 0.3s ease-in-out;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.fill.defaultSubtle};
  }
`;

const CardContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: ${({ theme }) => theme.sizing.xs};
`;