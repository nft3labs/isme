import type { TableCellRenderer } from 'react-virtualized'
import TableCell from '@mui/material/TableCell'
import Stack from '@mui/material/Stack'
import Avatar from '@mui/material/Avatar'
import { Span, Tiny } from 'components/Typography'
import { DisplayUSD, DisplayNumber } from 'components/Number'

export const cellRendererToken: TableCellRenderer = ({ rowData }) => {
  return (
    <TableCell component="div">
      <Stack spacing={2} direction="row" alignItems="center">
        <Avatar alt={rowData.symbol} sx={{ width: 24, height: 24 }} src={rowData.icon} />
        <Stack spacing={0}>
          <Span fontWeight={600}>{rowData.symbol}</Span>
          <Tiny>{rowData.symbol}</Tiny>
        </Stack>
      </Stack>
    </TableCell>
  )
}

export const cellRendererUSD: TableCellRenderer = ({ cellData }) => {
  return (
    <TableCell component="div">
      <DisplayUSD value={cellData} />
    </TableCell>
  )
}
export const cellRendererNumber: TableCellRenderer = ({ cellData }) => {
  return (
    <TableCell component="div">
      <DisplayNumber value={cellData} />
    </TableCell>
  )
}
