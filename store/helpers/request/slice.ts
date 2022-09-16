import type { AsyncThunk } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import { createRequestReducers, createRequestExtraReducers } from './reducers'
import { createUseRequestController } from './controller'
import { createRequestSelect } from './select'
import type { RequestSliceState } from './state'

export const createRequestSlice = <SliceState extends RequestSliceState, Returned, ThunkArg>(
  path: string,
  createInitialState: () => SliceState,
  request: AsyncThunk<Returned, ThunkArg, {}>
) => {
  const { actions, reducer } = createSlice({
    name: path,
    initialState: createInitialState(),
    reducers: createRequestReducers(),
    extraReducers: createRequestExtraReducers(request),
  })

  const select = createRequestSelect<SliceState>(path)
  const useRequestController = createUseRequestController<SliceState, Returned, ThunkArg>({ actions, request, select })

  return {
    reducer,
    select,
    useRequestController,
  }
}
