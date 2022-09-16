/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from 'react'

/**
 * Only in client side
 */
export const useMount = (mount: () => void) => {
  const hasMountedRef = useRef(false)
  useEffect(() => {
    if (__SERVER__ || hasMountedRef.current) return
    hasMountedRef.current = true
    mount()
  }, [])
}
