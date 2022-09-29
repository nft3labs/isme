import { useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'
import BigNumber from 'bignumber.js'

/**
 * Number Format
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat
 */
export const useNumberFormat = () => {
  const router = useRouter()

  const numberFormat = useCallback(
    (value: BigNumber.Value, options: Intl.NumberFormatOptions = {}) => {
      const numberFormat = new Intl.NumberFormat(router.locale || 'en', options)
      const bn = new BigNumber(value)
      return bn.isNaN() ? '-' : numberFormat.format(bn.toNumber())
    },
    [router.locale]
  )

  const returnValue = useMemo(
    () => ({
      format: numberFormat,
      getOptions: numberFormatOptions,
    }),
    [numberFormat]
  )

  return returnValue
}

const getOptions = (fn: any, options: any) => ({
  ...fn(),
  ...options,
})

const numberFormatOptions = (
  type: 'number' | 'USD' | 'percent' = 'number',
  options: Intl.NumberFormatOptions = {}
): Intl.NumberFormatOptions => {
  switch (type) {
    case 'number':
      return options
    case 'USD':
      return getOptions(createUSDFormatOptions, options)
    case 'percent':
      return getOptions(createPercentFormatOptions, options)
  }
}

const createUSDFormatOptions = () => ({
  style: 'currency',
  maximumFractionDigits: 2,
  currency: 'USD',
  currencyDisplay: 'narrowSymbol',
})

const createPercentFormatOptions = () => ({
  style: 'percent',
  minimumFractionDigits: 2,
})
