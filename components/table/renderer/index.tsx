import type { TableCellRenderer, TableHeaderRenderer } from 'react-virtualized'
import TableCell from '@mui/material/TableCell'

export const headerRenderer: TableHeaderRenderer = ({ label }) => {
  return (
    <TableCell component="div" variant="head">
      {label as any}
    </TableCell>
  )
}

export const cellRenderer: TableCellRenderer = ({ cellData }) => {
  return <TableCell component="div">{cellData || '-'}</TableCell>
}
