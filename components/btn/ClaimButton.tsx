import Button from '@mui/material/Button'
import type { ButtonProps } from '@mui/material/Button'
import { useUser } from 'domains/data'

type ClaimButtonProps = {
  title?: string
  didname: string
  buttonProps?: ButtonProps
}
export const ClaimButton: FC<ClaimButtonProps> = ({ title, didname, buttonProps }) => {
  const { selectDialog, logout, disconnect } = useUser()
  return (
    <Button
      variant="gradient"
      size="small"
      {...buttonProps}
      onClick={(event) => {
        event.stopPropagation()
        disconnect()
        sessionStorage.removeItem('sessionKey')
        sessionStorage.setItem('didname', didname)
        logout()
        selectDialog.open()
      }}
    >
      {title || 'Claim'}
    </Button>
  )
}
export default ClaimButton
