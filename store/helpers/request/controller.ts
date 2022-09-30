import { useRef, useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import type { AsyncThunk } from '@reduxjs/toolkit'

import { useLatest } from 'app/hooks/useLatest'
import { useObjectMemo } from 'app/hooks/useValues'
import { useAppDispatch } from 'store/hooks'

import type { RequestSliceState } from './state'
import { REQUEST_STATUS } from './state'
import type { RequestSelect } from './select'
import type { RequestActions } from './reducers'

type CreateUseRequestControllerProps<SliceState extends RequestSliceState, Returned, ThunkArg> = {
  request: AsyncThunk<Returned, ThunkArg, {}>
  select: RequestSelect<SliceState>
  actions: RequestActions
}

export const createUseRequestController = <SliceState extends RequestSliceState, Returned, ThunkArg>(
  props: CreateUseRequestControllerProps<SliceState, Returned, ThunkArg>
) => {
  const {
    request,
    select: { selectStatus },
    actions: { setStatus },
  } = props

  const usePolling = () => {
    const status = useSelector(selectStatus)
    const dispatch = useAppDispatch()
    const abortFnRef = useRef<() => void>()
    const statusRef = useLatest(status)
    const timerRef = useRef<ReturnType<typeof setTimeout>>()
    const run = useCallback(
      (props: ThunkArg, ms = 5000) => {
        const status = statusRef.current
        if (status !== REQUEST_STATUS.ready) return

        dispatch(setStatus(REQUEST_STATUS.polling))
        const fn = () => {
          const promise = dispatch(request(props))
          abortFnRef.current = () => promise.abort()
          return promise.then((action: any) => {
            if (action.error?.name === 'AbortError') return
            timerRef.current = setTimeout(() => fn(), ms)
          })
        }

        fn()
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [dispatch]
    )

    const stop = useCallback(() => {
      const status = statusRef.current
      if (status !== REQUEST_STATUS.polling) return

      dispatch(setStatus(REQUEST_STATUS.ready))
      if (abortFnRef.current) abortFnRef.current()
      clearTimeout(timerRef.current)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch])

    const restart = useCallback((props: ThunkArg) => {
      const status = statusRef.current
      if (status !== REQUEST_STATUS.polling) return
      stop()
      run(props)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const returnValue = useObjectMemo({
      run,
      stop,
      restart,
    })

    // useWhyDidYouUpdate('usePolling', returnValue)
    return returnValue
  }

  const useSingle = () => {
    const status = useSelector(selectStatus)
    const dispatch = useAppDispatch()
    const abortFnRef = useRef<() => void>()
    const statusRef = useLatest(status)

    const run = useCallback(
      (props: ThunkArg) => {
        const status = statusRef.current
        if (status !== REQUEST_STATUS.ready) return Promise.reject({ name: 'RunningError', message: 'Running' })
        dispatch(setStatus(REQUEST_STATUS.single))
        const promise = dispatch(request(props))
        abortFnRef.current = () => promise.abort()
        return promise
          .then((action: any) => {
            if (action.error) return Promise.reject(action)
            return action.data
          })
          .finally(() => {
            dispatch(setStatus(REQUEST_STATUS.ready))
          })
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [dispatch]
    )

    const stop = useCallback(() => {
      const status = statusRef.current
      if (status !== REQUEST_STATUS.single) return

      dispatch(setStatus(REQUEST_STATUS.ready))
      if (abortFnRef.current) abortFnRef.current()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch])

    const returnValue = useObjectMemo({
      run,
      stop,
    })

    // useWhyDidYouUpdate('useSingle', returnValue)
    return returnValue
  }

  const useRequestController = () => {
    const polling = usePolling()
    const single = useSingle()

    const useAutoPolling = useCallback(
      (query: ThunkArg, isStop: (query: ThunkArg) => boolean, ms: number, delay = 500) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
          if (isStop(query)) return
          const timer = setTimeout(() => {
            polling.run(query, ms)
          }, delay)
          return () => {
            clearTimeout(timer)
            polling.stop()
          }
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [query])
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
    )

    const returnValue = useObjectMemo({
      polling,
      single,
      usePolling: useAutoPolling,
    })
    return returnValue
  }

  return useRequestController
}
