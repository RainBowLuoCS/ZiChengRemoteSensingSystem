export const projectStyles = {
  wrapper: {
    width: '100%',
    height: '60vh',
    display: 'grid',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: 'primary.light',
    gridTemplateColumns: '20% 20% 20% 20%',
    marginTop: '5rem',
    justifyItems: 'center'
  },
  mask: {
    display: 'none',
    width: '18rem',
    height: '18rem',
    backgroundColor: 'rgba(226, 222, 205, .7)',
    position: 'absolute',
    top: '0',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '1rem',
    boxShadow: '0 5px 8px rgba(0, 0, 0, .3)'
  },
  middle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  bottom: {
    textAlign: 'center',
    color: 'secondary.main',
    fontSize: '1rem',
    position: 'absolute',
    bottom: '0.7rem'
  }
}
