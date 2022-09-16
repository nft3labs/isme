import { useMemo } from 'react'

import { headerRenderer, cellRenderer } from 'components/table/renderer'

export const useTable = () => {
  const columns = useMemo(
    () => [
      {
        label: 'Token',
        dataKey: 'symbol',
        width: 250,
        headerRenderer,
        cellRenderer,
      },
      {
        label: 'Price',
        dataKey: 'price',
        width: 200,
        headerRenderer,
        cellRenderer,
      },
      {
        label: 'Balance',
        dataKey: 'balance',
        width: 230,
        headerRenderer,
        cellRenderer,
      },
      {
        label: 'Value',
        dataKey: 'balanceUSD',
        width: 200,
        headerRenderer,
        cellRenderer,
      },
    ],
    []
  )

  return {
    columns,
  }
}
