import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'store/hooks'
import { clamp, get } from 'lodash'
import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import { useLatest } from 'app/hooks/useLatest'
import { useObjectMemo } from 'app/hooks/useValues'
import { createPromise } from 'app/utils/promise'

const TRICKLE_SPEED = 800
const TRICKLE_RATE = 0.02
const SPEED = 200

export interface ProgressSliceState {
  value: number
  status: PROGRESS_STATUS
}

export enum PROGRESS_STATUS {
  ready = 'ready',
  done = 'done',
  process = 'process',
}

export const createProgressSliceState = (): ProgressSliceState => ({
  value: 0,
  status: PROGRESS_STATUS.ready,
})

export const createProgressSlice = (path: string) => {
  const {
    actions: { setStatus, setValue },
    reducer,
  } = createSlice({
    name: path,
    initialState: createProgressSliceState(),
    reducers: {
      setStatus(state, action: PayloadAction<ProgressSliceState['status']>) {
        state.status = action.payload
      },
      setValue(state, action: PayloadAction<ProgressSliceState['value']>) {
        state.value = clamp(action.payload, 0, 0.994) * 100
      },
    },
  })

  const select = (state: any): ProgressSliceState => get(state, path)

  const useProgressController = () => {
    const state = useSelector(select)
    const dispatch = useAppDispatch()
    const statusRef = useLatest(state)

    const queue = useCallback(<T>(fn: () => T) => {
      const { promise, reslove } = createPromise<T>()
      setTimeout(() => reslove(fn()), SPEED)
      return promise
    }, [])

    const start = useCallback(() => {
      const { status } = statusRef.current
      if (status !== PROGRESS_STATUS.ready) return false
      dispatch(setValue(0))
      dispatch(setStatus(PROGRESS_STATUS.process))
      const fn = () => {
        setTimeout(() => {
          const { status, value } = statusRef.current
          if (status !== PROGRESS_STATUS.process) return
          const amount = Math.random() * TRICKLE_RATE
          queue(() => dispatch(setValue(value + amount))).then(fn)
        }, TRICKLE_SPEED)
      }
      fn()
      return true
    }, [dispatch, queue, statusRef])

    const done = useCallback(async () => {
      const { status, value } = statusRef.current
      if (status !== PROGRESS_STATUS.process) return
      dispatch(setStatus(PROGRESS_STATUS.done))
      const amount = 0.3 + 0.5 * Math.random()
      await queue(() => dispatch(setValue(value + amount)))
      await queue(() => dispatch(setValue(1)))
      await queue(() => dispatch(setStatus(PROGRESS_STATUS.ready)))
    }, [dispatch, queue, statusRef])

    const returnValue = useObjectMemo({
      start,
      done,
    })
    return returnValue
  }

  return {
    reducer,
    select,
    useProgressController,
  }
}
