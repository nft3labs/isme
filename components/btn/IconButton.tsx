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

type RoundButtonProps = {
  href?: string
  onClick?: () => boolean | Promise<boolean> | Promise<void> | void
} & IconButtonProps

export const RoundButton: FC<RoundButtonProps> = ({ children, href, onClick, ...others }) => {
  const router = useRouter()

  return (
    <IconButton
      onClick={async () => {
        let result = onClick?.()
        if (typeof result === 'object' && result instanceof Promise) {
          result = await result
        }
        if (result === false) {
          return
        }

        if (href) {
          router.push(href).then()
        }
      }}
      size="small"
      {...others}
    >
      {children}
    </IconButton>
  )
}

type ImageButtonProps = {
  src: any
  alt?: string
} & RoundButtonProps

export const ImageButton: FC<ImageButtonProps> = ({ src, alt, ...others }) => {
  return (
    <RoundButton {...others}>
      <Image src={src} alt={alt} />
    </RoundButton>
  )
}
