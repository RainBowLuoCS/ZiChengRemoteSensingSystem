export const perspectiveStyles = {
  wrapper: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    top: '100px',

    '& img': {
      userSelect: 'none'
    }
  },
  cube: {
    perspective: '5000px',
    transformStyle: 'preserve-3d',
    width: '70%',
    height: '150vh',
    maxHeight: '150vh',
    boxSizing: 'border-box',
    padding: '0 5rem',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    '& img': {
      position: 'absolute',
      top: '20rem',
      height: 'auto',
      cursor: 'pointer'
    }
  },
  cubeAtConer: {
    transformStyle: 'preserve-3d',
    width: '25%',
    position: 'absolute',
    left: '2rem',
    bottom: '25rem',

    '& img': {
      position: 'absolute',
      top: '0',
      height: 'auto',
      cursor: 'pointer'
    }
  },
  detail: {
    width: '68%',
    height: '100%',
    position: 'absolute',
    right: '60px'
  },
  button: {
    backgroundColor: '#C39984',
    position: 'fixed',
    right: '270px',
    bottom: '3rem',
    height: '6rem',
    minWidth: '30px',
    minHeight: '60px',
    width: '3rem',
    color: '#E2DECD',
    fontSize: '1.2rem',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    borderRadius: '.3rem',
    textAlign: 'center',
    cursor: 'pointer'
  },
  result: {
    backgroundColor: 'primary.dark',
    position: 'fixed',
    right: '270px',
    bottom: '19.7rem',
    height: '6rem',
    width: '3rem',
    minWidth: '30px',
    minHeight: '60px',
    color: 'secondary.main',
    fontSize: '1.2rem',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    borderRadius: '.3rem',
    textAlign: 'center',
    cursor: 'pointer',
    zIndex: 9999
  },
  sidebar: {
    position: 'fixed',
    right: '270px',
    bottom: '9.3rem',
    width: '3rem',

    '& .MuiListItem-root': {
      minWidth: '30px',
      minHeight: '30px',
      width: '3rem',
      height: '3rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'primary.dark',
      borderBottom: '2px solid #CFB3A0',
      padding: '0',

      '& svg': {
        zoom: '1.3'
      }
    },
    '& .MuiListItem-root:last-child': {
      border: 'none'
    }
  },
  sidebarDropdown: {
    position: 'absolute',
    top: '0',
    right: '3rem',
    width: '230px',
    padding: '10px',
    backgroundColor: '#C39984',
    borderTopLeftRadius: '.5rem',
    borderBottomLeftRadius: '.5rem',
    borderBottomRightRadius: '.5rem',
    cursor: 'default'
  },
  square: {
    width: '80%',
    height: '82vh',
    position: 'relative',

    '& img': {
      width: '100%',
      position: 'absolute',
      left: '0',
      top: 0,
      borderRadius: '.5rem'
    }
  }
}
