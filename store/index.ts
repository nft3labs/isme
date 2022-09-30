import type { ThunkAction, Action } from '@reduxjs/toolkit'
import { configureStore } from '@reduxjs/toolkit'

import theme from 'app/theme/store'
import progress from './progress'
// import user from 'domains/data/user/store'

export function makeStore() {
  return configureStore({
    reducer: {
      theme,
      progress,
      // user,
    },
  })
}

const store = makeStore()

export type AppState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action<string>>

export default store
