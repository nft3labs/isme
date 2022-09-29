import { useCallback, useMemo, useState } from 'react'
import Avatar from '@mui/material/Avatar'
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import { H4, Paragraph } from 'components/Typography'
import { useNFT3, useUser, useNFT3Follow } from 'domains/data'
import { useFollow } from 'domains/data/nft3/follow/hooks'

import type { FollowMember } from './types'
import { createToastifyPromise } from 'app/utils/promise/toastify'
import { useDebounceMemo } from 'app/hooks/useDebounceMemo'
import { useNumberFormat } from 'app/utils/number/hooks'
import { getDefaultProfileAvatar } from 'domains/data/nft3/profile/adapter/profileAvatar'

const ROOT = styled(Card)``
const Content = styled(CardContent)`
  display: flex;
  justify-content: space-between;
`
const CardActions = styled(Box)``

const FollowCard: FC<FollowMember> = (props) => {
  const { bio, identifier } = props
  const avatar = useMemo(() => props.avatar || getDefaultProfileAvatar(props.name), [props.avatar, props.name])
  const { identifier: did, selectDialog } = useUser()
  const { format } = useNFT3()
  const { checkUserFollow } = useNFT3Follow()
  const { count, follow, unfollow, check } = useFollow(identifier)
  const [followed, setFollowed] = useState(false)
  const checkFollow = useCallback(() => {
    if (!did || !identifier) return
    return check(did, identifier).then((result) => {
      setFollowed(result)
    })
  }, [check, did, identifier])

  useDebounceMemo(() => {
    checkFollow()
  }, [checkFollow])

  const userFollow = useCallback(() => {
    return createToastifyPromise(
      follow().then(() => {
        checkFollow()
        checkUserFollow()
      })
    )
  }, [checkFollow, checkUserFollow, follow])

  const userUnfollow = useCallback(() => {
    return createToastifyPromise(
      unfollow().then(() => {
        checkFollow()
        checkUserFollow()
      })
    )
  }, [checkFollow, checkUserFollow, unfollow])

  const name = useMemo(() => {
    if (props.name) return props.name
    if (!identifier) return undefined
    const arr = identifier.split(':')
    return arr[arr.length - 1] + '.isme'
  }, [identifier, props.name])

  const followContent = useMemo(() => {
    if (did === identifier) return null
    return followed ? (
      <Button variant="outlined" color="error" size="small" onClick={() => userUnfollow()}>
        Unfollow
      </Button>
    ) : (
      <Button
        size="small"
        variant="gradient"
        onClick={() => {
          if (!did) return selectDialog.open()
          userFollow()
        }}
      >
        Follow
      </Button>
    )
  }, [did, followed, identifier, selectDialog, userFollow, userUnfollow])

  const NF = useNumberFormat()

  return (
    <ROOT>
      <Content>
        <Stack
          spacing={2}
          direction="row"
          sx={{
            flex: 1,
          }}
        >
          <Avatar alt={name} sx={{ width: 60, height: 60 }} src={format(avatar)} />
          <Stack spacing={1}>
            <H4>{name}</H4>
            <Paragraph sx={{ color: 'grey.700' }}>
              {NF.format(count.followers, NF.getOptions('number'))} Followers
            </Paragraph>
            <Paragraph sx={{ color: 'grey.400' }}>{bio}</Paragraph>
          </Stack>
        </Stack>
        <CardActions>{followContent}</CardActions>
      </Content>
    </ROOT>
  )
}

export default FollowCard
