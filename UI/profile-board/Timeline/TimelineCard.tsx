import Avatar from '@mui/material/Avatar'
import { styled } from '@mui/material/styles'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import { Paragraph } from 'components/Typography'
import { useNFT3Profile, useNFT3 } from 'domains/data'
import { format as formatData } from 'date-fns'
import { safeGet } from 'app/utils/get'
import type { TimelineRecord } from '@nft3sdk/client'

const ROOT = styled(Card)``
const Content = styled(CardContent)`
  display: flex;
`

const TimelineCard: FC<TimelineRecord> = ({ timestamp, ...others }) => {
  const { format } = useNFT3()
  const { profile } = useNFT3Profile()
  return (
    <ROOT>
      <Content>
        <Avatar alt={profile.name} src={format(profile.avatar)} />
        <Stack spacing={2}>
          <Paragraph>{profile.name}</Paragraph>
          <Paragraph>{safeGet(() => formatData(parseInt(timestamp) * 1000, 'MM/dd HH:mm')) || '-'}</Paragraph>
          <Paragraph>{JSON.stringify(others, null, 2)}</Paragraph>
        </Stack>
      </Content>
    </ROOT>
  )
}

export default TimelineCard
