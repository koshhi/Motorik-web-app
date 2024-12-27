const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const theme = {
  // Paleta de colores unificada
  palette: {
    alabaster: {
      0: "#ffffff",
      50: "#fafafa",
      100: "#efefef",
      200: "#dcdcdc",
      300: "#bdbdbd",
      400: "#989898",
      500: "#7c7c7c",
      600: "#656565",
      700: "#525252",
      800: "#464646",
      900: "#3d3d3d",
      950: "#292929",
      1000: "#1a1a1a",
      1100: "#10110f",
      alpha: {
        a0_16: "rgba(255, 255, 255, 0.1600)",
        a0_8: "rgba(255, 255, 255, 0.0800)",
        a0_6: "rgba(255, 255, 255, 0.0600)",
        a0_4: "rgba(255, 255, 255, 0.0400)"
      }
    },
    internationalOrange: {
      50: "#fff7ec",
      100: "#ffedd3",
      200: "#ffd7a7",
      300: "#ffba6e",
      400: "#ff9234",
      500: "#ff720d",
      600: "#f65703",
      700: "#c93f05",
      800: "#a0310c",
      900: "#802b0e",
      950: "#451305",
      alpha: {
        a600_24: "rgba(246, 87, 3, 0.2400)",
        a600_16: "rgba(246, 87, 3, 0.1600)"
      }
    },
    redOrange: {
      50: "#fef3f2",
      100: "#fee4e2",
      200: "#ffcdc9",
      300: "#fdaaa4",
      400: "#f97970",
      500: "#f04438",
      600: "#de3024",
      700: "#bb241a",
      800: "#9a221a",
      900: "#80231c",
      950: "#460d09",
      alpha: {
        a500_16: "rgba(240, 68, 56, 0.1600)"
      }
    },
    chateauGreen: {
      50: "#ecfdf3",
      100: "#d1fadf",
      200: "#a8f2c6",
      300: "#6fe6a7",
      400: "#36d183",
      500: "#12b76a",
      600: "#079455",
      700: "#057747",
      800: "#075e3a",
      900: "#074d32",
      950: "#022c1c",
      alpha: {
        a500_16: "rgba(18, 183, 106, 0.1600)"
      }
    },
    mediumPurple: {
      50: "#f6f4fe",
      100: "#eeebfc",
      200: "#e0d9fb",
      300: "#c9baf8",
      400: "#ad93f2",
      500: "#9e77ed",
      600: "#8347e0",
      700: "#7435cc",
      800: "#602cab",
      900: "#51268c",
      950: "#32165f",
      alpha: {
        a500_16: "rgba(158, 119, 237, 0.1600)"
      }
    }
  },

  // Estilos generales
  colors: {
    defaultMain: "#10110f", // Alabaster.950
    defaultStrong: "#292929", // Alabaster.950
    defaultWeak: "#656565", // Alabaster.600
    defaultSubtle: "#989898", // Alabaster.400
    inverseMain: "#ffffff", // Alabaster.0
    inverseStrong: "#dcdcdc", // Alabaster.200
    inverseWeak: "#989898", // Alabaster.400
    inverseSubtle: "#7c7c7c", // Alabaster.500
    brandMain: "#f65703", // International Orange.600
    brandStrong: "#ff720d", // International Orange.500
    errorMain: "#f04438", // Red Orange.500
    successMain: "#12b76a", // Chateau Green.500
    warningMain: "#9e77ed", // Medium Purple.500
  },

  // Estilos para bordes
  border: {
    defaultMain: "#ffffff", // Alabaster.0
    defaultStrong: "#bdbdbd", // Alabaster.300
    defaultWeak: "#dcdcdc", // Alabaster.200
    defaultSubtle: "#efefef", // Alabaster.100
    inverseMain: "#10110f", // Alabaster.1100
    inverseStrong: "#7c7c7c", // Alabaster.500
    inverseWeak: "#3d3d3d", // Alabaster.700
    inverseSubtle: "#1a1a1a", // Alabaster.1000
    brandMain: "#f65703", // International Orange.600
    brandStrong: "#ff720d", // International Orange.500
    errorMain: "#f04438", // Red Orange.500
    successMain: "#12b76a", // Chateau Green.500
    warningMain: "#9e77ed", // Medium Purple.500
  },

  // Estilos de fondo
  fill: {
    defaultMain: "#ffffff", // Alabaster.0
    defaultSubtle: "#fafafa", // Alabaster.50
    defaultWeak: "#efefef", // Alabaster.100
    defaultStrong: "#dcdcdc", // Alabaster.200
    defaultAlphaMain16: hexToRgba("#ffffff", 0.16), // Alabaster Alpha
    defaultAlphaMain24: hexToRgba("#ffffff", 0.24), // Alabaster Alpha
    inverseMain: "#10110f", // Alabaster.1100
    inverseStrong: "#1a1a1a", // Alabaster.1000
    inverseWeak: "#292929", // Alabaster.950
    inverseSubtle: "#3d3d3d", // Alabaster.900
    inverseAlphaMain16: hexToRgba("#10110f", 0.16), // Alabaster Alpha
    inverseAlphaMain24: hexToRgba("#10110f", 0.24), // Alabaster Alpha
    brandMain: "#f65703", // International Orange.600
    brandAlphaMain16: hexToRgba("#f65703", 0.16), // International Orange Alpha
    errorMain: "#f04438", // Red Orange.500
    elserrorAlphaMain16: "rgba(240, 68, 56, 0.1600)", // Red Orange Alpha
    elserrorAlphaMain24: hexToRgba("#f04438", 0.24),
    elserrorAlphaMain32: "rgba(240, 68, 56, 0.3200)", // Red Orange Alpha
    elserrorAlphaMain48: hexToRgba("#f04438", 0.48),
    successMain: "#12b76a", // Chateau Green.500
    successAlphaMain16: "rgba(18, 183, 106, 0.1600)", // Chateau Green Alpha
    warningMain: "#9e77ed", // Medium Purple.500
    warningAlphaMain16: "rgba(158, 119, 237, 0.1600)" // Medium Purple Alpha
  },

  // Tamaños y espaciado
  sizing: {
    none: '0px',
    xxxs: '2px',
    xxs: '0.25rem', //4px
    xs: '0.5rem', //8px
    sm: '1rem', //16px
    md: '1.5rem', //24px
    lg: '2rem', //32px
    xl: '2.5rem', //40px
    xxl: '3rem' //48px
  },

  radius: {
    xxs: '0.25rem', //4px 
    xs: '0.5rem', //8px
    sm: '1rem', //16px
    md: '1.5rem', //24px
    lg: '2rem', //32px
    xl: '2.5rem', //40px
    xxl: '3rem' //48px
  }
};

