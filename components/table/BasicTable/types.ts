import type { ColumnProps, TableProps } from 'react-virtualized'

export interface BasicTableProps<D = any> {
  columns: TableColumnsProps[]
  rowHeight?: number
  headerHeight?: number
  data: Array<D>
  tableProps?: Partial<TableProps>
  pagination?: {
    count: number
    page: number
    rowsPerPage: number
    onPageChange: (event: unknown, newPage: number) => void
    onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  }
}

export type TableColumnsProps = ColumnProps
