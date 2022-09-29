import Button from '@mui/material/Button'
import TwitterIcon from '@mui/icons-material/Twitter'

type TwitterButtonProps = {
  account: string
}

const TwitterButton: FC<TwitterButtonProps> = ({ account }) => {
  if (!account) return null
  return (
    <Button
      variant="twitter"
      size="small"
      sx={{
        borderRadius: '100px',
        margin: '0 5px',
      }}
      startIcon={<TwitterIcon />}
      onClick={() => {
        window.open('https://twitter.com/' + account)
      }}
    >
      {account}
    </Button>
  )
}

export default TwitterButton
