import styled, { css } from 'styled-components';

// Estilos comunes para todos los botones
const baseStyles = css`
  display: inline-flex;
  gap: 8px;
  align-items: center;
  font-variant-numeric: lining-nums tabular-nums;
  font-feature-settings: 'ss01' on;
  font-family: "Mona Sans";
  font-style: normal;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;

  line-height: 150%;


  padding: ${({ size }) => {
    switch (size) {
      case 'medium':
        return '12px 12px';
      case 'large':
        return '20px 20px';
      default:
        return '8px 8px';
    }
  }};
  font-size: ${({ size }) => {
    switch (size) {
      case 'medium':
        return '16px';
      case 'large':
        return '16px';
      default:
        return '16px';
    }
  }};
`;

// Estilos condicionales basados en props
const variantStyles = css`
  ${({ $variant, theme }) => {
    switch ($variant) {
      default:
        return css`
          background-color: ${theme.fill.inverseMain};
          color: ${theme.colors.inverseMain};
          border: 2px solid transparent;
        `;
      case 'defaultInverse':
        return css`
          background-color: ${theme.fill.defaultMain};
          color: ${theme.colors.defaultMain};
          border: 2px solid transparent;
        `;
      case 'outline':
        return css`
          background-color: transparent;
          border: 2px solid ${theme.border.defaultWeak};
          color: ${theme.colors.defaultMain};
        `;
      case 'outlineInverse':
        return css`
          background-color: transparent;
          border: 2px solid ${theme.colors.inverseWeak};
          color: ${theme.colors.inverseMain};
        `;
      case 'ghost':
        return css`
          background-color: transparent;
          color: ${theme.colors.defaultMain};
          border: 2px solid transparent;
        `;
      case 'ghostInverse':
        return css`
          background-color: transparent;
          color: ${theme.colors.inverseMain};
          border: 2px solid transparent;
        `;
    }
  }}
`;

const Button = styled.button`
  ${baseStyles}
  ${variantStyles}

    .Icon {
      height: 20px;
      margin: 2px;
    }
`;

export default Button;
