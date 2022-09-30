import type { FC } from 'react'
import { useState, Fragment } from 'react'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded'
import type { TimelineRecord } from '@nft3sdk/client'
import { safeGet } from 'app/utils/get'

import { NETWORK_MAP } from '../netwrok'

type ActionsProps = Pick<TimelineRecord['item'], 'network'> & {
  transaction: string
}

const Actions: FC<ActionsProps> = ({ network, transaction }) => {
  const item = NETWORK_MAP[network]
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  if (!item || !transaction) return null

  const { explorerUrl } = item

  return (
    <Fragment>
      <IconButton onClick={handleClick}>
        <MoreVertRoundedIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem
          sx={{
            padding: '12px 20px',
          }}
          onClick={() => {
            window.open(safeGet(() => `${explorerUrl}/search?f=0&q=${transaction}`))
            handleClose()
          }}
        >
          <ListItemText>View transaction</ListItemText>
        </MenuItem>
      </Menu>
    </Fragment>
  )
}

export default Actions
