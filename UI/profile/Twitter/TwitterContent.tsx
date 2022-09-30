import { styled } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { Paragraph } from 'components/Typography'

const ROOT = styled(Stack)``

type TwitterContentProps = {
  onClick: any
}
const TwitterContent: FC<TwitterContentProps> = ({ onClick }) => {
  return (
    <ROOT sx={{ width: '100%' }} spacing={2}>
      <Paragraph sx={{ color: 'text.secondary' }}>Twitter not yet linked</Paragraph>
      <Box>
        <Button variant="outlined" onClick={onClick} sx={{ width: { xs: 1, sm: 'auto' } }}>
          Verify
        </Button>
      </Box>
    </ROOT>
  )
}

export default TwitterContent
