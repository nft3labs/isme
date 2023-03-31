import type { FC } from 'react'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import Link from '@mui/material/Link'
import { useRouter } from 'next/router'
import { ImageButton } from '../../../../components/btn/IconButton'
import chatsSvg from './chats.svg'
import { useUser, useYlide } from 'domains/data'
import { useNFT3 } from '@nft3sdk/did-manager'

const ROOT = styled('div')``
const Content = styled(Stack)`
  align-items: center;
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
  const { account, selectDialog } = useUser()
  const { forceAuth, isLoading } = useYlide()

  return (
    <ROOT>
      <Content direction="row" spacing={{ xs: 2, sm: 4 }}>
        <MenuLink
          href="/app/explore"
          onClick={(e) => {
            e.preventDefault()
            router.push('/app/explore')
          }}
        >
          Explore
        </MenuLink>
        <MenuLink href="https://sdk.nft3.com/docs/isme/intro" target="_blank">
          Docs
        </MenuLink>
        <ImageButton
          src={chatsSvg}
          title="Chats"
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          onClick={async () => {
            if (isLoading) {
              return false
            }
            if (!account) {
              selectDialog.open()
              return false
            }
            if (await forceAuth()) {
              router.push('/app/chats')
            } else {
              return false
            }
          }}
          href="/app/chats"
        />
      </Content>
    </ROOT>
  )
}

export default Menu
