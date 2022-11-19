import { useCallback, useState } from 'react'

type DialogProps = {
  onOpen?: (...args: any[]) => void
  onClose?: (...args: any[]) => void
  beforeOpen?: (...args: any[]) => Promise<boolean>
  beforeClose?: (...args: any[]) => Promise<boolean>
}

export const useDialog = ({ onOpen, onClose, beforeOpen, beforeClose }: DialogProps = {}) => {
  const [visible, setVisible] = useState(false)

  const open = useCallback(
    async (...args: any[]) => {
      if (beforeOpen) if (!(await beforeOpen(...args))) return
      setVisible(true)
      if (onOpen) onOpen(...args)
    },
    [beforeOpen, onOpen]
  )

  const close = useCallback(
    async (...args: any[]) => {
      if (beforeClose) if (!(await beforeClose(...args))) return
      setVisible(false)
      if (onClose) onClose(...args)
    },
    [beforeClose, onClose]
  )

  return {
    visible,
    open,
    close,
  }
}

export type DialogValues = ReturnType<typeof useDialog>
