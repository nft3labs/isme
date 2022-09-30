import type { ButtonTypeMap } from '@mui/material/Button'
import Button from '@mui/material/Button'
import { useState } from 'react'

type UnfollowProps = {
  onClick: any
} & ButtonTypeMap<{}, 'button'>['props']
const Unfollow: FC<UnfollowProps> = ({ onClick, ...others }) => {
  const [hover, setHover] = useState(false)
  return (
    <Button
      variant="outlined"
      color={hover ? 'error' : 'primary'}
      size="small"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      {...others}
    >
      {hover ? 'Unfollow' : 'Following'}
    </Button>
  )
}

export default Unfollow
