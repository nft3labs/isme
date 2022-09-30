import { useMemo } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

import { useMount } from 'app/hooks/useMount'
import { getItem } from 'app/utils/cache/localStorage'
import { createContext } from 'app/utils/createContext'

import { useAppDispatch, useAppSelector } from 'store/hooks'
import { selectData, THEME_MODE_KEY, setMode } from './store'

import { createThemeOptions, getTheme, themes } from './themes'

export const useThemeService = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const storeData = useAppSelector(selectData)
  const dispatch = useAppDispatch()

  const theme = useMemo(() => {
    const { mode, theme } = storeData
    const returnValue = getTheme(
      createThemeOptions({
        mode: mode,
        themeOptions: themes[theme],
      })
    )
    if (!__SERVER__ && __DEV__) {
      ;(window as any).theme = returnValue
      console.log('[@mui/material/styles] theme update', {
        mode,
        theme: returnValue,
      })
    }
    return returnValue
  }, [storeData])

  useMount(() => {
    const defaultMode = prefersDarkMode ? 'dark' : 'light'
    const memoryMode = getItem(THEME_MODE_KEY)
    if (memoryMode != storeData.mode) {
      dispatch(setMode(memoryMode || defaultMode))
    }
  })

  return {
    theme,
  }
}

export const { Context, Provider: BaseThemeProvider, createUseContext } = createContext(useThemeService)
export const useBaseTheme = createUseContext()

const Theme: FC = (props) => {
  const { theme } = useBaseTheme()
  return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
}

const BaseTheme: FC = (props) => {
  return (
    <BaseThemeProvider>
      <Theme>{props.children}</Theme>
    </BaseThemeProvider>
  )
}

export default BaseTheme
