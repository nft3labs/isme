import Card from '@mui/material/Card'
import BasicTable from 'components/table/BasicTable'
import { useNFT3Assets } from 'domains/data'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

import { useTable } from './useTable'

const Table: FC = () => {
  const { loading } = useNFT3Assets()
  const table = useTable()

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={100}>
        <CircularProgress />
      </Box>
    )
  }

  if (!table.data.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={100}>
        <Typography color='text.disabled'>No tokens yet.</Typography>
      </Box>
    )
  }

  return (
    <Card>
      <BasicTable {...{ ...table }} />
    </Card>
  )
}

export default Table
