import { ToastifyCloseIconButton } from 'components/btn/IconButton'
import type { TypeOptions } from '../types'

export interface CloseButtonProps {
  closeToast: (e: React.MouseEvent<HTMLElement>) => void
  type: TypeOptions
  ariaLabel?: string
}

export function CloseButton({ closeToast, ariaLabel = 'close' }: CloseButtonProps) {
  return (
    <ToastifyCloseIconButton
      onClick={(e) => {
        e.stopPropagation()
        closeToast(e)
      }}
      aria-label={ariaLabel}
    />
  )
}
