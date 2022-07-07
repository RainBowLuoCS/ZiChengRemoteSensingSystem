import { keyframes } from '@mui/system'

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

export const loadingStyles = {
  loading: {
    '&': {
      width: '15rem',
      backgroundColor: '#719A93',
      height: '15rem',
      borderRadius: '50%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      bottom: '30px',
      overflow: 'hidden'
    },
    inner: {
      width: '12rem',
      height: '12rem',
      backgroundColor: 'primary.main',
      borderRadius: '50%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'secondary.main',
      fontSize: '1.2rem',
      position: 'absolute',
      zIndex: 1
    },
    rotate: {
      width: '7.5rem',
      height: '7.5rem',
      position: 'absolute',
      zIndex: 0,
      left: '50%',
      top: '50%',
      backgroundColor: 'secondary.main',
      transformOrigin: 'left top',
      animation: `${spin} 2s infinite linear`
    }
  }
}
