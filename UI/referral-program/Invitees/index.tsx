import { styled } from '@mui/material/styles'

import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'

import { H4 } from 'components/Typography'
import { useUser } from 'domains/data'
import { useCallback, useEffect, useMemo, useState } from 'react'

import Inviter from './Inviter'

const ROOT = styled(Stack)``
const REQUEST_LIMIT = 10

export type ReferrerModel = {
  referrer_did: string
  __owner: string
  createdAt: number
  updatedAt: number
}

const Invitees: FC = () => {
  const { identifier, client } = useUser()

  const [internalLoading, setLoading] = useState(false)
  const [offset, setOffset] = useState(0)
  const [invitees, setInvitees] = useState<ReferrerModel[]>([])
  const [isEnd, setIsEnd] = useState(false)
  const loading = useMemo(() => internalLoading || isEnd, [internalLoading, isEnd])

  const request = useCallback(
    (offset: number) => {
      if (!identifier) {
        setIsEnd(false)
        setInvitees([])
        return
      }
      if (loading) return
      setLoading(true)
      return client.referrer
        .list(identifier, offset, REQUEST_LIMIT)
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
    [client.referrer, identifier, loading]
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
    request(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identifier])

  return (
    <ROOT spacing={2}>
      <H4>Invitees</H4>
      {/* {JSON.stringify(invitees)} */}
      {invitees.map((inviter) => (
        <Inviter inviter={inviter} key={inviter.__owner} />
      ))}
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
