import clsx from 'clsx'
import { styled } from '@mui/material/styles'
import type { IconButtonProps } from '@mui/material/IconButton'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Image from 'next/image'
import { useRouter } from 'next/router'

export const CloseIconButton: FC<IconButtonProps> = (props) => {
  return (
    <IconButton
      {...{
        ...props,
        className: clsx(props.className, 'close-icon-btn'),
      }}
    >
      <CloseIcon />
    </IconButton>
  )
}

export const ToastifyCloseIconButton: FC<IconButtonProps> = styled(CloseIconButton)(({ theme }) => ({
  color: theme.palette.text.disabled,
}))

type ImageButtonProps = {
  src: any
  alt?: string
  title?: string
  href?: string
  onClick?: () => void
}

export const ImageButton: FC<ImageButtonProps & IconButtonProps> = ({ src, alt, title, href, onClick, ...others }) => {
  const router = useRouter()

  return (
    <IconButton
      title={title}
      onClick={() => {
        onClick?.()

        if (href) {
          router.push(href).then()
        }
      }}
      size="small"
      {...others}
    >
      <Image src={src} alt={alt} />
    </IconButton>
  )
}
