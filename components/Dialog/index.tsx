import { styled, useTheme } from '@mui/material'
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
  const theme = useTheme()
  return (
    <MuiDialog onClose={onClose} open={visible} fullWidth>
      <DialogCloseIconButton onClick={onClose} />
      <Stack spacing={2} direction="row" sx={{ padding: theme.spacing(4), paddingTop: theme.spacing(6) }} justifyContent="center">
        <Typography variant="h5" sx={{ lineHeight: '40px', fontWeight: 'bold' }}>
          {title}
        </Typography>
      </Stack>
      <DialogContent sx={{ padding: theme.spacing(4), paddingBottom: theme.spacing(6) }}>{children}</DialogContent>
    </MuiDialog>
  )
}

export default Dialog
