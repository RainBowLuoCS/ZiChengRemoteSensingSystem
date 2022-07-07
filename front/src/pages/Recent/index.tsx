import Box from '@mui/material/Box'
import Projects from './components/Projects'
import Header from '../../components/Header'
import { recentStyles } from './styles'

function Recent() {
  return (
    <>
      <Header />
      <Box sx={recentStyles.wrapper}>
        <Projects />
      </Box>
    </>
  )
}

export default Recent
