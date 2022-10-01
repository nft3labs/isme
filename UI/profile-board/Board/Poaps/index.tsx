import { useMemo } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Avatar from '@mui/material/Avatar'
import { useNFT3Assets } from 'domains/data'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Tooltip from '@mui/material/Tooltip'

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
        <Typography color="text.disabled">No POAPs yet.</Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Grid container spacing={2}>
        {cards.map((poap) => (
          <Grid item xs={6} sm={4} md={3} lg={2} key={poap.id}>
            <Tooltip title={poap.name} placement="top">
              <Avatar
                alt={poap.name}
                src={poap.image}
                sx={{
                  width: 1,
                  height: 1,
                }}
              />
            </Tooltip>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default Poaps
