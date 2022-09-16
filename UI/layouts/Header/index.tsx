import type { FC } from 'react'
import dynamic from 'next/dynamic'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

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

const Header: FC = () => {
  return (
    <ROOT>
      <BODY>
        <Logo />
        <Search />
        <Actions />
      </BODY>
    </ROOT>
  )
}

export default Header
