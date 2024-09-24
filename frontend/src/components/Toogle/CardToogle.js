import React from 'react';
import styled from 'styled-components';

const CardToogle = ({ category, isActive, onClick, icon }) => {
  return (
    <Option $isActive={isActive} onClick={onClick}>
      {icon}
      <span>{category}</span>
    </Option>
  );
};

export default CardToogle;


const Option = styled.div`
  cursor: pointer;
  border: 1px solid ${({ $isActive, theme }) => ($isActive ? theme.border.brandMain : theme.border.defaultWeak)};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.sizing.xxs};
  padding: ${({ theme }) => theme.sizing.sm};
  border-radius: ${({ theme }) => theme.sizing.xs};
  min-width: 136px;

  

  img {
    width: ${({ theme }) => theme.sizing.lg};
    height: ${({ theme }) => theme.sizing.lg};
  }

  span {
    font-variant-numeric: lining-nums tabular-nums;
    font-feature-settings: 'ss01' on;
    font-family: "Mona Sans";
    font-size: 13px;
    font-style: normal;
    font-weight: 600;
    line-height: 150%;
    font-size: 14px;
    color: ${({ $isActive, theme }) => ($isActive ? theme.colors.brandMain : theme.colors.defaultSubtle)};
  }
`;
