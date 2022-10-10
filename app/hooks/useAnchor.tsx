import { useCallback, useMemo, useState } from 'react'
import type { MenuProps } from '@mui/material/Menu'
import MuiMenu from '@mui/material/Menu'

export const useAnchor = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const visible = useMemo(() => Boolean(anchorEl), [anchorEl])
  const open = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }, [])
  const close = useCallback(() => {
    setAnchorEl(null)
  }, [])

  return {
    anchorEl,
    visible,
    open,
    close,
  }
}

export const useAnchorMenu = () => {
  const { anchorEl, visible, open, close } = useAnchor()
  const Menu: FC<Omit<MenuProps, 'open' | 'anchorEl' | 'onClose'>> = useCallback(
    (props) => <MuiMenu {...props} anchorEl={anchorEl} open={visible} onClose={close} />,
    [anchorEl, close, visible]
  )

  return {
    Menu,
    visible,
    open,
    close,
  }
}
