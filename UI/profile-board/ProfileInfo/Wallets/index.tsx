import { useEffect, useState } from 'react'
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
import { safeGet } from 'app/utils/get'
import { textCenterEllipsis } from 'app/utils/string/text-center-ellipsis'
import { writeText } from 'app/utils/dom/clipboard'
import ETHImg from 'public/eth.svg'
import { toast } from 'lib/toastify'
import { Paragraph } from 'components/Typography'

type WalletsProps = {
  account: string
}
const Wallets: FC<WalletsProps> = ({ account }) => {
  const { accounts } = useNFT3Wallet()
  const [value, setValue] = useState(account)
  const [copyValue, setCopyValue] = useState('')
  const handleChange = (event: SelectChangeEvent) => {
    setValue(event.target.value)
  }

  useEffect(() => {
    setValue(account || safeGet(() => accounts[0].account))
  }, [account, accounts])

  return (
    <Select
      sx={{
        color: '#000',
        '.MuiSelect-icon': {
          color: '#000',
        },
      }}
      value={value}
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
              color: '#000',
              borderBottom: index >= accounts.length - 1 ? 'none' : '1px solid #E9E9E9',
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
                <InventoryRoundedIcon
                  sx={{
                    color: '#000',
                  }}
                  fontSize="small"
                />
              ) : (
                <ContentCopyRoundedIcon
                  sx={{
                    color: '#000',
                  }}
                  fontSize="small"
                />
              )}
            </IconButton>
          </MenuItem>
        )
      })}
    </Select>
  )
}

export default Wallets
