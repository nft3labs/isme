export const replaceBaseUrl = (url: string, to: string) => {
  if (url.indexOf('?') !== -1) {
    return `${to}?${url.split('?')[1]}`
  }
  return to
}
