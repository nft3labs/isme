import { styled } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TwitterIcon from '@mui/icons-material/Twitter'

const ROOT = styled(Stack)``

type TwitterContentProps = {
  onClick: any
}
const TwitterContent: FC<TwitterContentProps> = ({ onClick }) => {
  return (
    <ROOT spacing={2}>
      <Box>
        <Button variant="twitter" onClick={onClick} sx={{ borderRadius: 100, border: 'solid 2px white' }} startIcon={<TwitterIcon />}>
          Verify Twitter
        </Button>
      </Box>
    </ROOT>
  )
}

export default TwitterContent
