import Card from '@mui/material/Card'
import BasicTable from 'components/table/BasicTable'

import { useTable } from './useTable'

const Table: FC = () => {
  const table = useTable()
  return (
    <Card>
      <BasicTable {...{ ...table }} />
    </Card>
  )
}

export default Table
