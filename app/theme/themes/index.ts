import type { PaletteMode } from '@mui/material'
import type { ThemeOptions } from '@mui/material/styles'
import { createTheme, responsiveFontSizes } from '@mui/material/styles'
import { merge } from 'lodash'
import * as DefaultThemeOptions from './default'

export const themes = {
  default: DefaultThemeOptions,
}

export type Themes = keyof typeof themes

declare module '@mui/material/Button/Button' {
  interface ButtonPropsVariantOverrides {
    linear: true
    linearOutlined: true
    transOutlined: true
  }
}

declare module '@mui/material/styles/createPalette' {
  interface TypeBackground {
    paper: string
    default: string
    level2: string
    level1: string
    footer: string
    contrast: string
  }

  interface PaletteOptions {
    cardShadow?: string
    alternate: {
      main: string
      dark: string
    }
  }

  interface Palette {
    cardShadow?: string
    alternate: {
      main: string
      dark: string
    }
  }
}

declare module '@mui/material/styles' {
  interface PaletteColor {
    100: string
    200: string
    300: string
    400: string
  }
}

export const getTheme = (options: ThemeOptions) => {
  const theme = createTheme(options)
  const { primary } = theme.palette

  return createTheme(options, {
    zIndex: {
      appBar: 1200,
      drawer: 1300,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          '*': {
            margin: 0,
            padding: 0,
            boxSizing: 'border-box',
          },
          html: {
            width: '100%',
            height: '100%',
            WebkitOverflowScrolling: 'touch',
            MozOsxFontSmoothing: 'grayscale',
            WebkitFontSmoothing: 'antialiased',
          },
          body: { width: '100%', height: '100%' },
          '#__next': { width: '100%', height: '100%' },
          a: { textDecoration: 'none', color: primary.main },
          input: {
            '&[type=number]': {
              MozAppearance: 'textfield',
              '&::-webkit-outer-spin-button': {
                margin: 0,
                WebkitAppearance: 'none',
              },
              '&::-webkit-inner-spin-button': {
                margin: 0,
                WebkitAppearance: 'none',
              },
            },
          },
          '#root': { width: '100%', height: '100%' },
          '#nprogress .bar': {
            zIndex: '2000 !important',
            backgroundColor: primary.main,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 100,
            paddingTop: '0.75em',
            paddingBottom: '0.75em',
            paddingLeft: '1.5em',
            paddingRight: '1.5em',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
        },
        variants: [
          {
            props: { variant: 'linear', size: 'large' },
            style: {
              padding: '8px 22px',
              fontSize: theme.typography.pxToRem(15),
            },
          },
          {
            props: { variant: 'linearOutlined' },
            style: {
              willChange: 'transform',
              color: '#F94432',
              backgroundImage: `linear-gradient(135deg, ${primary.dark}, ${primary.main}, ${primary.dark})`,
              backgroundSize: '200%',
              transition: theme.transitions.create('all'),
              ':hover': {
                color: '#fff',
                boxShadow: 'none',
              },
              ':disabled': {
                color: '#F94432',
                opacity: '50%',
              },
              border: 'solid 1px transparent',
              backgroundOrigin: 'border-box',
              boxShadow: '2px 1000px 1px #fff inset',
            },
          },
          {
            props: { variant: 'transOutlined' },
            style: {
              color: '#fff',
              border: `1px solid ${primary.main}`,
              background: 'rgba(249, 68, 50, 0.12)',
              ':hover': {
                color: '#fff',
                background: primary.main,
                '.MuiButton-startIcon': {
                  color: '#fff',
                },
              },
              '.MuiButton-startIcon': {
                color: primary.main,
              },
            },
          },
        ],
      },
      MuiLink: {
        styleOverrides: {
          root: {
            '&:hover': {
              color: primary.main,
            },
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            borderRadius: 5,
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 5,
          },
          input: {
            borderRadius: 5,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
    },
  })
}

export type CreateThemeOptionsProps = {
  mode: PaletteMode
  themeOptions: {
    lightThemeOptions: ThemeOptions
    darkThemeOptions: ThemeOptions
  }
}

const withTypography = (options: any) => {
  const returnValue = merge(
    {
      typography: {
        fontFamily: ['Poppins', 'sans-serif'].join(','),
        button: {
          // fontSize: '1rem',
          textTransform: 'none',
          fontWeight: 'bold',
        },
      },
    },
    options
  )
  return returnValue
}

export const createThemeOptions = ({
  mode,
  themeOptions: { lightThemeOptions, darkThemeOptions },
}: CreateThemeOptionsProps) => {
  const options = mode === 'light' ? lightThemeOptions : merge({}, lightThemeOptions, darkThemeOptions)
  return responsiveFontSizes(createTheme(withTypography(options)))
}
