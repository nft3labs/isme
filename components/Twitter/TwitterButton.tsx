import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import TwitterIcon from '@mui/icons-material/Twitter'
import { useNFT3Profile, useNFT3Social } from 'domains/data'

type TwitterButtonProps = {
  open: () => void
  component: any
}

const TwitterButton: FC<TwitterButtonProps> = ({ open, component: Component }) => {
  const { isUser } = useNFT3Profile()
  const {
    twitter: {
      account: { account: twitterAccount },
    },
  } = useNFT3Social()

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
        width: { xs: 1, sm: 'auto' },
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
