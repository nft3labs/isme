export const safeGet = <T>(cb: () => T): T => {
  try {
    return cb()
  } catch (error) {
    return undefined
  }
}
