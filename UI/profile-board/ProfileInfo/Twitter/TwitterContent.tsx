import IconButton from '@mui/material/IconButton'
import TwitterIcon from '@mui/icons-material/Twitter'

type TwitterContentProps = {
  onClick: any
}
const TwitterContent: FC<TwitterContentProps> = ({ onClick }) => {
  return (
    <IconButton onClick={onClick} size="small">
      <TwitterIcon />
    </IconButton>
  )
}

export default TwitterContent
