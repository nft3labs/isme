import { Fragment, useMemo } from 'react'
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
import type { TimelineRecord, TxRecord, POAPRecord } from '@nft3sdk/client'
import TokenIcon from '@mui/icons-material/Token'
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded'
import { DisplayNumber } from 'components/Number'
import { textCenterEllipsis } from 'app/utils/string/text-center-ellipsis'

import { ChipNetwork, ChipStack } from './Chip'
import Actions from './Actions'
import { NETWORK_MAP } from './netwrok'

const ROOT = styled(Card)``
const Content = styled(CardContent)``

const DisplayTxs: FC<TxRecord> = ({ network, symbol, amount, from, to }) => {
  const { userHadAddress } = useNFT3Wallet()
  const isSend = userHadAddress(from)
  const chips = useMemo(() => {
    return (
      <ChipStack>
        <Chip
          sx={{
            backgroundColor: '#AAEEA3',
            color: '#52BC47',
            fontWeight: 'bold',
            '.MuiChip-icon': {
              color: '#52BC47',
            },
          }}
          icon={<TokenIcon />}
          label="DeFi"
        />
        <ChipNetwork network={network} />
      </ChipStack>
    )
  }, [network])

  const item = NETWORK_MAP[network]
  const explorerUrl = item ? item.explorerUrl : 'https://etherscan.io'
  
  if (isSend) {
    return (
      <Fragment>
        <Paragraph>
          Sent{' '}
          <Typography component="span" color="text.primary" fontWeight="bold">
            <DisplayNumber value={amount} />
          </Typography>{' '}
          {symbol} to{' '}
          <Link href={`${explorerUrl}/address/` + to} target="_blank" underline="hover">
            {textCenterEllipsis(to)}
          </Link>
        </Paragraph>
        {chips}
      </Fragment>
    )
  } else {
    return (
      <Fragment>
        <Paragraph>
          Received{' '}
          <Typography component="span" color="text.primary" fontWeight="bold">
            <DisplayNumber value={amount} />
          </Typography>{' '}
          {symbol} from{' '}
          <Link href={`${explorerUrl}/address/` + from} target="_blank" underline="hover">
            {textCenterEllipsis(from)}
          </Link>
        </Paragraph>
        {chips}
      </Fragment>
    )
  }
}
const DisplayPoaps: FC<POAPRecord> = (props) => {
  const { name, description, image_url: image } = safeGet(() => props.event) || {}
  return (
    <Fragment>
      <Paragraph>{description}</Paragraph>
      <Avatar
        alt={name}
        src={image}
        sx={{
          width: 180,
          height: 180,
        }}
      />
      <ChipStack>
        <Chip
          sx={{
            backgroundColor: '#A3EBFB',
            color: '#2081E2',
            fontWeight: 'bold',
            '& .MuiChip-icon': {
              color: '#2081E2',
            },
          }}
          icon={<GroupsRoundedIcon />}
          label="Social"
        />
        <ChipNetwork network={props.network} />
      </ChipStack>
    </Fragment>
  )
}

const TimelineCard: FC<TimelineRecord> = ({ timestamp, item, type }) => {
  const { format } = useNFT3()
  const { profile } = useNFT3Profile()
  return (
    <ROOT>
      <Content sx={{ justifyContent: 'space-between', display: 'flex', alignItems: 'flex-start' }}>
        <Stack spacing={2} direction="row">
          <Avatar alt={profile.name} src={format(profile.avatar)} sx={{ width: 48, height: 48 }} />
          <Stack spacing={2}>
            <Stack spacing={0}>
              <H4>{profile.name}.isme</H4>
              <Tiny>{safeGet(() => formatData(parseInt(timestamp) * 1000, 'MMM d, yyyy')) || '-'}</Tiny>
            </Stack>
            {type === 'txs' && <DisplayTxs {...(item as any)} />}
            {type === 'poaps' && <DisplayPoaps {...(item as any)} />}
          </Stack>
        </Stack>
        <Actions network={item.network} transaction={(item as any).hash} />
      </Content>
    </ROOT>
  )
}

export default TimelineCard
