import { useMemo } from 'react'

export function useObjectMemo<T>(props: T): T {
  return useMemo(
    () => props,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    Object.keys(props).map((key) => (props as any)[key])
  )
}
