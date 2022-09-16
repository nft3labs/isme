import type { FC } from 'react'
import { useMemo, Fragment, useState } from 'react'
import clsx from 'clsx'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import Grid from '@mui/material/Grid'

import type { BasicTableProps } from './types'

const EXPAND_WIDTH = '60px'
const columnsPrimaryNumber = 2

type CollapsibleHeadProps = Pick<BasicTableProps, 'columns'>
type CollapsibleRowProps = Pick<BasicTableProps, 'columns'> & {
  data: any[]
  row: any
  rowIndex: any
}

const CollapsibleHead: FC<CollapsibleHeadProps> = (props) => {
  const columnsPrimary = props.columns.slice(0, columnsPrimaryNumber)

  return (
    <Fragment>
      <td
        className="ReactVirtualized__Table__headerColumn"
        role="columnheader"
        style={{
          overflow: 'hidden',
          flex: `0 1 ${EXPAND_WIDTH}`,
        }}
      >
        <TableCell align="center" component="div" variant="head">
          &nbsp;
        </TableCell>
      </td>
      {columnsPrimary.map((column) => (
        <td
          key={column.dataKey}
          className="ReactVirtualized__Table__headerColumn"
          role="columnheader"
          style={{
            overflow: 'hidden',
            flex: `0 1 ${column.width}px`,
          }}
        >
          {column.headerRenderer(column)}
        </td>
      ))}
    </Fragment>
  )
}
const CollapsibleRow: FC<CollapsibleRowProps> = (props) => {
  const [open, setOpen] = useState(false)
  const { columns, row, rowIndex, data } = props

  const columnsPrimary = columns.slice(0, columnsPrimaryNumber)
  const columnsSecondary = columns.slice(columnsPrimaryNumber)

  return (
    <Fragment>
      <TableRow
        className={clsx(['ReactVirtualized__Table__row'], {
          'end-row': data.length - 1 === rowIndex,
        })}
        onClick={() => setOpen(!open)}
      >
        <td
          className="ReactVirtualized__Table__rowColumn"
          role="gridcell"
          style={{
            overflow: 'hidden',
            flex: `0 1 ${EXPAND_WIDTH}`,
          }}
        >
          <TableCell align="center" component="div">
            <IconButton aria-label="expand row" size="small">
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
        </td>
        {columnsPrimary.map((column, columnIndex) => (
          <td
            key={rowIndex + column.dataKey}
            className="ReactVirtualized__Table__rowColumn"
            role="gridcell"
            style={{
              overflow: 'hidden',
              flex: `0 1 ${column.width}px`,
            }}
          >
            {column.cellRenderer({
              cellData: row[column.dataKey],
              columnData: column,
              columnIndex,
              dataKey: column.dataKey,
              isScrolling: false,
              rowData: row,
              rowIndex,
            })}
          </td>
        ))}
      </TableRow>
      <TableRow className="ReactVirtualized__Table__row">
        <Box
          component="td"
          role="gridcell"
          sx={[
            {
              overflow: 'hidden',
              flex: 1,
            },
            data.length - 1 != rowIndex && { borderBottom: 1, borderColor: 'divider' },
          ]}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ padding: 2 }}>
              {columnsSecondary.map((column, columnIndex) => (
                <Grid
                  className="ReactVirtualized__Table__rowColumn secondary"
                  container
                  spacing={2}
                  key={rowIndex + column.dataKey}
                >
                  <Grid item xs={4} className="label">
                    {column.headerRenderer(column)}
                  </Grid>
                  <Grid item xs={8} className="value">
                    {column.cellRenderer({
                      cellData: row[column.dataKey],
                      columnData: column,
                      columnIndex,
                      dataKey: column.dataKey,
                      isScrolling: false,
                      rowData: row,
                      rowIndex,
                    })}
                  </Grid>
                </Grid>
              ))}
            </Box>
          </Collapse>
        </Box>
      </TableRow>
    </Fragment>
  )
}

const MobileTable: FC<BasicTableProps> = (props) => {
  const { columns, data } = props

  const table = useMemo(() => {
    return {
      head: <CollapsibleHead columns={columns} />,
      body:
        data &&
        data.map((row, rowIndex) => (
          <CollapsibleRow
            key={rowIndex}
            {...{
              data,
              row,
              rowIndex,
              columns,
            }}
          />
        )),
    }
  }, [columns, data])

  return (
    <ROOT className="table basic-table">
      <Table>
        <TableHead>
          <TableRow className="ReactVirtualized__Table__headerRow">{table.head}</TableRow>
        </TableHead>
        <TableBody>{table.body}</TableBody>
      </Table>
    </ROOT>
  )
}

export const ROOT = styled('div')`
  height: 100%;
  width: 100%;
  .MuiTable-root,
  .MuiTableHead-root,
  .MuiTableBody-root {
    display: block;
  }
  .ReactVirtualized__Table__headerRow,
  .ReactVirtualized__Table__rowColumn {
    display: flex;
  }
  .ReactVirtualized__Table__rowColumn {
    .MuiTableCell-root {
      border-bottom: unset;
    }

    &.secondary {
      align-items: center;
      position: relative;
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        ${({ theme }) => ({
          borderBottom: `1px solid ${theme.palette.divider}`,
          left: theme.spacing(2),
          width: `calc(100% - ${theme.spacing(4)})`,
        })}
      }
      .MuiGrid-item {
        display: flex;
      }
      .label .MuiTableCell-root {
        justify-content: right;
      }
      .value .MuiTableCell-root {
        justify-content: left;
      }
    }
  }
  .MuiTableCell-root {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    flex: 1;
  }

  .MuiTableCell-alignCenter {
    justify-content: center;
  }

  .ReactVirtualized__Table__row {
    display: flex;
    will-change: transform;
    &.end-row {
      .MuiTableCell-root {
        border-bottom: unset;
      }
    }
  }
`

export default MobileTable
