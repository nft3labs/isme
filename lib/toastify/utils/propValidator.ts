import { isValidElement } from 'react'

import type { Id } from '../types'

export function isNum(v: any): v is number {
  return typeof v === 'number' && !isNaN(v)
}

export function isBool(v: any): v is boolean {
  return typeof v === 'boolean'
}

export function isStr(v: any): v is string {
  return typeof v === 'string'
}

export function isFn(v: any): v is Function {
  return typeof v === 'function'
}

export function parseClassName(v: any) {
  return isStr(v) || isFn(v) ? v : null
}

export function isToastIdValid(toastId?: Id) {
  return toastId === 0 || toastId
}

export function getAutoCloseDelay(toastAutoClose?: false | number, containerAutoClose?: false | number) {
  return toastAutoClose === false || (isNum(toastAutoClose) && toastAutoClose > 0) ? toastAutoClose : containerAutoClose
}

export const canUseDom = !!(typeof window !== 'undefined' && window.document && window.document.createElement)

export function canBeRendered<T>(content: T): boolean {
  return isValidElement(content) || isStr(content) || isFn(content) || isNum(content)
}
