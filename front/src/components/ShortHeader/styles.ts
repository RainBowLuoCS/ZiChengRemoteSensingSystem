export const shortHeaderStyles = {
  appBar: {
    '&': {
      paddingLeft: '250px',
      height: '60px',
      backgroundColor: 'primary.light',
      lineHeight: '60px',
      boxShadow: 'none',
      position: 'fixed',
      top: 0,
      zIndex: 2
    },
    '& .MuiToolbar-root': {
      height: '60px',
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0 53px 0 36px'
    },
    '& .MuiListItem-root span': {
      color: 'secondary.main'
    }
  },
  search: {
    '&': {
      display: 'flex',
      alignItems: 'center'
    },
    '& input': {
      border: '1px solid #01555A',
      borderRadius: '25px'
    }
  }
}
