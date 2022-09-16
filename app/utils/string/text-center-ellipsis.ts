export const textCenterEllipsis = (str: string, from = 6, to = 4) => {
  if (!str) return ''
  return `${str.substr(0, from)}...${str.substr(str.length - to, str.length)}`
}
