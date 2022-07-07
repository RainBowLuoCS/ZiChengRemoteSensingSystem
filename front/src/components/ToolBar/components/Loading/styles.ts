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
      width: '9rem',
      backgroundColor: '#979693',
      height: '9rem',
      borderRadius: '50%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      top: '45%',
      left: '50%',
      transform: 'translateX(-50%) translateY(-50%)',
      overflow: 'hidden'
    },
    inner: {
      width: '7.2rem',
      height: '7.2rem',
      backgroundColor: '#313131',
      borderRadius: '50%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'primary.light',
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
