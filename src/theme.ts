import {
  createTheme,
  type PaletteOptions,
  type SimplePaletteColorOptions,
} from '@mui/material';

export const customPrimaryColor: SimplePaletteColorOptions = {
  light: '#2d406e',
  main: '#2d406e',
  dark: '#2d406e',
  contrastText: '#ffffff',
};

export const customSecondaryColor: SimplePaletteColorOptions = {
  light: '#00bbff',
  main: '#00bbff',
  dark: '#00bbff',
  contrastText: '#ffffff',
};

export const customInfoColor: SimplePaletteColorOptions = {
  light: '#d9d9d9',
  main: '#c2c2c2',
  dark: '#474747',
  contrastText: '#ffffff',
};

export const customErrorColor: SimplePaletteColorOptions = {
  light: '#fb489c',
  main: '#fb489c',
  dark: '#fb489c',
  contrastText: '#ffffff',
};

export const customWarningColor: SimplePaletteColorOptions = {
  light: '#b412ff',
  main: '#b412ff',
  dark: '#b412ff',
  contrastText: '#ffffff',
};

const customPalette: PaletteOptions = {
  primary: customPrimaryColor,
  secondary: customSecondaryColor,
  info: customInfoColor,
  error: customErrorColor,
  warning: customWarningColor,
  /*
  excel: customExcelColor,
   */
  text: {
    primary: '#333333',
  },
  background: {
    default: '#eeeeee',
  },
};

export const theme = createTheme({
  palette: customPalette,
  typography: {
    fontFamily: 'Noto Sans KR',
    fontSize: 16,
  },
  mixins: {},
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          fontFamily: 'Noto Sans KR',
        },
        body: {
          width: '100%',
        },
      },
    },
    MuiTypography: {
      defaultProps: {
        variant: 'md',
      },
      styleOverrides: {
        root: {
          minWidth: 'fit-content',
          lineHeight: 'normal',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: '1',
          WebkitBoxOrient: 'vertical',
        },
      },
      variants: [
        {
          props: { variant: 'xs' },
          style: {
            fontSize: 12,
          },
        },
        {
          props: { variant: 'sm' },
          style: {
            fontSize: 14,
            fontWeight: 600,
          },
        },
        {
          props: { variant: 'md' },
          style: {
            fontSize: 16,
            fontWeight: 600,
          },
        },
        {
          props: { variant: 'lg' },
          style: {
            fontSize: 18,
            fontWeight: 600,
          },
        },
        {
          props: { variant: 'xl' },
          style: {
            fontSize: 20,
            fontWeight: 800,
          },
        },
        {
          props: { variant: 'xxl' },
          style: {
            fontSize: 22,
            fontWeight: 800,
          },
        },
        {
          props: { variant: 'xxxl' },
          style: {
            fontSize: 24,
            fontWeight: 900,
          },
        },
      ],
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0px 1px 4px 0px #0000001A',
        },
      },
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          width: '100%',
          justifyContent: 'center',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: 'white',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: 16,
          padding: 6,
        },
        sizeSmall: {
          height: 34,
          fontWeight: 900,
        },
        sizeMedium: {
          fontSize: 20,
          fontWeight: 900,
        },
      },
      variants: [
        {
          props: { size: 'square' },
          style: {
            fontSize: 24,
            fontWeight: 800,
            minWidth: 32,
            height: 32,
            padding: 'unset',
            boxShadow: 'none',
          },
        },
        {
          props: { size: 'smallFit' },
          style: {
            fontSize: 14,
            fontWeight: 800,
            minWidth: 'fit-content',
            minheight: 'fit-content',
            padding: 'unset',
            '&:hover': {
              backgroundColor: 'transparent',
            },
          },
        },
        {
          props: { size: 'smallPill' },
          style: {
            height: 34,
            fontWeight: 900,
            borderRadius: 80,
          },
        },
      ],
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          width: 80,
          height: 30,
        },
        select: {
          padding: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
      },
    },
  },
});
