import type { FC } from 'react'
import { styled } from '@mui/material/styles'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'

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
      <CardMedia component="img" image={image} alt={description} />
      <CardContent>
        <Tooltip title={name} placement="top">
          <Typography
            variant='caption'
            fontWeight={600}
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',  
              whiteSpace: 'nowrap',
              display: 'block',
            }}
          >
            {name}
          </Typography>      
        </Tooltip>
        <Tooltip title={description} placement="top">
          <Typography
            variant='caption'
            fontWeight={400}
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',  
              whiteSpace: 'nowrap',
              display: 'block',
            }}
          >
            {description}
          </Typography>
        </Tooltip>
      </CardContent>
    </ROOT>
  )
}

export default NFTCard
