import Button from '@mui/material/Button'
import TwitterIcon from '@mui/icons-material/Twitter'

type TwitterButtonProps = {
  account: string
}

const TwitterButton: FC<TwitterButtonProps> = ({ account }) => {
  return (
    <Button
      startIcon={<TwitterIcon />}
      size="large"
      onClick={() => {
        window.open('https://twitter.com/' + account)
      }}
    >
      {account}
    </Button>
  )
}

export default TwitterButton
