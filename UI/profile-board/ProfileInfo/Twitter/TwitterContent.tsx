import Button from '@mui/material/Button'
import TwitterIcon from '@mui/icons-material/Twitter'

type TwitterContentProps = {
  onClick: any
}
const TwitterContent: FC<TwitterContentProps> = ({ onClick }) => {
  return (
    <Button
      variant="twitter"
      size="small"
      sx={{
        borderRadius: '100px',
        margin: '0 5px',
      }}
      startIcon={<TwitterIcon />}
      onClick={onClick}
    >
      Verify
    </Button>
  )
}

export default TwitterContent
