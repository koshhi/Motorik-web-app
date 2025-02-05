import React from 'react';
import styled from 'styled-components';
import Typography from '../Typography';

const CardToogle = ({ category, isActive, onClick, icon }) => {
  return (
    <Option $isActive={isActive} onClick={onClick}>
      {icon}
      <CategoryTitle as="p" $isActive={isActive} $variant="body-2-semibold">
        {category}
      </CategoryTitle>
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
  transition: all 0.3s;

  &:hover {
    border: 1px solid ${({ $isActive, theme }) => ($isActive ? theme.border.brandMain : theme.border.defaultWeak)};
    background-color: ${({ $isActive, theme }) => ($isActive ? theme.fill.brandAlphaMain16 : theme.fill.defaultWeak)};
  }
`;

const CategoryTitle = styled(Typography)`
  color: ${({ $isActive, theme }) => ($isActive ? theme.colors.brandMain : theme.colors.defaultSubtle)};
`;
