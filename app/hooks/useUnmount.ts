/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { useLatest } from './useLatest'

export const useUnmount = (unmount: () => void) => {
  const unmountRef = useLatest(unmount)

  useEffect(
    () => () => {
      unmountRef.current()
    },
    []
  )
}
