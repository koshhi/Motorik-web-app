import React from 'react';
import Button from '../Button/Button';
import CardToogle from '../Toogle/CardToogle';
import { getEventTerrainSvgIcon } from '../../utilities';
import { theme } from '../../theme';
import styled from 'styled-components';
import Typography from '../Typography';
import Modal from './Modal';

const CreateEventTerrainModal = ({ terrain, setTerrain, onClose }) => {
  const terrainTypes = ['road', 'offroad', 'mixed'];

  return (
    <Modal onClose={onClose} title="Tipo de terreno">
      <ModalContent>
        <Typography as="p" $variant="body-1-medium" color={theme.colors.defaultWeak}>
          Esta información ayudará a dar visibilidad a tu evento.
        </Typography>
        <TerrainList>
          {terrainTypes.map((terrainType) => (
            <CardToogle
              key={terrainType}
              category={terrainType}
              isActive={terrain === terrainType}
              onClick={() => setTerrain(terrainType)}
              icon={getEventTerrainSvgIcon(terrainType, terrain === terrainType ? theme.colors.brandMain : theme.colors.defaultSubtle)}
            />
          ))}
        </TerrainList>
      </ModalContent>
      <FormActions>
        <Button size="medium" onClick={onClose}>Guardar tipo de terreno</Button>
      </FormActions>
    </Modal>
  );
};

export default CreateEventTerrainModal;

const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.fill.defaultMain};
  display: flex;
  padding: ${({ theme }) => theme.sizing.sm};
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.sizing.md};
  border-radius: ${({ theme }) => theme.radius.sm};
  width: 100%;
`;


const TerrainList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  grid-column-gap: 8px;
  grid-row-gap: 8px;
  width: 100%;
`;

const FormActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  width: 100%;
  border-top: 1px solid ${({ theme }) => theme.border.defaultWeak};
  text-align: center;
`;

