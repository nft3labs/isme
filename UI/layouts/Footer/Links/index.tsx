import Link from '@mui/material/Link'
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'

import { useLinks } from './useLinks'

const ROOT = styled('div')`
  display: flex;
  align-items: center;
`

const Links = () => {
  const { links } = useLinks()

  const list = links.map(({ label, linkTo, icon }) => (
    <Link href={linkTo} key={linkTo} target="_blank" underline="none" sx={{ padding: '0 10px' }}>
      <Button
        variant="text"
        sx={{
          color: 'grey.500',
          padding: 0,
        }}
        startIcon={icon}
        size="large"
      >
        {label}
      </Button>
    </Link>
  ))

  return <ROOT>{list}</ROOT>
}

export default Links
