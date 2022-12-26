import { styled } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { Paragraph } from 'components/Typography'
import TwitterIcon from '@mui/icons-material/Twitter'

const ROOT = styled(Stack)``

type TwitterContentProps = {
  onClick: any
}
const TwitterContent: FC<TwitterContentProps> = ({ onClick }) => {
  return (
    <ROOT sx={{ width: '100%' }} spacing={2}>
      <Paragraph sx={{ color: 'text.secondary' }}>Twitter not yet linked</Paragraph>
      <Box>
        <Button
          variant="twitter"
          onClick={onClick}
          sx={{ width: { xs: 1, sm: 'auto' }, borderRadius: 100 }}
          startIcon={<TwitterIcon />}
        >
          Verify
        </Button>
      </Box>
    </ROOT>
  )
}

export default TwitterContent
