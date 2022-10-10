import type { FC } from 'react'
import { Fragment } from 'react'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded'
import type { TimelineRecord } from '@nft3sdk/client'

import { safeGet } from 'app/utils/get'
import { useAnchorMenu } from 'app/hooks/useAnchor'

import { NETWORK_MAP } from '../netwrok'

type ActionsProps = Pick<TimelineRecord['item'], 'network'> & {
  transaction: string
}

const Actions: FC<ActionsProps> = ({ network, transaction }) => {
  const item = NETWORK_MAP[network]
  const { Menu, open, close } = useAnchorMenu()
  if (!item || !transaction) return null

  const { explorerUrl } = item

  return (
    <Fragment>
      <IconButton onClick={open}>
        <MoreVertRoundedIcon />
      </IconButton>
      <Menu>
        <MenuItem
          sx={{
            padding: '12px 20px',
          }}
          onClick={() => {
            window.open(safeGet(() => `${explorerUrl}/search?f=0&q=${transaction}`))
            close()
          }}
        >
          <ListItemText>View transaction</ListItemText>
        </MenuItem>
      </Menu>
    </Fragment>
  )
}

export default Actions
