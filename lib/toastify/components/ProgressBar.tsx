import { useState, useEffect, useRef } from 'react'
import LinearProgress from '@mui/material/LinearProgress'

import { TYPE } from './../utils'
import type { TypeOptions } from '../types'

export interface ProgressBarProps {
  /**
   * The animation delay which determine when to close the toast
   */
  delay: number

  /**
   * Whether or not the animation is running or paused
   */
  isRunning: boolean

  /**
   * Func to close the current toast
   */
  closeToast: () => void

  /**
   * Optional type : info, success ...
   */
  type: TypeOptions

  /**
   * Hide or not the progress bar
   */
  hide?: boolean

  /**
   * Tell wether or not controlled progress bar is used
   */
  controlledProgress?: boolean

  /**
   * Controlled progress value
   */
  progress?: number

  /**
   * Tell if the component is visible on screen or not
   */
  isIn?: boolean
}

export const ProgressBar = ({
  delay,
  isRunning,
  closeToast,
  type,
  controlledProgress,
  progress: defaultProgress,
  isIn,
}: ProgressBarProps) => {
  const [progress, setProgress] = useState(100)
  const count = useRef(0)
  useEffect(() => {
    if (!isIn) return
    if (controlledProgress) return
    if (!isRunning) return

    const interval = delay / 25
    let timer: any
    const run = () => {
      count.current++
      timer = setTimeout(() => {
        const value = 96 - count.current * 4
        if (value < 0) {
          setProgress(0)
          closeToast()
        } else {
          setProgress(value)
          run()
        }
      }, interval)
    }

    run()

    return () => {
      clearTimeout(timer)
    }
  }, [closeToast, controlledProgress, delay, isIn, isRunning])

  return (
    <LinearProgress
      sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
      }}
      variant="determinate"
      color={type === 'default' ? undefined : type}
      value={controlledProgress ? defaultProgress : progress}
    />
  )
}

ProgressBar.defaultProps = {
  type: TYPE.DEFAULT,
  hide: false,
}
