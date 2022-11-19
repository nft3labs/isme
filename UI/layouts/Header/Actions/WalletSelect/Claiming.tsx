import type { FC } from 'react'

import Dialog from 'components/Dialog'
import type { DialogValues } from 'app/hooks/useDialog'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import { H3 } from 'components/Typography'
import Image from 'next/image'
import ImgSrc from './images/claim.png'

const Claiming: FC<{ dialog: DialogValues }> = ({ dialog }) => {
  return (
    <Dialog visible={dialog.visible} onClose={dialog.close} title="Claim Your DID Account">
      <Stack spacing={4} paddingX={2}>
        <Box textAlign='center'>
          <Image src={ImgSrc} alt='Claim Your DID Account' />
        </Box>
        <H3 color='text.secondary'>Congrats! You're elegible to claim NFT3 Decentralized Identity (DID).</H3>
        <Button
          variant='contained'
          size='large'
          onClick={() => {
            dialog.close('claiming')
          }}
        >
          Claim
        </Button>
      </Stack>
    </Dialog>
  )
}

export default Claiming
