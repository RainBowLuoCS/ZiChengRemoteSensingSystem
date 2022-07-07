import Box from '@mui/material/Box'
import Create from './components/Create'
import Picture from './components/Picture'
import Functions from './components/Functions'
import Header from '../../components/Header'
import { homeStyles } from './styles'

function Home() {
  return (
    <>
      <Header />
      <Box sx={homeStyles.body}>
        <Create />
        <Picture />
        <Functions name="" />
      </Box>
    </>
  )
}

export default Home
