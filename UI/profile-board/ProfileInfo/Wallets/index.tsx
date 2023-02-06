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
import { toast } from 'lib/toastify'
import { Paragraph } from 'components/Typography'
import { useTheme } from '@mui/material/styles'

type WalletsProps = {}
const Wallets: FC<WalletsProps> = () => {
  const theme = useTheme()
  const { accounts, account, current, setAccount } = useNFT3Wallet()
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
            <Image src={current?.icon} alt="ETH" />
            <Paragraph>{textCenterEllipsis(selected)}</Paragraph>
          </Stack>
        )
      }}
    >
      {accounts.map((record, index) => {
        return (
          <MenuItem
            key={record.account}
            value={record.account}
            sx={{
              borderBottom: index >= accounts.length - 1 ? 'none' : `1px solid ${theme.palette.divider}`,
              paddingTop: '2px',
              paddingBottom: '2px',
            }}
          >
            <ListItemIcon sx={{ justifyContent: 'center' }}>
              <Image src={record.icon} alt="ETH" width={16} height={16} />
            </ListItemIcon>
            <ListItemText>
              <a href={record.explorer} target="_blank" rel="noreferrer">
                {textCenterEllipsis(record.account)}
              </a>
            </ListItemText>
            <IconButton
              onClick={(e) => {
                e.stopPropagation()
                setCopyValue(record.account)
                writeText(record.account)
                toast.success('Wallet address copied successfully', {
                  position: toast.POSITION.BOTTOM_RIGHT,
                })
              }}
            >
              {copyValue === record.account ? (
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
