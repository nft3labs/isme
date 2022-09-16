import { cloneDeep, noop } from 'lodash'

const BNArrToStrArr = (obj: any[]) => {
  const arr = cloneDeep(obj)
  return arr.map((item) => BNObjToStrObj(item))
}
const BNObjToStrObj = (obj: any) => {
  if (typeof obj !== 'object') return obj
  const o: any = {}
  Object.keys(obj).forEach((k) => {
    if (!obj[k]) return
    if (obj[k]._isBigNumber && obj[k].toString) {
      o[k] = obj[k].toString()
    } else if (obj[k] instanceof Array) {
      o[k] = BNArrToStrArr(obj[k])
    } else if (typeof obj[k] === 'object') {
      o[k] = BNObjToStrObj(obj[k])
    } else {
      o[k] = obj[k]
    }
  })
  return o
}

const getStringObj = (obj: any) => {
  if (obj instanceof Array) {
    return BNArrToStrArr(obj)
  } else {
    return BNObjToStrObj(obj)
  }
}

export const log = __DEV__
  ? (key: string, obj: any) => {
      console.log(key, getStringObj(obj))
    }
  : noop
