import { styled } from '@mui/material/styles'

import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'

import { H4, H5, Span } from 'components/Typography'
import { useUser } from 'domains/data'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { format as formatData } from 'date-fns'
import { useRouter } from 'next/router'

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
  const router = useRouter()

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

  const formatDid = (did: string) => {
    if (!did) return undefined
    const arr = did.split(':')
    return arr[arr.length - 1] + '.isme'
  }

  const goToProfileBoard = (name: string) => router.push(`/` + name)

  return (
    <ROOT spacing={2}>
      <H4>Invitees</H4>
      {/* {JSON.stringify(invitees)} */}
      {invitees.map(({ __owner, createdAt }) => (
        <Stack key={__owner} direction='row' justifyContent='space-between' padding={2} alignItems='center'>
          <Stack spacing={0.5}>
            <H5
              fontWeight='medium'
              sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
              onClick={() => goToProfileBoard(formatDid(__owner))}
            >
              {formatDid(__owner)}
            </H5>
            {/* <Span color='text.disabled'>Joined {formatData(createdAt * 1000 || 0, 'dd MMM yyyy hh:mm')}</Span> */}
          </Stack>
          <Span color='text.disabled'>Joined {formatData(createdAt * 1000 || 0, 'dd MMM yyyy hh:mm')}</Span>
        </Stack>
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
