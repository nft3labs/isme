import type { FC } from 'react'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'

import AccountButton from './AccountButton'
import WalletSelect from './WalletSelect'
import NFT3Register from './NFT3Register'

const ROOT = styled('div')``
const Content = styled(Stack)`
  min-width: 200px;
  justify-content: right;
`

const Actions: FC = () => {
  return (
    <ROOT>
      <Content direction="row" spacing={2}>
        <AccountButton />
      </Content>
      <WalletSelect />
      <NFT3Register />
    </ROOT>
  )
}

export default Actions
