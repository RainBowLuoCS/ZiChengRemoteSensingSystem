export const mainStyles = {
  wrapper: {
    width: '100%',
    height: '82vh',
    maxHeight: '150vh',
    margin: '10px 270px 0 230px',
    display: 'flex',
    position: 'relative',
    userSelect: 'none'
  },
  image: {
    marginTop: '100px',
    minHeight: '550px',
    minWidth: '400px',
    width: '63%',
    marginRight: '20px',
    boxSizing: 'border-box',
    overflow: 'hidden',
    borderRadius: '20px',
    position: 'relative',
    backgroundColor: 'secondary.light',
    userSelect: 'none',

    '& img': {
      height: '100%',
      borderRadius: '20px',
      position: 'absolute'
    },
    '& img:nth-of-type(2)': {
      left: '20%'
    }
  },
  placeholder: {
    backgroundColor: 'secondary.main',
    height: '100%',
    width: '80%',
    borderRadius: '20px',
    position: 'absolute',
    left: '20%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',

    '& svg': {
      zoom: '3'
    }
  },
  function: {
    marginTop: '100px',
    width: '37%',
    position: 'relative',
    minHeight: '550px',
    minWidth: '300px'
  },
  function_inner: {
    position: 'absolute',
    bottom: '0',
    width: '100%',
    height: '94%',
    backgroundColor: 'primary.dark',
    borderRadius: '20px',
    boxSizing: 'border-box',
    padding: '10px'
  },
  upper: {
    padding: '15px',
    maxHeight: '47vh',
    overflow: 'auto'
  },
  select: {
    backgroundColor: '#fff',
    color: 'secondary.main',
    height: '43px',
    lineHeight: '43px',
    padding: '0',
    borderRadius: '10px',

    '& .MuiSelect-select': {
      height: '43px',
      padding: '0 0 0 10px',
      display: 'flex',
      alignItems: 'center'
    },
    '& input': {
      height: '43px',
      border: '1px solid #01555A'
    }
  },
  addNext: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer'
  },
  resultName: {
    padding: '15px'
  },
  btnArea: {
    position: 'absolute',
    bottom: '20px',
    width: '100%',
    left: '0',
    display: 'flex',
    justifyContent: 'center',

    '& button': {
      borderRadius: '10px',
      height: '42px',
      fontWeight: '400',
      boxShadow: '0 3px 2px rgba(0, 0, 0, .3)',
      width: '70%'
    }
  }
}
