// components/Input/InputLocation.js
import React from 'react';
import styled, { css } from 'styled-components';

const InputLocation = React.forwardRef(({ value, onChange, placeholder, id, size, variant }, ref) => {
  return (
    <InputText
      $size={size}
      $variant={variant}
      ref={ref}
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      id={id}
    />
  );
});

export default InputLocation;

const sizeStyles = css`
  ${({ $size, theme }) => {
    switch ($size) {
      case 'small':
        return css`
          padding: ${theme.sizing.xxs};
          font-size: ${theme.sizing.sm};
        `;
      case 'large':
        return css`
          padding: ${theme.sizing.sm};
          font-size: ${theme.sizing.sm};
        `;
      default:
        return css`
          padding: ${theme.sizing.xs};
          font-size: ${theme.sizing.sm};
        `;
    }
  }}
`;

// Mixin para los estilos de variantes y estados
const variantStyles = css`
  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'disabled':
        return css`
          background-color: ${theme.fill.defaultWeak};
          border-color: ${theme.border.defaultStrong};
          color: ${theme.colors.defaultSubtle};
          cursor: not-allowed;
          opacity: 0.6;
        `;
      case 'error':
        return css`
          background-color: ${theme.fill.errorBackground} !important;
          border-color: ${theme.border.errorMain} !important;
          color: ${theme.colors.errorMain} !important;
        `;
      default:
        return css`
          background-color: ${theme.fill.defaultMain};
          border-color: ${theme.border.defaultWeak};
          color: ${theme.colors.defaultMain};
          &:hover {
            background-color: ${theme.fill.defaultWeak};
            border-color: ${theme.border.defaultStrong};
          }
          &:active {
            background-color: ${theme.fill.defaultWeak};
            border-color: ${theme.border.inverseMain};
          }
          &::placeholder {
            color: ${theme.colors.defaultWeak};
          }
        `;
    }
  }}
`;

// Input estilizado
const InputText = styled.input`
  width: 100%;
  border: 1px solid;
  border-radius: ${({ theme }) => theme.radius.xs};
  font-variant-numeric: lining-nums tabular-nums;
  font-feature-settings: 'ss01' on;
  font-family: "Mona Sans";
  font-style: normal;
  font-weight: 400;
  line-height: 100%;
  transition: all 0.3s;

  
  ${sizeStyles} /* Aplicar los estilos basados en el tamaño */
  ${variantStyles} /* Aplicar los estilos basados en la variante */

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;
