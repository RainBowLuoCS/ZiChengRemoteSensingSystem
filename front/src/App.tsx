import { Route, Routes, Navigate} from 'react-router-dom'
import routes from './routes'
import { Grid } from '@mui/material'
import './styles/index.css'

function App() {
  return (
    <Grid container>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        {routes.map((item, i) => {
          return (
            <Route
              key={i}
              path={item.path as string}
              element={<item.element />}
            />
          )
        })}
      </Routes>
    </Grid>
  )
}

export default App
