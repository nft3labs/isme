import React from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import InfoIcon from '@mui/icons-material/Info'
import WarningIcon from '@mui/icons-material/Warning'
import ErrorIcon from '@mui/icons-material/Error'

import type { TypeOptions } from '../types'

/**
 * Used when providing custom icon
 */
export interface IconProps {
  type: TypeOptions
}

export type BuiltInIconProps = React.SVGProps<SVGSVGElement> & IconProps

function Warning({ type }: BuiltInIconProps) {
  if (type === 'default') return <WarningIcon />
  return <WarningIcon color={type} />
}

function Info({ type }: BuiltInIconProps) {
  if (type === 'default') return <InfoIcon />
  return <InfoIcon color={type} />
}

function Success({ type }: BuiltInIconProps) {
  if (type === 'default') return <CheckCircleIcon />
  return <CheckCircleIcon color={type} />
}

function Error({ type }: BuiltInIconProps) {
  if (type === 'default') return <ErrorIcon />
  return <ErrorIcon color={type} />
}

function Spinner({ type }: BuiltInIconProps) {
  if (type === 'default') return <CircularProgress size={20} />
  return <CircularProgress size={20} color={type} />
}

export const Icons = {
  info: Info,
  warning: Warning,
  success: Success,
  error: Error,
  spinner: Spinner,
}
