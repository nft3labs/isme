import { useMemo } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { useNFT3Assets } from 'domains/data'
import NFTCard from 'components/nft/NFTCard'
import { safeGet } from 'app/utils/get'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'

const NFTs: FC = () => {
  const { nfts, openseaLoading } = useNFT3Assets()
  const cards = useMemo(() => {
    if (!nfts) return []
    return nfts.map((d) => {
      const { id, image_preview_url, name, description } = d
      const collectionName = safeGet(() => (d as any).collection.name)
      return {
        name,
        id,
        description: collectionName || description,
        image: image_preview_url,
      }
    })
  }, [nfts])

  if (openseaLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={100}>
        <CircularProgress />
      </Box>
    )
  }

  if (!cards.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={100}>
        <Typography color="text.disabled">No NFTs yet.</Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Grid container spacing={2}>
        {cards.map((nft) => (
          <Grid item sm={3} xs={6} key={nft.id}>
            <NFTCard {...nft} />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default NFTs
