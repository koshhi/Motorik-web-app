// Typography.js
import styled from 'styled-components';
import { typographyStyles, fontWeights } from '../typographyStyles';
import { theme } from '../theme';

const Typography = styled.span.attrs(({ as, $variant }) => ({
  as: as || typographyStyles[$variant]?.element || 'span',
}))`
  font-family: 'MonaSans', sans-serif;
  font-size: ${({ $variant }) => typographyStyles[$variant]?.fontSize || '16px'};
  line-height: ${({ $variant }) => typographyStyles[$variant]?.lineHeight || '150%'};
  font-weight: ${({ fontWeight, $variant }) =>
    fontWeight
      ? fontWeights[fontWeight.toLowerCase()] || fontWeights.regular
      : typographyStyles[$variant]?.fontWeight || fontWeights.regular};
  letter-spacing: ${({ $variant }) => typographyStyles[$variant]?.letterSpacing || 'normal'};
  color: ${({ color }) => color || theme.colors.defaultMain};
  text-align: ${({ align }) => align || 'left'};
  font-variant-numeric: lining-nums tabular-nums;
  font-feature-settings: 'ss01' on, 'ss05' on, 'ss06' on, 'ss07' on;
`;

export default Typography;