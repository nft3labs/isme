import type { AsyncThunkPayloadCreator } from '@reduxjs/toolkit/dist/createAsyncThunk'
import { createAsyncThunk } from '@reduxjs/toolkit'

import { safeGet } from 'app/utils/get'

import { createRequestSlice } from './slice'
import { createRequestState } from './state'

export const createStoreRequest =
  <SliceState>(key: string) =>
  <Returned, ThunkArg = void>(request: AsyncThunkPayloadCreator<Returned, ThunkArg, {}>) => {
    return createRequestSlice(
      key,
      createRequestState<SliceState>(),
      createAsyncThunk(`${key}/request`, request, {
        serializeError: (e) =>
          safeGet(() => {
            const { name, url, body } = e as any
            return {
              name,
              url,
              body,
            }
          }) || e,
      })
    )
  }
