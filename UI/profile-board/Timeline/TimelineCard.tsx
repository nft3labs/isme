import { Fragment } from 'react'
import Avatar from '@mui/material/Avatar'
import { styled } from '@mui/material/styles'
import Card from '@mui/material/Card'
import Link from '@mui/material/Link'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import { Paragraph, H4, Tiny } from 'components/Typography'
import { useNFT3Profile, useNFT3, useNFT3Wallet } from 'domains/data'
import { format as formatData } from 'date-fns'
import { safeGet } from 'app/utils/get'
import type { TimelineRecord, TxRecord } from '@nft3sdk/client'
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'
import { DisplayNumber } from 'components/Number'

const ROOT = styled(Card)``
const Content = styled(CardContent)``

const DisplayTxs: FC<TxRecord> = ({ symbol, amount, from, to }) => {
  const { displayAddress } = useNFT3Wallet()
  return (
    <Fragment>
      <Paragraph>
        Exchange{' '}
        <Typography component="span" color="primary">
          <DisplayNumber value={amount} />
        </Typography>{' '}
        {symbol}{' '}
        <Link href={'https://etherscan.io/address/' + from} target="_blank" underline="hover">
          {displayAddress(from)}
        </Link>{' '}
        to{' '}
        <Link href={'https://etherscan.io/address/' + to} target="_blank" underline="hover">
          {displayAddress(to)}
        </Link>
      </Paragraph>
      <Stack spacing={2} direction="row">
        <Chip color="primary" icon={<CompareArrowsIcon />} label="Transfer" />
      </Stack>
    </Fragment>
  )
}

const TimelineCard: FC<TimelineRecord> = ({ timestamp, item, type }) => {
  const { format } = useNFT3()
  const { profile } = useNFT3Profile()
  return (
    <ROOT>
      <Content>
        <Stack spacing={2} direction="row">
          <Avatar alt={profile.name} src={format(profile.avatar)} sx={{ width: 48, height: 48 }} />
          <Stack spacing={2}>
            <Stack spacing={0}>
              <H4>{profile.name}.isme</H4>
              <Tiny>{safeGet(() => formatData(parseInt(timestamp) * 1000, 'MM/dd HH:mm')) || '-'}</Tiny>
            </Stack>
            {type === 'txs' && <DisplayTxs {...(item as any)} />}
          </Stack>
        </Stack>
      </Content>
    </ROOT>
  )
}

export default TimelineCard
