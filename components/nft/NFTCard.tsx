import type { FC } from 'react'
import { styled } from '@mui/material/styles'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import { Small } from 'components/Typography'

export type NFTCardProps = Partial<{
  name: string
  description?: string
  image: string
}>

const ROOT = styled(Card)`
  position: relative;
`

const NFTCard: FC<NFTCardProps> = ({ name, description, image }) => {
  return (
    <ROOT>
      <CardMedia component="img" height={200} image={image} alt={description} />
      <CardContent>
        <Small fontWeight={600}>{name}</Small>
        <Small
          fontWeight={400}
          color="text.secondary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: '3',
            WebkitBoxOrient: 'vertical',
          }}
        >
          {description}
        </Small>
      </CardContent>
    </ROOT>
  )
}

export default NFTCard
