import Box from '@mui/material/Box'
import Projects from './components/Projects'
import Header from '../../components/Header'
import { binStyles } from './styles'

function Recent() {
  return (
    <>
      <Header />
      <Box sx={binStyles.wrapper}>
        <Projects />
      </Box>
    </>
  )
}

export default Recent
