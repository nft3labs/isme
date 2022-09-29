import MuiGlobalStyles from '@mui/material/GlobalStyles'
import { useTheme } from '@mui/material/styles'

const GlobalStyles: FC = () => {
  const theme = useTheme()
  return (
    <MuiGlobalStyles
      styles={{
        body: {
          background: theme.palette.background.paper,
        },
        '.nft3-modal__title': {
          fontWeight: '700 !important',
        },
      }}
    />
  )
}

export default GlobalStyles
