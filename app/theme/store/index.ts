import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import { get } from 'lodash'
import type { PaletteMode } from '@mui/material'

import type { Themes } from '../themes'
import { setItem } from 'app/utils/cache/localStorage'

const path = 'theme'
export const THEME_MODE_KEY = 'THEME_MODE'

type SliceState = {
  data: {
    mode: PaletteMode
    theme: Themes
  }
}
const createInitialState = (): SliceState => ({
  data: {
    mode: 'light',
    theme: 'default',
  },
})

export const {
  actions: { setMode },
  reducer,
} = createSlice({
  name: path,
  initialState: createInitialState(),
  reducers: {
    setMode(state, action: PayloadAction<PaletteMode>) {
      if (state.data.mode === action.payload) return
      state.data.mode = action.payload
      setItem(THEME_MODE_KEY, action.payload)
    },
  },
})

export const select = (state: any): SliceState => get(state, path)
export const selectData = (state: any): SliceState['data'] => select(state).data

export default reducer
