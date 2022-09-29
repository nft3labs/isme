import Link from '@mui/material/Link'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'

import { useLinks } from './useLinks'

const ROOT = styled('div')`
  display: flex;
  align-items: center;
`

const Links = () => {
  const { links } = useLinks()

  const list = links.map(({ linkTo, icon }) => (
    <Link href={linkTo} key={linkTo} target="_blank" underline="none" sx={{ padding: '0 10px' }}>
      <IconButton
        sx={{
          color: 'grey.400',
        }}
        size="small"
      >
        {icon}
      </IconButton>
    </Link>
  ))

  return <ROOT>{list}</ROOT>
}

export default Links
