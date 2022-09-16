import * as React from 'react'
import cx from 'clsx'

import { Toast } from './Toast'
import { Bounce } from './Transitions'
import { POSITION, Direction, Default } from '../utils'
import { useToastContainer } from '../hooks'
import type { ToastContainerProps, ToastPosition } from '../types'

export const ToastContainer: React.FC<ToastContainerProps> = (props) => {
  const { getToastToRender, containerRef, isToastActive } = useToastContainer(props)
  const { containerId } = props

  function getClassName(position: ToastPosition) {
    return cx(`Toastify__toast-container`, `Toastify__toast-container--${position}`)
  }

  return (
    <div ref={containerRef} className="Toastify" id={containerId as string}>
      {getToastToRender((position, toastList) => {
        const containerStyle: React.CSSProperties = toastList.length === 0 ? { pointerEvents: 'none' } : {}

        return (
          <div className={getClassName(position)} style={containerStyle} key={`container-${position}`}>
            {toastList.map(({ content, props: toastProps }) => {
              return (
                <Toast {...toastProps} isIn={isToastActive(toastProps.toastId)} key={`toast-${toastProps.key}`}>
                  {content}
                </Toast>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

ToastContainer.defaultProps = {
  position: POSITION.TOP_RIGHT as ToastPosition,
  transition: Bounce,
  autoClose: 5000,
  hideProgressBar: false,
  pauseOnHover: true,
  pauseOnFocusLoss: true,
  closeOnClick: true,
  newestOnTop: false,
  draggable: true,
  draggablePercent: Default.DRAGGABLE_PERCENT as number,
  draggableDirection: Direction.X,
  role: 'alert',
}
