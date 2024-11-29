// components/ToogableTabs.js

import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Typography from '../Typography';

const ToogableTabs = ({ options, activeOption, onTabChange }) => {
  return (
    <TabsContainer>
      {options.map((option) => (
        <TabButton
          key={option.value}
          className={activeOption === option.value ? 'Active' : ''}
          onClick={() => onTabChange(option.value)}
        >
          <Typography $variant="body-1-semibold">{option.label}</Typography>
        </TabButton>
      ))}
    </TabsContainer>
  );
};

ToogableTabs.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  activeOption: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
};

export default ToogableTabs;

// Estilos para el componente
const TabsContainer = styled.div`
  display: flex;
  padding: 4px;
  align-items: flex-start;
  gap: 8px;
  border-radius: 24px;
  background: #EFEFEF;
  width: 100%;
`;

const TabButton = styled.button.attrs({ type: 'button' })`
  display: flex;
  flex-grow: 1;
  padding: 8px 16px;
  justify-content: center;
  align-items: center;
  border-radius: 32px;
  border: none;
  background: none;
  color: #656565;
  cursor: pointer;
  transition: background 0.3s, color 0.3s;

  &.Active {
    background: #FFF;
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.08), 
                0px 4px 12px 0px rgba(0, 0, 0, 0.04);
    color: #292929;
  }
`;
