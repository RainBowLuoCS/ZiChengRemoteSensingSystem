export const formStyles = {
  wrapper: {
    width: '28rem',
    height: '34rem',
    minWidth: '330px',
    minHeight: '420px',
    maxHeight: '550px',
    maxWidth: '450px',
    backgroundColor: 'primary.light',
    position: 'absolute',
    top: '50vh',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: '10',
    borderRadius: '0.6rem',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    boxSizing: 'border-box',
    cursor: 'default',

    '& .svg-icon': {
      zoom: 1.4,
      marginRight: '.5rem'
    }
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '75%',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: '20px'
  },
  input: {
    height: '38px',
    width: '100%',
    outline: 'none',
    border: '1px solid #BFBEBA',
    borderRadius: '5px',
    backgroundColor: '#E5E5E5',
    padding: '0 10px',
    boxSizing: 'border-box'
  },
  button: {
    width: '75%',
    marginTop: '20px',
    height: '38px',
    backgroundColor: 'secondary.main',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: '300',

    '&:hover': {
      backgroundColor: 'secondary.main'
    }
  },
  hint: {
    fontSize: '12px',
    color: '#908F8E'
  }
}
