import Paper from '@mui/material/Paper'
import type { InputBaseProps } from '@mui/material/InputBase'
import InputBase from '@mui/material/InputBase'
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import { useRef } from 'react'
import { inputSetValue } from 'app/utils/dom/input'
import { safeGet } from 'app/utils/get'
import { useRouter } from 'next/router'
import { useTheme } from '@mui/material/styles'

const SearchInput: FC<InputBaseProps> = (props) => {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>()
  const theme = useTheme()
  return (
    <Paper
      component="form"
      elevation={3}
      sx={{
        p: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: { xs: 1, sm: 450 },
        borderRadius: '12px',
        border: 'solid 1px transparent',
        '&:hover': {
          borderColor: theme.palette.primary.main,
        },
      }}
    >
      <IconButton
        sx={{ p: '10px' }}
        aria-label="search"
        onClick={() => {
          if (props.value) {
            router.push('/profile/' + props.value)
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
            router.push('/profile/' + props.value)
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
          <CloseIcon />
        </IconButton>
      )}
    </Paper>
  )
}

export default SearchInput
