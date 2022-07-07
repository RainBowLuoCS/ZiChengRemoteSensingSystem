export const pictureStyles = {
  wrapper: {
    position: 'absolute',
    top: '10rem',
    right: '0',
    display: 'flex',
    width: '50rem',
    height: '35rem',
    overflow: 'hidden',
    zIndex: 0
  },
  item: {
    '&': {
      width: '14rem',
      position: 'absolute',
      top: 0,
      zIndex: 1
    },
    '&:nth-of-type(1)': {
      right: '20rem'
    },
    '&:nth-of-type(2)': {
      right: '10rem'
    },
    '&:nth-of-type(3)': {
      right: '-1rem'
    },
    '& img': {
      borderRadius: '1.8rem',
      height: '35rem!important'
    },
    '&:nth-of-type(1) img, &:nth-of-type(2) img': {
      width: '25rem!important'
    }
  }
}
