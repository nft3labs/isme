import { useMemo } from 'react'
import { useNFT3Assets } from 'domains/data'

import { headerRenderer } from 'components/table/renderer'
import { cellRendererNumber, cellRendererToken, cellRendererUSD } from './renderer'

export const useTable = () => {
  const { tokens } = useNFT3Assets()
  const columns = useMemo(
    () => [
      {
        label: 'Token',
        dataKey: 'symbol',
        width: 250,
        headerRenderer,
        cellRenderer: cellRendererToken,
      },
      {
        label: 'Price',
        dataKey: 'price',
        width: 200,
        headerRenderer,
        cellRenderer: cellRendererUSD,
      },
      {
        label: 'Balance',
        dataKey: 'balance',
        width: 230,
        headerRenderer,
        cellRenderer: cellRendererNumber,
      },
      {
        label: 'Value',
        dataKey: 'balanceUSD',
        width: 200,
        headerRenderer,
        cellRenderer: cellRendererUSD,
      },
    ],
    []
  )

  console.log('tokens', tokens)

  return {
    columns,
    data: tokens,
  }
}
