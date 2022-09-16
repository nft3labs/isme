import type { FC } from 'react'
import { Fragment } from 'react'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import TablePagination from '@mui/material/TablePagination'

import PCTable from './PCTable'
import MobileTable from './MobileTable'
import type { BasicTableProps } from './types'

const BasicTable: FC<BasicTableProps> = (props) => {
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.up('md'))

  return (
    <Fragment>
      {matches ? <PCTable {...props} /> : <MobileTable {...props} />}
      {props.pagination && (
        <TablePagination
          rowsPerPageOptions={[10, 20, 30]}
          component="div"
          count={props.pagination.count}
          rowsPerPage={props.pagination.rowsPerPage}
          page={props.pagination.page}
          onPageChange={props.pagination.onPageChange}
          onRowsPerPageChange={props.pagination.onRowsPerPageChange}
        />
      )}
    </Fragment>
  )
}

export default BasicTable
