import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import TwitterIcon from '@mui/icons-material/Twitter'

type TwitterButtonProps = {
  useData: () => {
    isUser: boolean
    twitterAccount: string
  }
  open: () => void
  component: any
}

const TwitterButton: FC<TwitterButtonProps> = ({ useData, open, component: Component }) => {
  const { isUser, twitterAccount } = useData()
  if (!twitterAccount) {
    if (isUser) {
      return <Component onClick={() => open()} />
    }
    return null
  }
  return (
    <Button
      variant="twitter"
      size="small"
      sx={{
        width: { xs: 1, sm: '200px' },
        borderRadius: '100px',
        margin: '0 5px',
      }}
      startIcon={<TwitterIcon />}
      onClick={() => {
        window.open('https://twitter.com/' + twitterAccount)
      }}
    >
      <Box
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {twitterAccount}
      </Box>
    </Button>
  )
}

export default TwitterButton
