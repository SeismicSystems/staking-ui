import { createTheme } from "@mui/material/styles";

// Module augmentation to add custom colors and typography
declare module "@mui/material/styles" {
  interface Palette {
    mauve: string;
    darkPurple: string;
    backgroundBlack: string;
    yellow: string;
  }

  interface PaletteOptions {
    mauve?: string;
    darkPurple?: string;
    backgroundBlack?: string;
    yellow?: string;
  }

  interface TypographyVariants {
    pokerTitle: React.CSSProperties;
    pokerButton: React.CSSProperties;
    pokerLabel: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    pokerTitle?: React.CSSProperties;
    pokerButton?: React.CSSProperties;
    pokerLabel?: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    pokerTitle: true;
    pokerButton: true;
    pokerLabel: true;
  }
}

// Custom colors
const colors = {
  black: "#161616",
  white: "#D1CCBF",
  yellow: "#A6924D",
  mauve: "#825A6D",
  darkPurple: "#523542",
  backgroundBlack: "#2B2B2B",
};

export const theme = createTheme({
  palette: {
    mode: "dark", // Assuming dark mode based on "backgroundBlack"
    background: {
      default: colors.black,
      paper: colors.backgroundBlack,
    },
    primary: {
      main: colors.yellow,
    },
    secondary: {
      main: colors.mauve,
    },
    common: {
      black: colors.black,
      white: colors.white,
    },
    // Custom colors
    mauve: colors.mauve,
    darkPurple: colors.darkPurple,
    backgroundBlack: colors.backgroundBlack,
    yellow: colors.yellow,
    text: {
      primary: colors.white,
    },
  },
  typography: {
    fontFamily: '"SuisseIntl", "SuisseWorks", sans-serif',
    pokerTitle: {
      fontFamily: "'SuisseWorks', serif",
      fontWeight: "bold",
      letterSpacing: "2px",
    },
    pokerButton: {
      fontFamily: "'SuisseWorks', serif",
      fontWeight: "500",
      letterSpacing: "1px",
    },
    pokerLabel: {
      fontFamily: "'SuisseWorks', serif",
      fontWeight: "500",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: colors.black,
          color: colors.white,
        },
      },
    },
  },
});
