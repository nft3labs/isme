import type { FC } from 'react'

import Dialog from 'components/Dialog'
import type { DialogValues } from 'app/hooks/useDialog'
import Button from '@mui/material/Button'

const Claiming: FC<{ dialog: DialogValues }> = ({ dialog }) => {
  return (
    <Dialog visible={dialog.visible} onClose={dialog.close} title="Claiming Account">
      <p>content</p>
      <Button
        onClick={() => {
          dialog.close('claiming')
        }}
      >
        Claiming
      </Button>
    </Dialog>
  )
}

export default Claiming
