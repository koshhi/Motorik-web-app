import React from 'react';
import styled from 'styled-components';
import { theme } from '../theme';
import Typography from './Typography';
import PropTypes from 'prop-types';

const Tag = ({
  children,
  $variant = 'default',
  $textTransform = 'uppercase',
  $letterSpacing = '1.2px',
  $textStyle = 'overline-semibold',
  $borderRadius = '16px'
}) => {
  return (
    <TagContainer $variant={$variant} $borderRadius={$borderRadius}>
      <Typography
        $variant={$textStyle}
        color={variantStyles[$variant].color}
        $textTransform={$textTransform}
        $letterSpacing={$letterSpacing}
      >
        {children}
      </Typography>
    </TagContainer>
  );
};

// Validación de props (opcional pero recomendado)
Tag.propTypes = {
  children: PropTypes.node.isRequired,
  $variant: PropTypes.oneOf([
    'brand',
    'brandSubtle',
    'transparent',
    'success',
    'warning',
    'danger',
    'outline',
    'inverse',
    'subtle',
    'default',
  ]),
  $textTransform: PropTypes.oneOf(['none', 'uppercase', 'lowercase', 'capitalize']),
  $letterSpacing: PropTypes.string,
  $borderRadius: PropTypes.string,
};

export default Tag;

const variantStyles = {
  brand: {
    border: 'transparent',
    background: theme.fill.brandMain,
    color: theme.colors.inverseMain,
  },
  brandSubtle: {
    border: 'transparent',
    background: theme.fill.brandAlphaMain16,
    color: theme.colors.brandMain,
  },
  transparent: {
    border: theme.border.defaultWeak,
    background: 'transparent',
    color: theme.colors.defaultStrong,
  },
  success: {
    border: 'transparent',
    background: theme.fill.successAlphaMain16,
    color: theme.colors.successMain,
  },
  warning: {
    border: 'transparent',
    background: theme.fill.warningAlphaMain16,
    color: theme.colors.warningMain,
  },
  danger: {
    border: 'transparent',
    background: theme.fill.elserrorAlphaMain16,
    color: theme.colors.errorMain,
  },
  outline: {
    border: theme.border.defaultWeak,
    background: theme.fill.defaultMain,
    color: theme.colors.defaultStrong,
  },
  inverse: {
    border: 'transparent',
    background: theme.fill.inverseMain,
    color: theme.colors.inverseStrong,
  },
  subtle: {
    border: 'transparent',
    background: theme.fill.defaultWeak,
    color: theme.colors.defaultStrong,
  },
  default: {
    border: 'transparent',
    background: theme.fill.defaultMain,
    color: theme.colors.defaultStrong,
  },
};

const TagContainer = styled.div`
  display: inline-flex;
  padding: 6px ${({ theme }) => theme.sizing.xs};
  border-radius: ${({ $borderRadius }) => $borderRadius};
  border: 1px solid ${({ $variant }) => variantStyles[$variant].border};
  background: ${({ $variant }) => variantStyles[$variant].background};
`;