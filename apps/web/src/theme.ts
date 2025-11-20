import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#22c55e',
      dark: '#16a34a',
      darker: '#15803d',
      light: '#4ade80',
      lighter: '#86efac',
      lightest: '#dcfce7',
      contrastText: '#fff',
    },
    secondary: {
      main: '#14532d',
      light: '#166534',
      dark: '#052e16',
    },
    background: {
      default: '#f9fafb',
      paper: '#ffffff',
    },
    error: {
      main: '#dc2626',
    },
    warning: {
      main: '#eab308',
    },
    info: {
      main: '#3b82f6',
    },
    success: {
      main: '#22c55e',
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiTab: {
      styleOverrides: {
        root: ({ theme }) => ({
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.875rem',
          zIndex: 1,
          position: 'relative',
          '&.Mui-selected': {
            color: theme.palette.primary.darker,
          },
        }),
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.grey[100],
          borderRadius: theme.shape.borderRadius,
          padding: '0.25rem',
          minHeight: '2.5rem',
          position: 'relative',
        }),
        indicator: ({ theme }) => ({
          backgroundColor: theme.palette.primary.lightest,
          height: '100%',
          borderRadius: theme.shape.borderRadius * 0.5,
          zIndex: 0,
        }),
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: theme.shape.borderRadius,
          boxShadow: theme.shadows[1],
        }),
      },
    },
  },
});

// Extend the palette type
declare module '@mui/material/styles' {
  interface PaletteColor {
    darker?: string;
    lighter?: string;
    lightest?: string;
  }
  interface SimplePaletteColorOptions {
    darker?: string;
    lighter?: string;
    lightest?: string;
  }
}
