import type { FC } from 'react'
import { useMemo } from 'react'
import { styled } from '@mui/material/styles'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'

export type NFTCardProps = Partial<{
  name: string
  id: string
  description?: string
  image: string
}>

const ROOT = styled(Card)`
  width: 230px;
  position: relative;
`

const NFTCard: FC<NFTCardProps> = ({ id, name, description, image }) => {
  const title = useMemo(() => (name ? `${description} ${name}` : description), [description, name])

  return (
    <ROOT>
      <CardMedia component="img" height="200" image={image} alt={description} />
      <CardContent>
        <Typography gutterBottom variant="body2" component="div">
          {title}
        </Typography>
      </CardContent>
    </ROOT>
  )
}

export default NFTCard
