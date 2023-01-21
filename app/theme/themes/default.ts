import type { ThemeOptions } from '@mui/material/styles'
import { alpha } from '@mui/material/styles'
import { getShadows } from './utils'

const primaryMain = '#00EA75'
const secondaryMain = '#00A3FF'
const gradientColorMain = `linear-gradient(90deg, ${primaryMain}, ${secondaryMain})`
const gradientColorButton = `linear-gradient(90deg, ${primaryMain}, ${primaryMain}, ${secondaryMain})`

export const lightThemeOptions: ThemeOptions = {
  palette: {
    alternate: {
      main: '#f7faff',
      dark: '#edf1f7',
    },
    gradientColors: {
      main: gradientColorMain,
      button: gradientColorButton,
    },
    card: {
      shadow: 'rgba(140, 152, 164, .13)',
      background: '#fff',
    },
    mode: 'light',
    primary: {
      main: primaryMain,
      // light: '#ffd6a8',
      // dark: '#f0b068',
      contrastText: '#fff',
      100: alpha(primaryMain, 0.08),
      200: alpha(primaryMain, 0.2),
      300: alpha(primaryMain, 0.3),
      400: alpha(primaryMain, 0.4),
    },
    secondary: {
      main: secondaryMain,
      // main: secondaryMain,
      // dark: '#e2e2e2',
      // contrastText: '#3D3D3D',
      100: alpha(secondaryMain, 0.08),
      200: alpha(secondaryMain, 0.2),
      300: alpha(secondaryMain, 0.3),
      400: alpha(secondaryMain, 0.4),
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
    },
    divider: 'rgba(0, 0, 0, 0.05)',
    background: {
      paper: '#FBFDFF',
      default: '#ffffff',
      level2: '#f8f8f8',
      level1: '#ffffff',
      contrast: '#222222',
    },
    error: {
      main: '#ED6A6A',
      dark: '#ce2b29',
      light: '#ff8685',
    },
    success: {
      main: '#379c84',
      dark: '#237c67',
      light: '#5abda5',
    },
    warning: {
      main: '#f48d53',
      dark: '#ec6e27',
      light: '#ffb48a',
    },
    info: {
      main: '#587cd4',
      dark: '#4d6dbc',
      light: '#8ba8f1',
    },
  },
  shadows: getShadows('#8C98A4'),
}

export const darkThemeOptions: ThemeOptions = {
  palette: {
    alternate: {
      main: '#1a2138',
      dark: '#151a30',
    },
    card: {
      shadow: 'rgba(0, 0, 0, .11)',
      background: '#FBFDFF',
    },
    gradientColors: {
      main: gradientColorMain,
      button: gradientColorButton,
    },
    common: {
      black: '#000',
      white: '#fff',
    },
    mode: 'dark',
    primary: {
      main: '#1976d2',
      light: '#2196f3',
      dark: '#0d47a1',
      contrastText: '#fff',
    },
    secondary: {
      light: '#FFEA41',
      main: '#FFE102',
      dark: '#DBBE01',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    text: {
      primary: '#EEEEEF',
      secondary: '#AEB0B4',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
    background: {
      paper: '#222B45',
      default: '#222B45',
      level2: '#333',
      level1: '#2D3748',
    },
  },
  shadows: getShadows('#000000'),
}
