import { useCallback, useMemo, useState } from 'react'
import Avatar from '@mui/material/Avatar'
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Stack from '@mui/material/Stack'
import { Paragraph } from 'components/Typography'
import { useNFT3, useUser } from 'domains/data'
import { useFollow } from 'domains/data/nft3/follow/hooks'

import type { FollowMember } from './types'
import { createToastifyPromise } from 'app/utils/promise/toastify'
import { useDebounceMemo } from 'app/hooks/useDebounceMemo'

const ROOT = styled(Card)``
const Content = styled(CardContent)`
  display: flex;
`

const FolloweCard: FC<FollowMember> = (props) => {
  const { avatar, bio, identifier } = props
  const { identifier: did, selectDialog } = useUser()
  const { format } = useNFT3()
  const { count, follow, unfollow, check } = useFollow(identifier)
  const [followed, setFollowed] = useState(false)
  const checkUserFollow = useCallback(() => {
    if (!did || !identifier) return
    return check(did, identifier).then((result) => {
      setFollowed(result)
    })
  }, [check, did, identifier])

  useDebounceMemo(() => {
    checkUserFollow()
  }, [checkUserFollow])

  const userFollow = useCallback(() => {
    return createToastifyPromise(follow().then(() => checkUserFollow()))
  }, [checkUserFollow, follow])

  const userUnfollow = useCallback(() => {
    return createToastifyPromise(unfollow().then(() => checkUserFollow()))
  }, [checkUserFollow, unfollow])

  const name = useMemo(() => {
    if (props.name) return props.name
    if (!identifier) return undefined
    const arr = identifier.split(':')
    return arr[arr.length - 1] + '.isme'
  }, [identifier, props.name])

  const followContent = useMemo(() => {
    if (did === identifier) return null
    return followed ? (
      <Button size="small" onClick={() => userUnfollow()}>
        Unfollow
      </Button>
    ) : (
      <Button
        size="small"
        onClick={() => {
          if (!did) return selectDialog.open()
          userFollow()
        }}
      >
        Follow
      </Button>
    )
  }, [did, followed, identifier, selectDialog, userFollow, userUnfollow])

  return (
    <ROOT>
      <Content>
        <Avatar alt={name} src={format(avatar)} />
        <Stack spacing={2}>
          <Paragraph>{name}</Paragraph>
          <Paragraph>{count.followers} Followers</Paragraph>
          <Paragraph>{bio}</Paragraph>
        </Stack>
      </Content>
      <CardActions>{followContent}</CardActions>
    </ROOT>
  )
}

export default FolloweCard
