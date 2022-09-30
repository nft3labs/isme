import { styled } from '@mui/material'
import type { IconButtonProps } from '@mui/material'
import MuiDialog from '@mui/material/Dialog'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { CloseIconButton } from 'components/btn/IconButton'
import DialogContent from '@mui/material/DialogContent'

type DialogProps = {
  visible: boolean
  onClose: () => void
  title: string
}

const DialogCloseIconButton: FC<IconButtonProps> = styled(CloseIconButton)(({ theme }) => ({
  position: 'absolute',
  color: theme.palette.text.disabled,
  right: theme.spacing(2),
  top: theme.spacing(2),
  zIndex: 1,
}))

const Dialog: FC<DialogProps> = ({ visible, onClose, title, children }) => {
  return (
    <MuiDialog onClose={onClose} open={visible}>
      <DialogCloseIconButton onClick={onClose} />
      <Stack spacing={2} direction="row" sx={{ padding: '16px 24px' }}>
        <Typography variant="h6" sx={{ lineHeight: '40px' }}>
          {title}
        </Typography>
      </Stack>
      <DialogContent>{children}</DialogContent>
    </MuiDialog>
  )
}

export default Dialog
