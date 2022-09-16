import { safeGet } from '../get'

export const catchError = (e: any, title?: string) => {
  e = safeGet(() => e.error) || e
  const errors: any[] = safeGet(() => e.body.detail) || [e.body]
  let message = safeGet(() => errors[0].msg)
  message = title ? `${title}, ${message}` : message

  return {
    errors: errors.reduce((obj, e) => {
      safeGet(() => {
        const { field, msg } = e
        obj[field] = msg
      })
      return obj
    }, {} as any),
    message: message || 'rejected 🤯',
  }
}
