import type { FC } from 'react'
import { useState } from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useRouter } from 'next/router'
import { useUser } from 'domains/data'

const AccountButton: FC = () => {
  const { ready, didname, account, logout, login, selectDialog, registerDialog, disconnect } = useUser()
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
  }

  const onDisconnect = () => {
    disconnect()
  }

  const onLogin = async () => {
    const info = await login()
    if (info.result === false && info.needRegister === true) {
      registerDialog.open()
    }
  }

  if (!account) {
    return (
      <Button size="large" onClick={() => selectDialog.open()}>
        Connect Wallet
      </Button>
    )
  }
  if (!didname) {
    return (
      <Button size="large" onClick={onLogin} disabled={!ready}>
        Login NFT3
      </Button>
    )
  }
  return (
    <>
      <Button size="large" onClick={handleClick}>
        {didname}
      </Button>
      <Menu id="basic-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={() => router.push('/profile-board/' + didname.split('.isme')[0])}>Your profile</MenuItem>
        {/* <MenuItem onClick={() => router.push('/home/settings')}>Settings</MenuItem>
        <MenuItem onClick={() => router.push('/home/wallets')}>Wallets</MenuItem>
        <MenuItem onClick={() => router.push('/home/socials')}>Social accounts</MenuItem> */}
        <MenuItem onClick={onDisconnect}>Disconnect</MenuItem>
        <MenuItem onClick={onLogout}>Logout</MenuItem>
      </Menu>
    </>
  )
}

export default AccountButton
