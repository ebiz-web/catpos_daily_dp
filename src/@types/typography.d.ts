import '@mui/material/Typography';

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
    xxl: true;
    xxxl: true;
  }
}
