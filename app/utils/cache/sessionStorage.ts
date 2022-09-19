export const getItem = (key: string) => {
  if (__SERVER__ || !sessionStorage) return
  const value = sessionStorage.getItem(key)
  try {
    return JSON.parse(value)
  } catch (error) {
    return value
  }
}

export const removeItem = (key: string) => {
  if (__SERVER__ || !sessionStorage) return
  sessionStorage.removeItem(key)
}

export const setItem = (key: string, v: any) => {
  if (__SERVER__ || !sessionStorage) return
  const value = typeof v === 'object' ? JSON.stringify(v, null, 2) : v
  sessionStorage.setItem(key, value)
}
