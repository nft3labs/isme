import Link from '@mui/material/Link'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'

import { useLinks } from './useLinks'
import Stack from '@mui/material/Stack'
import { H3 } from 'components/Typography'

const ROOT = styled('div')`
  position: absolute;
  left: 102%;
  top: 11rem;
  width: 200px;
  height: 140px;
  padding: 25px;
  border-radius: 20px;
  ${({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
  })}
`

const Links = () => {
  const { links } = useLinks()

  const list = links.map(({ linkTo, icon }) => (
    <Link href={linkTo} key={linkTo} target="_blank" underline="none" sx={{ padding: '0 10px' }}>
      <IconButton
        sx={{
          color: 'primary.main',
          width: 40,
          height: 40,
        }}
      >
        {icon}
      </IconButton>
    </Link>
  ))

  return (
    <Stack spacing={1} direction='row' justifyContent='center'>
      {list}
    </Stack>
  )
}

export const RightLinks = () => {
  const { links } = useLinks()

  const list = links.map(({ linkTo, icon }) => (
    <Link href={linkTo} key={linkTo} target="_blank" underline="none">
      <IconButton
        sx={{
          color: 'white',
        }}
      >
        {icon}
      </IconButton>
    </Link>
  ))

  return (
    <ROOT>
      <Stack>
        <H3 color='white' fontWeight='bold'>More updates on $ISME</H3>
      </Stack>
      <Stack direction='row' justifyContent='space-between'>
        {list}
      </Stack>
    </ROOT>
  )
}

export default Links
