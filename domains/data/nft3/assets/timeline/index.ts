import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ROOTQueryer, TimelineRecord } from '@rootlabs/client'

const REQUEST_LIMIT = 10
type TimelineProps = {
  queryer: ROOTQueryer
  baseData: TimelineRecord[]
  baseLoading: boolean
  identifier: any
}
export const useTimeline = (props: TimelineProps) => {
  const { queryer, baseData, baseLoading, identifier } = props
  const [internalLoading, setLoading] = useState(false)
  const [offset, setOffset] = useState(0)
  const [timeline, setTimeline] = useState<TimelineRecord[]>([])
  const [isEnd, setIsEnd] = useState(false)
  const loading = useMemo(() => baseLoading || internalLoading || isEnd, [baseLoading, internalLoading, isEnd])

  const data = useMemo(() => {
    return [...baseData, ...timeline]
  }, [baseData, timeline])

  const request = useCallback(
    (offset: number) => {
      if (!identifier) {
        setIsEnd(false)
        setTimeline([])
        return
      }
      if (loading) return
      setLoading(true)
      return queryer
        .query({
          timeline: {
            did: identifier,
            offset,
            limit: REQUEST_LIMIT,
          },
        })
        .then(({ timeline }) => timeline || [])
        .then((value) => {
          setTimeline((timeline) => [...timeline, ...value])
          if (value.length < REQUEST_LIMIT) {
            setIsEnd(true)
          }
        })
        .finally(() => {
          setLoading(false)
        })
    },
    [identifier, loading, queryer]
  )

  const loadMoreData = useCallback(() => {
    const o = offset + REQUEST_LIMIT
    setOffset(o)
    request(o)
  }, [offset, request])

  const reset = useCallback(() => {
    setLoading(false)
    setOffset(0)
    setTimeline([])
    setIsEnd(false)
  }, [])

  useEffect(() => {
    reset()
  }, [identifier, reset])

  return {
    data,
    loading,
    isEnd,
    loadMoreData,
  }
}
