import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
/* Reset CSS */
*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  font-size: 100%;
  font-family: sans-serif;
  /* Fuente predeterminada si no se carga la fuente personalizada */
}

p,h1,h2,h3,h4,h5,h6 {
margin: 0
}

a {
  text-decoration: none;
  color: inherit;
}

ol,
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

table {
  border-collapse: collapse;
  border-spacing: 0;
}

@font-face {
  font-family: 'MonaSans';
  src: url('/fonts/MonaSansVF-Regular.woff2') format('woff2');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
  font-variant-numeric: lining-nums tabular-nums;
  font-feature-settings: 'ss01' on;
}

body {
  font-family: 'MonaSans', sans-serif;
}
`;

export default GlobalStyle;