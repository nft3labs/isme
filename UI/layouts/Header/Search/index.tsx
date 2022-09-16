import { styled } from '@mui/material/styles'
import SearchInput from 'components/input-fields/SearchInput'
import { useState } from 'react'

const ROOT = styled('div')``

const Search = () => {
  const [value, setValue] = useState('')
  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(() => e.target.value)
  }
  return (
    <ROOT>
      <SearchInput value={value} onChange={onChange} placeholder="Search by DID name or ETH address" />
    </ROOT>
  )
}

export default Search
