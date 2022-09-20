import Avatar from '@mui/material/Avatar'
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Stack from '@mui/material/Stack'
import { Paragraph } from 'components/Typography'
import { useNFT3Follow, useNFT3, useUser } from 'domains/data'

import type { FollowMember } from './types'
import { useMemo } from 'react'

const ROOT = styled(Card)``
const Content = styled(CardContent)`
  display: flex;
`

const FolloweCard: FC<FollowMember> = (props) => {
  const { avatar, bio, identifier } = props
  const { didname, selectDialog } = useUser()
  const { follow, unfollow } = useNFT3Follow()
  const { format } = useNFT3()

  const name = useMemo(() => {
    if (props.name) return props.name
    if (!identifier) return undefined
    const arr = identifier.split(':')
    return arr[arr.length - 1] + '.isme'
  }, [identifier, props.name])

  return (
    <ROOT>
      <Content>
        <Avatar alt={name} src={format(avatar)} />
        <Stack spacing={2}>
          <Paragraph>{name}</Paragraph>
          <Paragraph>? Followers</Paragraph>
          <Paragraph>{bio}</Paragraph>
        </Stack>
      </Content>
      <CardActions>
        <Button
          size="small"
          onClick={() => {
            if (!didname) return selectDialog.open()
            follow()
          }}
        >
          Follow
        </Button>
        <Button size="small" onClick={() => unfollow()}>
          Unfollow
        </Button>
      </CardActions>
    </ROOT>
  )
}

export default FolloweCard
