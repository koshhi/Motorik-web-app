// typographyStyles.js

// Mapeo de font weights
export const fontWeights = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

// Función para generar los estilos tipográficos
const createTypographyVariant = (baseName, sizes, lineHeights, letterSpacings, weights) => {
  const variants = {};

  weights.forEach((weight) => {
    const weightKey = weight.name;
    variants[`${baseName}-${weightKey}`] = {
      fontSize: sizes[weightKey] || sizes.default,
      lineHeight: lineHeights[weightKey] || lineHeights.default,
      letterSpacing: letterSpacings[weightKey] || letterSpacings.default,
      fontWeight: fontWeights[weightKey],
    };
  });

  return variants;
};

// Definición de los estilos tipográficos
export const typographyStyles = {
  ...createTypographyVariant(
    'large-title',
    { default: '40px' },
    { default: '140%', medium: '150%' },
    { default: 'normal' },
    [
      { name: 'regular' },
      { name: 'medium' },
      { name: 'semibold' },
      { name: 'bold' },
    ]
  ),
  ...createTypographyVariant(
    'title-1',
    { default: '32px' },
    { default: '140%', medium: '150%' },
    { default: 'normal' },
    [
      { name: 'regular' },
      { name: 'medium' },
      { name: 'semibold' },
      { name: 'bold' },
    ]
  ),
  ...createTypographyVariant(
    'title-2',
    { default: '28px' },
    { default: '140%', medium: '150%' },
    { default: 'normal' },
    [
      { name: 'regular' },
      { name: 'medium' },
      { name: 'semibold' },
      { name: 'bold' },
    ]
  ),
  ...createTypographyVariant(
    'title-3',
    { default: '24px' },
    { default: '140%', medium: '150%' },
    { default: 'normal' },
    [
      { name: 'regular' },
      { name: 'medium' },
      { name: 'semibold' },
      { name: 'bold' },
    ]
  ),
  ...createTypographyVariant(
    'title-4',
    { default: '20px' },
    { default: '140%', medium: '150%' },
    { default: 'normal' },
    [
      { name: 'regular' },
      { name: 'medium' },
      { name: 'semibold' },
      { name: 'bold' },
    ]
  ),
  ...createTypographyVariant(
    'title-5',
    { default: '18px' },
    { default: '140%', medium: '150%' },
    { default: 'normal' },
    [
      { name: 'regular' },
      { name: 'medium' },
      { name: 'semibold' },
      { name: 'bold' },
    ]
  ),
  ...createTypographyVariant(
    'body-1',
    { default: '16px' },
    { default: '150%' },
    { default: 'normal' },
    [
      { name: 'regular' },
      { name: 'medium' },
      { name: 'semibold' },
    ]
  ),
  ...createTypographyVariant(
    'body-2',
    { default: '14px' },
    { default: '140%' },
    { default: 'normal' },
    [
      { name: 'regular' },
      { name: 'medium' },
      { name: 'semibold' },
      { name: 'bold' },
    ]
  ),
  ...createTypographyVariant(
    'body-3',
    { default: '13px' },
    { default: '150%' },
    { default: 'normal' },
    [
      { name: 'regular' },
      { name: 'medium' },
      { name: 'semibold' },
      { name: 'bold' },
    ]
  ),
  ...createTypographyVariant(
    'caption',
    { default: '12px' },
    { default: '150%' },
    { default: 'normal' },
    [
      { name: 'regular' },
      { name: 'medium' },
      { name: 'semibold' },
      { name: 'bold' },
    ]
  ),
  ...createTypographyVariant(
    'overline',
    { default: '10px' },
    { default: '100%' },
    { default: '1.2px' },
    [
      { name: 'regular' },
      { name: 'medium' },
      { name: 'semibold' },
      { name: 'bold' },
    ]
  ),
  'buttons-label-sm': {
    fontSize: '18px',
    lineHeight: '24px',
    letterSpacing: '2%',
    fontWeight: fontWeights.regular,
  },
  'buttons-label-xs': {
    fontSize: '16px',
    lineHeight: 'normal',
    letterSpacing: '2%',
    fontWeight: fontWeights.regular,
  },
  'buttons-label-md': {
    fontSize: '20px',
    lineHeight: 'normal',
    letterSpacing: '2%',
    fontWeight: fontWeights.regular,
  },
  'cards-tag-small-cap': {
    fontSize: '14px',
    lineHeight: '16px',
    letterSpacing: '4%',
    fontWeight: fontWeights.regular,
  },
  'cards-title-big-cap': {
    fontSize: '32px',
    lineHeight: '120%',
    letterSpacing: 'normal',
    fontWeight: fontWeights.regular,
  },
};
