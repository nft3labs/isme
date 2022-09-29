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
    gradient: true
    gradientOutlined: true
    twitter: true
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
    card: {
      shadow: string
      background: string
    }
    gradientColors: {
      main: string
      button: string
    }
    alternate: {
      main: string
      dark: string
    }
  }

  interface Palette {
    card: {
      shadow: string
      background: string
    }
    gradientColors: {
      main: string
      button: string
    }
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
  const { primary, gradientColors, card, text } = theme.palette

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
            borderRadius: 12,
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
            props: { variant: 'twitter' },
            style: {
              willChange: 'transform',
              color: '#fff',
              background: 'rgb(29, 155, 240)',
              transition: theme.transitions.create('background'),
              ':hover': {
                background: 'rgb(26, 140, 216)',
              },
            },
          },
          {
            props: { variant: 'twitter', size: 'small' },
            style: {
              padding: '8px 16px',
              fontSize: theme.typography.pxToRem(14),
            },
          },
          {
            props: { variant: 'gradient' },
            style: {
              willChange: 'transform',
              color: '#fff',
              backgroundImage: gradientColors.button,
              backgroundSize: '200%',
              transition: theme.transitions.create('all'),
              ':hover': {
                backgroundPosition: 'right',
              },
              ':disabled': {
                color: '#fff',
                opacity: '50%',
              },
            },
          },
          {
            props: { variant: 'gradient', size: 'small' },
            style: {
              padding: '8px 16px',
              fontSize: theme.typography.pxToRem(14),
            },
          },
          {
            props: { variant: 'gradient', size: 'large' },
            style: {
              padding: '8px 22px',
              fontSize: theme.typography.pxToRem(15),
            },
          },
          {
            props: { variant: 'gradientOutlined' },
            style: {
              willChange: 'transform',
              color: primary.main,
              backgroundImage: gradientColors.button,
              transition: theme.transitions.create('all'),
              ':hover': {
                color: '#fff',
                boxShadow: 'none',
              },
              ':disabled': {
                color: text.disabled,
                opacity: '50%',
              },
              border: 'solid 1px transparent',
              backgroundOrigin: 'border-box',
              boxShadow: '2px 1000px 1px #fff inset',
            },
          },
          {
            props: { variant: 'gradientOutlined', size: 'small' },
            style: {
              padding: '4px 10px',
              fontSize: theme.typography.pxToRem(13),
              large: {
                padding: '8px 22px',
                fontSize: theme.typography.pxToRem(15),
              },
            },
          },
          {
            props: { variant: 'gradientOutlined', size: 'large' },
            style: {
              padding: '8px 22px',
              fontSize: theme.typography.pxToRem(15),
            },
          },
          {
            props: { variant: 'contained' },
            style: {
              color: 'white'
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
            borderRadius: 20,
            background: card.background,
            shadow: card.shadow,
          },
        },
      },
      MuiPopover: {
        styleOverrides: {
          paper: {
            borderRadius: 12,
            background: card.background,
          },
        },
      },
      MuiList: {
        styleOverrides: {
          root: {
            padding: 0,
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
