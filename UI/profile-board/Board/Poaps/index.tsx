import { useMemo } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Avatar from '@mui/material/Avatar'
import { useNFT3Assets } from 'domains/data'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'

const Poaps: FC = () => {
  const { poaps, loading } = useNFT3Assets()
  const cards = useMemo(() => {
    if (!poaps) return []
    return poaps
      .filter((d) => d && d.event)
      .map((d) => {
        const {
          event: { name, image_url, id, description },
        } = d
        return {
          name,
          id,
          description,
          image: image_url,
        }
      })
  }, [poaps])

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={100}>
        <CircularProgress />
      </Box>
    )
  }

  if (!cards.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={100}>
        <Typography color='text.disabled'>No POAPs yet.</Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Grid container spacing={2}>
        {cards.map((poap) => (
          <Grid item md={2} sm={3} xs={4} key={poap.id}>
            <Avatar
              alt={poap.name}
              src={poap.image}
              sx={{
                width: 120,
                height: 120,
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default Poaps
