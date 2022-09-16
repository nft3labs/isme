import { cssTransition } from '../utils'

const Bounce = cssTransition({
  enter: `Toastify--animate Toastify__bounce-enter`,
  exit: `Toastify--animate Toastify__bounce-exit`,
  appendPosition: true,
})

export { Bounce }
