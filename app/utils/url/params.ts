import { isEmpty } from 'lodash'
export const parseParams = (uri: string, params: Record<string, any>) => {
  if (isEmpty(params)) return uri
  const paramsArray: string[] = []
  Object.keys(params).forEach((key) => params[key] && paramsArray.push(`${key}=${params[key]}`))
  if (uri.search(/\?/) === -1) {
    uri += `?${paramsArray.join('&')}`
  } else {
    uri += `&${paramsArray.join('&')}`
  }
  return uri
}
