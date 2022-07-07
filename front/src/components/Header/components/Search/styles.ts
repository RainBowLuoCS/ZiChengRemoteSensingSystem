export const searchStyles = {
  wrapper: {
    '&': {
      display: 'flex',
      justifyContent: 'end',
      alignItems: 'center',
      width: '25rem'
    }
  },
  input: {
    '&': {
      backgroundColor: 'primary.light',
      boxSizing: 'border-box',
      borderRadius: '25px',
      width: '18.75rem',
      fontSize: '18px',
      position: 'relative',
      left: '46px'
    },
    '& .MuiInput-input': {
      height: '40px',
      lineHeight: '40px',
      padding: '0 55px 0 10px',
      boxSizing: 'border-box'
    },
    '&:focus': {
      border: 'none'
    }
  },
  search: {
    '&': {
      backgroundColor: 'primary.main',
      height: '40px',
      width: '40px'
    },
    '&:hover': {
      backgroundColor: 'primary.main'
    }
  },
  icon: {
    '&': {
      color: 'secondary.main',
      fontSize: '30px'
    }
  }
}
