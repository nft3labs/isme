import Paper from '@mui/material/Paper'
import type { InputBaseProps } from '@mui/material/InputBase'
import InputBase from '@mui/material/InputBase'
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { useRef } from 'react'
import { inputSetValue } from 'app/utils/dom/input'
import { safeGet } from 'app/utils/get'
import { useRouter } from 'next/router'

const SearchInput: FC<InputBaseProps> = (props) => {
  const inputRef = useRef<HTMLInputElement>()
  const router = useRouter()
  return (
    <Paper component="form" sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}>
      <IconButton
        sx={{ p: '10px' }}
        aria-label="search"
        onClick={() => {
          if (props.value) {
            ;(window as any).location = '/profile-board/' + props.value
          } else {
            const input = safeGet(() => inputRef.current)
            if (input) input.focus()
          }
        }}
      >
        <SearchIcon />
      </IconButton>
      <InputBase
        inputRef={inputRef}
        sx={{ ml: 1, flex: 1 }}
        {...props}
        onKeyDown={(e) => {
          if (e.code === 'Enter' && props.value) {
            ;(window as any).location = '/profile-board/' + props.value
            e.preventDefault()
          }
        }}
      />
      {props.value && (
        <IconButton
          type="button"
          sx={{ p: '10px' }}
          aria-label="search"
          onClick={() => {
            const input = safeGet(() => inputRef.current)
            if (input) inputSetValue(input, '')
          }}
        >
          <HighlightOffIcon />
        </IconButton>
      )}
    </Paper>
  )
}

export default SearchInput
