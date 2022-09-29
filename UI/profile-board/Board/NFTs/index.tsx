import { useMemo } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { useNFT3Assets } from 'domains/data'
import NFTCard from 'components/nft/NFTCard'

const NFTs: FC = () => {
  const { nfts } = useNFT3Assets()
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

  return (
    <Box>
      <Grid container spacing={2}>
        {cards.map((nft) => (
          <Grid item sm={4} xs={6} key={nft.id}>
            <NFTCard {...nft} />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default NFTs
