import type { ActionReducerMapBuilder, AsyncThunk, PayloadAction, Slice } from '@reduxjs/toolkit'
import type { NoInfer } from '@reduxjs/toolkit/dist/tsHelpers'
import { safeGet } from 'app/utils/get'
import { isEqual } from 'lodash'

import type { RequestSliceState, REQUEST_STATUS } from './state'

export const createRequestReducers = () => ({
  setStatus(state: any, action: PayloadAction<REQUEST_STATUS>) {
    state.status = action.payload
  },
})

type RequestSlice = Slice<any, ReturnType<typeof createRequestReducers>>
export type RequestActions = RequestSlice['actions']

type CreateRequestExtraReducers = (
  request: AsyncThunk<any, any, {}>
) => (builder: ActionReducerMapBuilder<NoInfer<RequestSliceState>>) => void

export const createRequestExtraReducers: CreateRequestExtraReducers = (request) => (builder) => {
  builder
    .addCase(request.pending, (state) => {
      state.loading = true
    })
    .addCase(request.fulfilled, (state, action) => {
      state.loading = false
      const payload = safeGet(() => action.payload.data || action.payload)

      if (!isEqual(state.data, payload)) {
        state.data = payload
      }
      state.error = undefined
    })
    .addCase(request.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload || action.error
    })
}
