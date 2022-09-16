import { useCallback, useState, useRef } from 'react'

import { useObjectMemo } from 'app/hooks/useValues'

export function usePost<T, A extends Array<any>>(fn: (...args: A) => Promise<T>) {
  const [loading, setLoading] = useState(false)
  const isCanceledRef = useRef(false)

  const post = useCallback(
    (...args: A) => {
      if (loading) return Promise.reject()
      setLoading(true)
      isCanceledRef.current = false
      return fn(...args)
        .then((data) => {
          if (isCanceledRef.current) return Promise.reject('canceled')
          return data
        })
        .finally(() => setLoading(false))
    },
    [fn, loading]
  )

  const cancel = useCallback(() => (isCanceledRef.current = false), [])

  return useObjectMemo({ post, cancel, loading })
}

export type UseRequestReturnValue = ReturnType<typeof usePost>
