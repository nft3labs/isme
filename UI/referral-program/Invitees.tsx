import { styled } from '@mui/material/styles'
import Image from 'next/image'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

import { H3, Paragraph } from 'components/Typography'
import { useUser } from 'domains/data'
import { useCallback, useEffect, useMemo, useState } from 'react'

const ROOT = styled(Stack)``
const REQUEST_LIMIT = 10

type ReferrerModel = {
  referrer_did: string
  __owner: string
  createdAt: number
  updatedAt: number
}

const Invitees: FC = () => {
  const { did, client } = useUser()

  const [internalLoading, setLoading] = useState(false)
  const [offset, setOffset] = useState(0)
  const [invitees, setInvitees] = useState<ReferrerModel[]>([])
  const [isEnd, setIsEnd] = useState(false)
  const loading = useMemo(() => internalLoading || isEnd, [internalLoading, isEnd])

  const request = useCallback(
    (offset: number) => {
      if (!did) {
        setIsEnd(false)
        setInvitees([])
        return
      }
      if (loading) return
      setLoading(true)
      return client.referrer
        .list(did, offset, REQUEST_LIMIT)
        .then((invitees) => invitees || [])
        .then((value) => {
          setInvitees((invitees) => [...invitees, ...value])
          if (value.length < REQUEST_LIMIT) {
            setIsEnd(true)
          }
        })
        .finally(() => {
          setLoading(false)
        })
    },
    [client.referrer, did, loading]
  )

  const loadMoreData = useCallback(() => {
    const o = offset + REQUEST_LIMIT
    setOffset(o)
    request(o)
  }, [offset, request])

  const reset = useCallback(() => {
    setLoading(false)
    setOffset(0)
    setInvitees([])
    setIsEnd(false)
  }, [])

  useEffect(() => {
    reset()
  }, [did, reset])

  useEffect(() => {
    request(0)
  }, [request])

  return (
    <ROOT spacing={2}>
      <H3>Invitees</H3>
      {JSON.stringify(invitees)}
      {isEnd ? (
        <Button size="small" disabled>
          No more data
        </Button>
      ) : (
        <Button size="small" disabled={loading} onClick={loadMoreData}>
          Load More
        </Button>
      )}
    </ROOT>
  )
}

export default Invitees
