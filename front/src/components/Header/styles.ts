export const headerStyles = {
  appBar: {
    '&': {
      height: '60px',
      backgroundColor: '#313131',
      lineHeight: '80px',
      color: '#000',
      boxShadow: 'none',
      position: 'fixed',
      top: 0,
      zIndex: 1
    },
    '& .MuiToolbar-root': {
      height: '60px',
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0 53px 0 36px'
    }
  },
  logo: {
    '&': {
      display: 'flex',
      alignItems: 'center'
    },
    '& .svg-icon': {
      zoom: '1.6',
      marginRight: '5px'
    }
  },
  search: {
    '&': {
      display: 'flex',
      alignItems: 'center'
    }
  }
}
