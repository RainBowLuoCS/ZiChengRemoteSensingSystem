export const functionsStyles = {
  wrapper: {
    position: 'absolute',
    bottom: 0,
    display: 'flex',
    width: '100vw',
    minWidth: '1000px',
    justifyContent: 'space-evenly',
    padding: '0 6rem 0 9rem',
    boxSizing: 'border-box'
  },
  item: {
    width: '13rem',
    height: '6rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: '1rem',
    borderTopRightRadius: '1rem',
    backgroundColor: 'primary.dark',
    boxShadow: '0 2px 8px rgba(0, 0, 0, .5)',

    '&:hover + .MuiPaper-root': {
      display: 'flex'
    }
  },
  icon: {
    backgroundColor: '#fff',
    width: '2.5rem',
    height: '2.5rem',
    marginBottom: '5px',
    zIndex: 0,

    '&:hover': {
      backgroundColor: '#fff'
    },
    '& svg': {
      zoom: 1.4
    }
  },
  hoverItem: {
    width: '13rem',
    height: '14rem',
    display: 'none',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '1rem',
    backgroundColor: 'primary.dark',
    boxShadow: '0 2px 8px rgba(0, 0, 0, .5)',
    position: 'absolute',
    bottom: '1rem',
    zIndex: 11,
    cursor: 'pointer',

    // 因为mask有闪烁问题，所以去掉
    // '& + .mask': {
    //   width: '100vw',
    //   height: '100vh',
    //   position: 'fixed',
    //   backgroundColor: 'rgba(0, 0, 0, .5)',
    //   top: 0,
    //   left: 0,
    //   zIndex: 10,
    //   display: 'none'
    // },
    '&:hover': {
      display: 'flex'
    },
    '&:hover + .mask': {
      display: 'block'
    }
  }
}
