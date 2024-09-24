import React from 'react';
import styled from 'styled-components';

const EventTypeTab = ({ category, isActive, onClick, icon }) => {
  return (
    <TabWrapper $isActive={isActive} onClick={onClick}>
      {icon}
      <span>{category}</span>
    </TabWrapper>
  );
};

export default EventTypeTab;


const TabWrapper = styled.div`
  cursor: pointer;
  border-bottom: 4px solid ${({ $isActive, theme }) => ($isActive ? theme.colors.brandMain : theme.fill.defaultMain)};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.sizing.xxs};
  padding-bottom: ${({ theme }) => theme.sizing.xs};

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
