import type { FC } from 'react'
import { useState } from 'react'
import { Fragment } from 'react'

import { useYlide } from 'domains/data'
import Dialog from 'components/Dialog'

import { Button, Input } from '@mui/material'

const YlidePassword: FC = () => {
  const { enterPasswordDialog } = useYlide()

  const [password, setPassword] = useState('')

  return (
    <Fragment>
      <Dialog visible={enterPasswordDialog.visible} onClose={enterPasswordDialog.close} title="Enter Ylide Password">
        NFT3 uses Ylide to provide messaging services. We found that you already have Ylide key created. To access it we
        need you to enter your Ylide password, so we will be able to decrypt your messages:
        <br />
        <br />
        <Input
          type="password"
          placeholder="Enter your password here"
          fullWidth
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <br />
        <Button
          variant="outlined"
          size="large"
          fullWidth
          onClick={() => {
            enterPasswordDialog.close(null, password)
          }}
        >
          Access Ylide key
        </Button>
      </Dialog>
    </Fragment>
  )
}

export default YlidePassword
