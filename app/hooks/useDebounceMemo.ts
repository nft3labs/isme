/* eslint-disable react-hooks/exhaustive-deps */
import type { DependencyList } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { debounce } from 'lodash'
import { useLatest } from './useLatest'

export const useDebounceMemo = <T>(factory: () => T, deps: DependencyList, wait = 250) => {
  const [returnValue, setReturnValue] = useState<T>()

  const factoryRef = useLatest(factory)

  const debounceFactory = useCallback(
    debounce(() => setReturnValue(factoryRef.current), wait),
    []
  )

  useEffect(() => {
    debounceFactory()
  }, deps)

  return returnValue
}
