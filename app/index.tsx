import CssBaseline from '@mui/material/CssBaseline'
import type { AppProps } from 'next/app'

import { createContext } from 'app/utils/createContext'
import { ToastContainer } from 'lib/toastify'
import ActiveLayout from 'UI/layouts'

import ThemeProvider from './theme'

// import { useRouteChange } from './router'

export function useAppService() {
  // useRouteChange()
}

export const { Context, Provider: APP, createUseContext } = createContext(useAppService)
export const useApp = createUseContext()

export type MyAppProps = AppProps
export const Provider: FC<MyAppProps> = ({ Component, pageProps }) => {
  return (
    <ThemeProvider>
      <CssBaseline />
      <APP>
        <ActiveLayout>
          <Component {...pageProps} />
        </ActiveLayout>
        <ToastContainer />
      </APP>
    </ThemeProvider>
  )
}
export default Provider
