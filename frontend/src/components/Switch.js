import React from 'react';
import styled from 'styled-components';

const Switch = ({ value = false, onChange }) => {
  const toggleSwitch = () => {
    onChange(!value);
  };

  return (
    <SwitchContainer $isOn={value} onClick={toggleSwitch}>
      <Knob $isOn={value} />
    </SwitchContainer>
  );
};

export default Switch;

const SwitchContainer = styled.div`
  height: 24px;
  width: 40px;
  background-color: ${({ theme, $isOn }) => $isOn ? theme.fill.brandMain : theme.fill.defaultStrong};
  padding: 2px;
  border-radius: 24px;
  display: flex;
  flex-direction: row;
  align-items: ${({ $isOn }) => ($isOn ? 'flex-end' : 'flex-start')};
  cursor: pointer;
`;

const Knob = styled.div`
  height: 20px;
  width: 20px;
  border-radius: 24px;
  box-shadow: 0px 4px 4px 0px rgba(41, 41, 41, 0.16);
  background-color: ${({ theme }) => theme.fill.defaultMain};
  transform: ${({ $isOn }) => ($isOn ? 'translateX(16px)' : 'translateX(0)')};
  transition: transform 0.3s ease;
`;
