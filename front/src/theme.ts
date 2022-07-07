import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  components: {},
  palette: {
    primary: {
      main: '#E2DCCD',
      dark: '#E2DECD',
      light: '#FCFBF4'
    },
    secondary: {
      main: '#01555A',
      light: '#89ABAC'
    },
    info: {
      main: '#C39984'
    }
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(',')
  },
  spacing: 4
})
