import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'
import Input from '@mui/material/Input'
import FormControl from '@mui/material/FormControl'
import Box from '@mui/material/Box'
import { searchStyles } from './styles'
import { useShowInput } from './hooks/useShowInput'
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

function Search() {
  const navigate = useNavigate()
  const { showInput, setShowInput } = useShowInput()
  const [keyword, setKeyword] = useState('')
  const { pathname } = useLocation()

  return (
    <Box sx={searchStyles.wrapper}>
      <FormControl variant="standard" onClick={(e) => e.stopPropagation()}>
        <Input
          sx={searchStyles.input}
          disableUnderline={true}
          style={{ display: showInput ? 'inline-block' : 'none' }}
          onChange={(e) => {
            setKeyword(e.target.value)
          }}
          onKeyDown={(e) => {
            if (e.nativeEvent.key === 'Enter') {
              if (pathname === '/recent') {
                navigate(`/recent?keyword=${keyword}`)
              } else if (pathname === '/bin') {
                navigate(`/bin?keyword=${keyword}`)
              }
            }
          }}
        />
      </FormControl>
      <IconButton
        aria-label="search"
        sx={searchStyles.search}
        onClick={(e) => {
          e.stopPropagation()
          setShowInput(!showInput)
        }}
      >
        <SearchIcon sx={searchStyles.icon} />
      </IconButton>
    </Box>
  )
}

export default Search
