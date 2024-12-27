// components/Modal/VehicleItem.js

import React from 'react';
import styled from 'styled-components';
import Typography from '../Typography';
import RadioButton from '../RadioButton/RadioButton';
import PropTypes from 'prop-types';

const VehicleItem = ({ vehicle, selected, onSelect }) => {
  return (
    <VehicleContainer selected={selected} onClick={onSelect}>
      <div style={{ marginTop: "2px" }} >
        <RadioButton selected={selected} onClick={onSelect} />
      </div>

      <VehicleContent>
        <VehicleData>
          <Typography $variant="body-2-medium">
            {vehicle.brand}
          </Typography>
          <Typography $variant="body-1-semibold">
            {vehicle.model}
            {vehicle.nickname && ` - ${vehicle.nickname}`}
            {vehicle.year}
          </Typography>
        </VehicleData>
        <VehicleImage src={vehicle.image} alt={`${vehicle.brand} ${vehicle.model}`} />

      </VehicleContent>
    </VehicleContainer>
  );
};

VehicleItem.propTypes = {
  vehicle: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    brand: PropTypes.string.isRequired,
    model: PropTypes.string.isRequired,
    nickname: PropTypes.string,
    image: PropTypes.string.isRequired,
    year: PropTypes.number.isRequired,
  }).isRequired,
  selected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default VehicleItem;

// Styled Components
const VehicleContainer = styled.li`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: ${({ theme }) => theme.sizing.sm};
  padding-left: ${({ theme }) => theme.sizing.sm};
  border: 1px solid ${({ theme, selected }) => (selected ? theme.border.brandMain : theme.border.defaultWeak)};
  border-radius: ${({ theme }) => theme.sizing.xs};
  background-color: ${({ theme, selected }) => (selected ? theme.fill.defaultMain : theme.fill.defaultMain)};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: background-color 0.2s, border-color 0.2s;

  &:hover {
    border-color: ${({ selected, theme }) => (selected ? theme.border.brandMain : theme.border.defaultStrong)};
    background-color: ${({ selected, theme }) => (selected ? theme.fill.defaulSubtle : theme.fill.defaultMain)};
  }
`;

const VehicleContent = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.sizing.sm};
  width: 100%;
  align-items: center;
`;

const VehicleData = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.sizing.xxs};
  padding-top: ${({ theme }) => theme.sizing.xs};
  padding-bottom: ${({ theme }) => theme.sizing.xs};
  width: 100%;
`;

const VehicleImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: ${({ theme }) => theme.radius.xxs};
  margin: ${({ theme }) => theme.sizing.xxs};
`;
