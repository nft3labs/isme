import type { FC } from 'react'
import dynamic from 'next/dynamic'
import { styled, useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'

import Logo from './Logo'

const Search = dynamic(() => import('./Search'), { ssr: false })
const Actions = dynamic(() => import('./Actions'), { ssr: false })

const ROOT = styled('header')`
  position: relative;
`
const BODY = styled(Box)`
  height: 85px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${({ theme }) => ({
    padding: `0 ${theme.spacing(3)}`,
  })}
`

const MobileBODY = styled(Box)`
  display: flex;
  flex-direction: column;
  ${({ theme }) => ({
    padding: `${theme.spacing(3)} ${theme.spacing(2)}`,
  })}
`

const MobileRow = styled(Box)`
  display: flex;
  justify-content: space-between;
  ${({ theme }) => ({
    marginBottom: `${theme.spacing(2)}`,
  })}
`

const Header: FC = () => {
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.up('sm'))

  return (
    <ROOT>
      {matches ?
        <BODY>
          <Logo />
          <Search />
          <Actions />
        </BODY> :
        <MobileBODY>
          <MobileRow>
            <Logo />
            <Actions />
          </MobileRow>
          <Search />
        </MobileBODY>
      } 
    </ROOT>
  )
}

export default Header
