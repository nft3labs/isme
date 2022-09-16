import type { BoxProps } from '@mui/material'
import { Box } from '@mui/material'
import type { FC } from 'react'

const FlexRowAlign: FC<BoxProps> = ({ children, ...props }) => (
  <Box display="flex" alignItems="center" justifyContent="center" {...props}>
    {children}
  </Box>
)

export default FlexRowAlign
