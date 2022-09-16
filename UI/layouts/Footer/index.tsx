import type { FC } from 'react'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'

import Logo from '../Header/Logo'
import LogoImg from '../Header/Logo/images/logo.svg'
import Links from './Links'

const ROOT = styled(Box)`
  ${({ theme }) => ({
    padding: `${theme.spacing(12)} 0 ${theme.spacing(4)} 0`,
  })}
`

const Content = styled(Container)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const CopyRight = styled(Typography)`
  ${({ theme }) => ({
    color: theme.palette.text.secondary,
    fontWeight: 'normal',
    marginLeft: theme.spacing(1),
  })}
`

const Footer: FC = () => {
  return (
    <ROOT component="footer">
      <Content>
        <Logo imgSrc={LogoImg} />
        <Links />
        <CopyRight variant="caption">© 2022, NFT3. All Rights Reserved</CopyRight>
      </Content>
    </ROOT>
  )
}

export default Footer
