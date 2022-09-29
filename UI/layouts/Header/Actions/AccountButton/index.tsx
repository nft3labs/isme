import type { FC } from 'react'
import { useState, Fragment } from 'react'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Avatar from '@mui/material/Avatar'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import { useRouter } from 'next/router'
import { useNFT3, useNFT3Profile, useUser } from 'domains/data'
import { H4 } from 'components/Typography'

const AccountButton: FC = () => {
  const { format } = useNFT3()
  const { didname, account, logout, selectDialog, disconnect } = useUser()
  const { profile } = useNFT3Profile()
  const router = useRouter()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const onLogout = () => {
    logout()
    disconnect()
  }

  if (!account) {
    return (
      <Button variant="gradientOutlined" size="large" onClick={() => selectDialog.open()}>
        Connect Wallet
      </Button>
    )
  }
  if (!didname) {
    return (
      <Button variant="gradientOutlined" size="large" disabled={true}>
        Logging in
      </Button>
    )
  }
  return (
    <Fragment>
      <Paper component={Button} sx={{ p: '12px 20px', borderRadius: '12px' }} onClick={handleClick}>
        <Stack spacing={1} direction="row" justifyContent="center">
          <Avatar
            alt={profile.name}
            src={format(profile.avatar)}
            sx={{
              width: 36,
              height: 36,
            }}
          />
          <H4 fontWeight="400" lineHeight="36px">
            {didname}
          </H4>
        </Stack>
      </Paper>
      <Menu
        sx={{
          '.MuiList-root': {
            padding: '6px 0',
            width: 180,
          },
          '.MuiSvgIcon-root': {
            color: 'text.primary',
          },
          '.MuiMenuItem-root': {
            padding: '12px 20px',
          },
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => router.push('/profile-board/' + didname.split('.isme')[0])}
          sx={{
            borderBottom: '1px solid #E9E9E9',
          }}
        >
          <ListItemIcon>
            <PersonRoundedIcon />
          </ListItemIcon>
          <ListItemText>View profile</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => router.push('/profile')}
          sx={{
            borderBottom: '1px solid #E9E9E9',
          }}
        >
          <ListItemIcon>
            <EditRoundedIcon />
          </ListItemIcon>
          <ListItemText>Edit profile</ListItemText>
        </MenuItem>
        <MenuItem onClick={onLogout}>
          <ListItemIcon>
            <LogoutRoundedIcon />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </Fragment>
  )
}

export default AccountButton
