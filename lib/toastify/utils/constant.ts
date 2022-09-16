import type { ToastPosition, TypeOptions } from '../types'

type KeyOfPosition = 'TOP_LEFT' | 'TOP_RIGHT' | 'TOP_CENTER' | 'BOTTOM_LEFT' | 'BOTTOM_RIGHT' | 'BOTTOM_CENTER'

type KeyOfType = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'DEFAULT' | 'PRIMARY' | 'SECONDARY'

export const POSITION: { [key in KeyOfPosition]: ToastPosition } = {
  TOP_LEFT: 'top-left',
  TOP_RIGHT: 'top-right',
  TOP_CENTER: 'top-center',
  BOTTOM_LEFT: 'bottom-left',
  BOTTOM_RIGHT: 'bottom-right',
  BOTTOM_CENTER: 'bottom-center',
}

export const TYPE: { [key in KeyOfType]: TypeOptions } = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  DEFAULT: 'default',
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
}

export const enum Default {
  COLLAPSE_DURATION = 300,
  DEBOUNCE_DURATION = 50,
  DRAGGABLE_PERCENT = 80,
}

export const enum Direction {
  X = 'x',
  Y = 'y',
}
