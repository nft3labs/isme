import type { FC } from 'react'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import Link from '@mui/material/Link'
import { useRouter } from 'next/router'

const ROOT = styled('div')``
const Content = styled(Stack)`
  justify-content: right;
`

const MenuLink = styled(Link)`
  ${({ theme }) => ({
    color: theme.palette.text.secondary,
    fontWeight: 500,
    textDecoration: 'none',
  })}
`

const Menu: FC = () => {
  const router = useRouter()
  return (
    <ROOT>
      <Content direction="row" spacing={{ xs: 2, sm: 4 }}>
        <MenuLink
          href="/explore"
          onClick={(e) => {
            e.preventDefault()
            router.push('/app/explore')
          }}
        >
          Explore
        </MenuLink>
        <MenuLink href="https://sdk.nft3.com/docs/nft3-pass/intro" target="_blank">
          Docs
        </MenuLink>
      </Content>
    </ROOT>
  )
}

export default Menu
