import { useCallback, useState } from 'react'

type DialogProps = {
  onOpen?: () => void
  onClose?: () => void
  beforeOpen?: () => Promise<boolean>
  beforeClose?: () => Promise<boolean>
}

export const useDialog = ({ onOpen, onClose, beforeOpen, beforeClose }: DialogProps = {}) => {
  const [visible, setVisible] = useState(false)

  const open = useCallback(async () => {
    if (beforeOpen) if (!(await beforeOpen())) return
    setVisible(true)
    if (onOpen) onOpen()
  }, [beforeOpen, onOpen])

  const close = useCallback(async () => {
    if (beforeClose) if (!(await beforeClose())) return
    setVisible(false)
    if (onClose) onClose()
  }, [beforeClose, onClose])

  return {
    visible,
    open,
    close,
  }
}
