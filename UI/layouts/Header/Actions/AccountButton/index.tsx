import type { FC } from 'react'
import { useState } from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useRouter } from 'next/router'
import { useUser } from 'domains/data'

const AccountButton: FC = () => {
  const { didname, account, logout, selectDialog, disconnect } = useUser()
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
    <>
      <Button variant="gradient" size="large" onClick={handleClick}>
        {didname}
      </Button>
      <Menu id="basic-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={() => router.push('/profile-board/' + didname.split('.isme')[0])}>Your profile</MenuItem>
        <MenuItem onClick={() => router.push('/profile')}>Settings</MenuItem>
        <MenuItem onClick={onLogout}>Logout</MenuItem>
      </Menu>
    </>
  )
}

export default AccountButton
