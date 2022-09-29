import { useState } from 'react'
import InputBase from '@mui/material/InputBase'
import Image from 'next/image'
import type { SelectChangeEvent } from '@mui/material/Select'
import ListItemText from '@mui/material/ListItemText'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded'
import InventoryRoundedIcon from '@mui/icons-material/InventoryRounded'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'

import { useNFT3Wallet } from 'domains/data'
import MenuItem from '@mui/material/MenuItem'
import { textCenterEllipsis } from 'app/utils/string/text-center-ellipsis'
import { writeText } from 'app/utils/dom/clipboard'
import ETHImg from 'public/eth.svg'
import { toast } from 'lib/toastify'
import { Paragraph } from 'components/Typography'
import { useTheme } from '@mui/material/styles'

type WalletsProps = {}
const Wallets: FC<WalletsProps> = () => {
  const theme = useTheme()
  const { accounts, account, setAccount } = useNFT3Wallet()
  const [copyValue, setCopyValue] = useState('')
  const handleChange = (event: SelectChangeEvent) => {
    setAccount(event.target.value || '')
  }

  return (
    <Select
      value={account}
      onChange={handleChange}
      input={<InputBase />}
      IconComponent={ExpandMoreRoundedIcon}
      renderValue={(selected) => {
        return (
          <Stack spacing={1} direction="row">
            <Image src={ETHImg} alt="ETH" />
            <Paragraph>{textCenterEllipsis(selected)}</Paragraph>
          </Stack>
        )
      }}
    >
      {accounts.map(({ account: wallet }, index) => {
        return (
          <MenuItem
            key={wallet}
            value={wallet}
            sx={{
              borderBottom: index >= accounts.length - 1 ? 'none' : `1px solid ${theme.palette.divider}`,
              paddingTop: '2px',
              paddingBottom: '2px',
            }}
          >
            <ListItemIcon sx={{ justifyContent: 'center' }}>
              <Image src={ETHImg} alt="ETH" />
            </ListItemIcon>
            <ListItemText>{textCenterEllipsis(wallet)}</ListItemText>
            <IconButton
              onClick={(e) => {
                e.stopPropagation()
                setCopyValue(wallet)
                writeText(wallet)
                toast.success('Wallet address copied successfully', {
                  position: toast.POSITION.BOTTOM_RIGHT,
                })
              }}
            >
              {copyValue === wallet ? (
                <InventoryRoundedIcon fontSize="small" sx={{ color: 'text.primary' }} />
              ) : (
                <ContentCopyRoundedIcon fontSize="small" sx={{ color: 'text.primary' }} />
              )}
            </IconButton>
          </MenuItem>
        )
      })}
    </Select>
  )
}

export default Wallets
