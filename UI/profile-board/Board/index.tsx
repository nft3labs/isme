import { styled } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import { H2 } from 'components/Typography'

import NFTs from './NFTs'
import Table from './Table'
import Poaps from './Poaps'

const ROOT = styled(Stack)``

const Board: FC = () => {
  return (
    <ROOT spacing={6}>
      <Stack spacing={2}>
        <H2>NFTs</H2>
        <NFTs />
      </Stack>
      <Stack spacing={2}>
        <H2>Tokens</H2>
        <Table />
      </Stack>
      <Stack spacing={2}>
        <H2>Poaps</H2>
        <Poaps />
      </Stack>
    </ROOT>
  )
}

export default Board
