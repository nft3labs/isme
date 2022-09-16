import type { BoxProps } from '@mui/material'
import { Box } from '@mui/material'
import type { FC } from 'react'

const FlexBox: FC<BoxProps> = ({ children, ...props }) => (
  <Box display="flex" {...props}>
    {children}
  </Box>
)

export default FlexBox
