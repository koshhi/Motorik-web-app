// components/RadioButton/RadioButton.js

import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const RadioButton = ({ selected, onClick }) => {
  return (
    <RadioButtonContainer onClick={onClick} aria-checked={selected} role="radio">
      <OuterCircle selected={selected}>
        {selected && <InnerCircle />}
      </OuterCircle>
    </RadioButtonContainer>
  );
};

RadioButton.propTypes = {
  selected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default RadioButton;

// Styled Components
const RadioButtonContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const OuterCircle = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid ${({ theme, selected }) => (selected ? theme.colors.brandMain : theme.colors.border)};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border 0.3s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.brandMain};
  }
`;

const InnerCircle = styled.div`
  width: 10px;
  height: 10px;
  background-color: ${({ theme }) => theme.colors.brandMain};
  border-radius: 50%;
`;
