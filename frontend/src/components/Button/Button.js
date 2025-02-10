import styled, { css } from 'styled-components';

// Estilos comunes para todos los botones
const baseStyles = css`
  display: ${({ $fullWidth }) => ($fullWidth ? 'flex' : 'inline-flex')};
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};

  gap: 4px;
  align-items: center;
  font-variant-numeric: lining-nums tabular-nums;
  font-feature-settings: 'ss01' on, 'ss05' on, 'ss06' on, 'ss07' on;
  font-family: "Mona Sans";
  font-style: normal;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  line-height: 150%;

  justify-content: ${({ $contentAlign }) => {
    switch ($contentAlign) {
      case 'left':
        return 'flex-start';
      case 'right':
        return 'flex-end';
      case 'center':
      default:
        return 'center';
    }
  }};


  padding: ${({ size }) => {
    switch (size) {
      case 'medium':
        return '12px 16px';
      case 'large':
        return '20px 20px';
      default:
        return '8px 12px';
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

    /* Cambiar cursor y opacidad si está deshabilitado */
  ${({ disabled }) =>
    disabled &&
    css`
      cursor: not-allowed;
      opacity: 0.6;
    `}
`;

// Estilos condicionales basados en props
const variantStyles = css`
  ${({ $variant, theme }) => {
    switch ($variant) {
      default:
        return css`
          background-color: ${theme.fill.inverseMain};
          color: ${theme.colors.inverseMain};
          border: 1px solid transparent;
          transition: all 0.3s ease-in-out;

          &:hover {
            background-color: ${theme.fill.inverseWeak};
          }
        `;
      case 'defaultInverse':
        return css`
          background-color: ${theme.fill.defaultMain};
          color: ${theme.colors.defaultMain};
          border: 1px solid transparent;
          transition: all 0.3s ease-in-out;

          &:hover {
            background-color: ${theme.palette.alabaster[100]};
          }
        `;
      case 'outline':
        return css`
          background-color: transparent;
          border: 1px solid ${theme.border.defaultWeak};
          color: ${theme.colors.defaultMain};
          transition: all 0.3s ease-in-out;

          &:hover {
            background-color: ${theme.palette.alabaster[100]};
          }
        `;
      case 'outlineInverse':
        return css`
          background-color: transparent;
          border: 1px solid ${theme.colors.inverseWeak};
          color: ${theme.colors.inverseMain};
          transition: all 0.3s ease-in-out;

          &:hover {
            background-color: ${theme.palette.alabaster[950]};
          }
        `;
      case 'ghost':
        return css`
          background-color: transparent;
          color: ${theme.colors.defaultMain};
          border: 1px solid transparent;
          transition: all 0.3s ease-in-out;

          &:hover {
            background-color: ${theme.palette.alabaster[100]};
          }
        `;
      case 'ghostInverse':
        return css`
          background-color: transparent;
          color: ${theme.colors.inverseMain};
          border: 1px solid transparent;
          transition: all 0.3s ease-in-out;

          &:hover {
            background-color: ${theme.palette.alabaster[950]};
          }
        `;
      case 'defaultDanger':
        return css`
          background-color: ${theme.fill.elserrorAlphaMain16};
          color: ${theme.colors.errorMain};
          border: 1px solid transparent;
          transition: all 0.3s ease-in-out;

          &:hover {
            background-color: ${theme.fill.elserrorAlphaMain32};
          }
        `;
      case 'outlineDanger':
        return css`
          background-color: transparent;
          color: ${theme.colors.errorMain};
          border: 1px solid ${theme.fill.elserrorAlphaMain24};
          transition: all 0.3s ease-in-out;

          &:hover {
            background-color: ${theme.fill.elserrorAlphaMain16};
          }
        `;
      case 'ghostDanger':
        return css`
          background-color: transparent;
          color: ${theme.colors.errorMain};
          border: 1px solid transparent;
          transition: all 0.3s ease-in-out;

          &:hover {
            background-color: ${theme.fill.elserrorAlphaMain24};
          }
        `;
      case 'defaultDangerInverse':
        return css`
          background-color: ${theme.fill.elserrorAlphaMain24};
          color: ${theme.colors.errorMain};
          border: 1px solid transparent;
          transition: all 0.3s ease-in-out;

          &:hover {
            background-color: ${theme.fill.elserrorAlphaMain32};
          }
        `;
      case 'outlineDangerInverse':
        return css`
          background-color: transparent;
          color: ${theme.colors.errorMain};
          border: 1px solid ${theme.fill.elserrorAlphaMain48};
          transition: all 0.3s ease-in-out;

          &:hover {
            background-color: ${theme.fill.elserrorAlphaMain24};
          }
        `;
      case 'ghostDangerInverse':
        return css`
          background-color: transparent;
          color: ${theme.colors.errorMain};
          border: 1px solid transparent;
          transition: all 0.3s ease-in-out;

          &:hover {
            background-color: ${theme.fill.elserrorAlphaMain32};
          }
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
