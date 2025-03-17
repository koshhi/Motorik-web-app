// components/Tooltip/Tooltip.js

import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import Typography from '../Typography';
import { theme } from '../../theme';

const Tooltip = ({ children, text, trigger = 'hover', duration = 2000, maxWidth = '200px', ...props }) => {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef(null);

  const showTooltip = () => {
    setVisible(true);
    if (trigger === 'click') {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setVisible(false), duration);
    }
  };

  const hideTooltip = () => {
    if (trigger === 'hover') setVisible(false);
  };

  const handleClick = () => {
    if (trigger === 'click') {
      showTooltip();
    }
  };

  return (
    <TooltipWrapper
      onMouseEnter={trigger === 'hover' ? showTooltip : undefined}
      onMouseLeave={trigger === 'hover' ? hideTooltip : undefined}
      onClick={trigger === 'click' ? handleClick : undefined}
      {...props}
    >
      {children}
      {visible &&
        <TooltipBox $maxWidth={maxWidth}>
          <Typography $variant="body-2-medium" color={theme.colors.inverseMain}>{text}</Typography>
        </TooltipBox>
      }
    </TooltipWrapper>
  );
};

export default Tooltip;

const TooltipWrapper = styled.div`
  position: relative;
  // display: inline-block;
  display: flex;
`;

const TooltipBox = styled.div`
  position: absolute;
  // bottom: 125%;
  bottom: calc(100% + ${({ theme }) => theme.sizing.xs});
  left: 50%;
  transform: translateX(-50%);
  display: inline-block;
  background-color: ${({ theme }) => theme.fill.inverseSubtle};
  padding: ${({ theme }) => theme.sizing.xxs} ${({ theme }) => theme.sizing.xs} 6px ${({ theme }) => theme.sizing.xs};
  width: max-content;
  max-width: ${({ $maxWidth }) => $maxWidth};
  white-space: normal;
  word-wrap: break-word;
  text-align: center;
  border-radius: ${({ theme }) => theme.radius.xs};
  box-shadow: 0px 12px 16px -4px rgba(16, 24, 40, 0.10), 0px 4px 6px -2px rgba(16, 24, 40, 0.05);

  &::after {
    content: "";
    position: absolute;
    height: ${({ theme }) => theme.sizing.xs};
    bottom: -${({ theme }) => theme.sizing.xxs};
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
    width: ${({ theme }) => theme.sizing.xs};
    background-color: ${({ theme }) => theme.fill.inverseSubtle};
  }
`;
