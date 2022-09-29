import Image from 'next/image'
import MuiIconButton from '@mui/material/IconButton'

type IconButtonProps = {
  icon: any
  alt: string
  url: string
}

const IconButton: FC<IconButtonProps> = ({ icon, alt, url }) => {
  if (!url) return null
  return (
    <MuiIconButton
      onClick={() => {
        window.open(url)
      }}
      size="small"
    >
      <Image src={icon} alt={alt} />
    </MuiIconButton>
  )
}

export default IconButton
