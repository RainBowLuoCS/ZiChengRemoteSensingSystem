export const formStyles = {
  wrapper: {
    display: 'flex',
    position: 'absolute',
    top: '10rem',
    width: '50rem',
    height: '32rem',
    left: '8rem'
  },
  left: {
    width: '100%',
    display: 'flex',
    boxSizing: 'border-box',
    paddingLeft: '1rem',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  input: {
    width: '80%',
    height: '6rem',
    maxHeight: '90px',
    minHeight: '60px',
    border: '2px solid',
    borderColor: 'secondary.main',
    borderRadius: '1rem',
    fontSize: '1.5rem',
    padding: '0 1rem',
    backgroundColor: '#DDDCDC',
    marginBottom: '4rem'
  },
  button: {
    width: '60%',
    height: '4rem',
    maxHeight: '70px',
    minHeight: '50px',
    backgroundColor: 'secondary.main',
    borderRadius: '1rem',
    fontSize: '1.2rem',
    color: 'primary.light',

    '&:hover': {
      backgroundColor: 'secondary.main'
    }
  },
  upload: {
    width: '30rem',
    height: '30rem',
    backgroundColor: 'primary.dark',
    borderRadius: '1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  }
}
