export const buttonStyles = {
  button: {
    '&': {
      backgroundColor: 'primary.dark',
      marginLeft: '1rem',
      height: '40px',
      width: '40px',
      borderRadius: '25px',
      fontSize: '16px',
      color: 'secondary.main',
      fontWeight: '400',
      padding: '0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      outline: '2px solid #01555A',
      cursor: 'pointer',
      lineHeight: '50px'
    },
    '&:hover': {
      backgroundColor: 'primary.dark'
    }
  },
  dropdown: {
    width: '180px',
    position: 'absolute',
    padding: '10px',
    top: '60px',
    right: '0',
    backgroundColor: 'primary.dark',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  }
}
