export const getItem = (key: string) => {
  if (__SERVER__ || !localStorage) return
  const value = localStorage.getItem(key)
  try {
    return JSON.parse(value)
  } catch (error) {
    return value
  }
}

export const removeItem = (key: string) => {
  if (__SERVER__ || !localStorage) return
  localStorage.removeItem(key)
}

export const setItem = (key: string, v: any) => {
  if (__SERVER__ || !localStorage) return
  const value = typeof v === 'object' ? JSON.stringify(v, null, 2) : v
  localStorage.setItem(key, value)
}
