import { useMemo } from 'react'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import { H2 } from 'components/Typography'
import { useNFT3Assets } from 'domains/data'
import BasicTable from 'components/table/BasicTable'
import NFTCard from 'components/nft/NFTCard'

import { useTable } from './useTable'

const ROOT = styled(Stack)``

const Board: FC = () => {
  const { nfts, tokens } = useNFT3Assets()
  const table = useTable()
  const cards = useMemo(() => {
    if (!nfts) return []
    return nfts.map((d) => {
      const { id, image_preview_url, name, description } = d
      return {
        name,
        id,
        description,
        image: image_preview_url,
      }
    })
  }, [nfts])

  console.log('nfts', nfts)

  return (
    <ROOT spacing={2}>
      <H2>NFTs</H2>
      <Box>
        <Grid container spacing={2}>
          {cards.map((nft) => (
            <Grid item sm={4} xs={6} key={nft.id}>
              <NFTCard {...nft} />
            </Grid>
          ))}
        </Grid>
      </Box>
      <H2>Tokens</H2>
      <BasicTable {...{ ...table, data: tokens }} />
    </ROOT>
  )
}

export default Board
