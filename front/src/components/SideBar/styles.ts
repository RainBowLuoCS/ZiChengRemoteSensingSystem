export const sideBarStyles = {
  drawer: {
    width: 200,
    borderRadius: '20px',

    '& .MuiDrawer-paper': {
      width: 200,
      height: '98vh',
      boxSizing: 'border-box',
      backgroundColor: '#313131',
      color: '#fff',
      borderRight: 'none',
      borderRadius: '20px',
      marginLeft: '10px',
      marginTop: '1vh'
    },
    '& .Mui-selected': {
      backgroundColor: '#FCFBF4!important'
    },
    '& .Mui-selected span': {
      color: 'secondary.main'
    },
    '& .Mui-selected:hover': {
      backgroundColor: '#FCFBF4'
    },
    '& .MuiListItem-root': {
      marginLeft: '10%',
      width: '90%',
      borderTopLeftRadius: '25px',
      borderBottomLeftRadius: '25px',
      height: '60px',
      marginTop: '30px'
    }
  },
  icons: {
    color: '#000',

    '& .MuiIconButton-root': {
      backgroundColor: '#fff',

      '& svg': {
        zoom: 1.4
      }
    },
    '& .MuiIconButton-root:hover': {
      backgroundColor: '#fff'
    }
  },
  text: {
    marginLeft: '16px',
    '& span': {
      marginLeft: '-10px',
      fontWeight: '300',
      fontSize: '16px'
    }
  },
  logo: {
    '&': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    },
    '& .svg-icon': {
      zoom: '1.6',
      marginRight: '8px'
    }
  }
}
