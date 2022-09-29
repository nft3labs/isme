import { styled } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import { H2 } from 'components/Typography'

import NFTs from './NFTs'
import Table from './Table'

const ROOT = styled(Stack)``

const Board: FC = () => {
  return (
    <ROOT spacing={2}>
      <H2>NFTs</H2>
      <NFTs />
      <H2>Tokens</H2>
      <Table />
    </ROOT>
  )
}

export default Board
