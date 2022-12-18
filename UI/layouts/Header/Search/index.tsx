import { useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import MenuList from '@mui/material/MenuList'
import MenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'
import { TransitionGroup } from 'react-transition-group'
import Collapse from '@mui/material/Collapse'
import debounce from '@mui/utils/debounce'
import { useNFT3 } from '@nft3sdk/did-manager'

import { useDialog } from 'app/hooks/useDialog'
import SearchInput from 'components/input-fields/SearchInput'
import ClaimButton from 'components/btn/ClaimButton'

interface DIDSearchRecord {
  didname: string
  identifier: string
  addresses: string[]
  ctrlKeys: string[]
}

const ROOT = styled('div')`
  position: relative;
`

const Search = () => {
  const router = useRouter()
  const { client } = useNFT3()
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const { visible, open, close } = useDialog({
    onOpen: () => {
      setLoading(true)
    },
    onClose: () => {
      setLoading(false)
    },
  })
  const [options, setOptions] = useState<DIDSearchRecord[]>([])
  const debounceFetcher = useMemo(() => {
    const loadOptions = (value: string) => {
      const params = {
        keyword: value,
        mode: 'address',
        limit: 5,
      }
      if (!value.startsWith('0x') || value.length !== 42) {
        params.mode = 'didname'
      }
      client.did
        .search(params as any)
        .then((data) => {
          setOptions(data)
        })
        .finally(() => {
          setLoading(false)
        })
    }
    return debounce(loadOptions, 300)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { value } = e.target
    setValue(() => value)
    if (value) {
      open()
      debounceFetcher(value)
    } else {
      close()
    }
  }
  return (
    <ROOT>
      <SearchInput
        value={value}
        loading={loading}
        onChange={onChange}
        placeholder="Search by DID name or wallet address"
      />
      <Paper
        sx={{
          width: { xs: 1, sm: 450 },
          position: 'absolute',
          display: visible ? 'block' : 'none',
          zIndex: 1,
        }}
      >
        <MenuList>
          <TransitionGroup>
            {options.length ? (
              options.map((option) => (
                <Collapse key={option.identifier}>
                  <MenuItem
                    sx={{
                      padding: '12px 20px',
                    }}
                    onClick={() => {
                      router.push('/' + option.didname)
                      close()
                    }}
                  >
                    <ListItemText>{option.didname}</ListItemText>
                    {!option.ctrlKeys.length && <ClaimButton didname={option.didname} />}
                  </MenuItem>
                </Collapse>
              ))
            ) : (
              <Collapse>
                <MenuItem
                  sx={{
                    padding: '12px 20px',
                  }}
                >
                  <ListItemText>No results. This did is available.</ListItemText>
                  <ClaimButton didname={value} title="Create" />
                </MenuItem>
              </Collapse>
            )}
          </TransitionGroup>
        </MenuList>
      </Paper>
    </ROOT>
  )
}

export default Search
