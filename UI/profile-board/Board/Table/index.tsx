import Card from '@mui/material/Card'
import BasicTable from 'components/table/BasicTable'
import { useNFT3Assets } from 'domains/data'

import { useTable } from './useTable'

const Table: FC = () => {
  const { loading } = useNFT3Assets()
  const table = useTable()

  if (loading) {
    return <div>loading</div>
  }

  if (!table.data.length) {
    return <div>No Tokens yet.</div>
  }

  return (
    <Card>
      <BasicTable {...{ ...table }} />
    </Card>
  )
}

export default Table
