import Box from '@mui/material/Box'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import useMediaQuery from '@mui/material/useMediaQuery'
import { pictureStyles } from './styles'

const itemData = [
  {
    img: 'http://cdn.danmoits.com/homeImg3.png',
    title: 'homeImg3'
  },
  {
    img: 'http://cdn.danmoits.com/homeImg1.png',
    title: 'homeImg1'
  },
  {
    img: 'http://cdn.danmoits.com/homeImg2.png',
    title: 'homeImg2'
  }
]

export default function Picture() {
  const breakPoint = useMediaQuery('(min-width:1000px)')

  return (
    <ImageList
      sx={pictureStyles.wrapper}
      style={{
        top: breakPoint ? '4.5rem' : '55px',
        width: breakPoint ? '50rem' : '500px',
        height: breakPoint ? '35rem' : '350px'
      }}
    >
      {itemData.map((item) => (
        <ImageListItem
          key={item.img}
          sx={{
            '&': {
              width: breakPoint ? '14rem' : '170px',
              position: 'absolute',
              top: 0,
              zIndex: 1
            },
            '&:nth-of-type(1)': {
              right: breakPoint ? '20rem' : '190px'
            },
            '&:nth-of-type(2)': {
              right: breakPoint ? '10rem' : '80px'
            },
            '&:nth-of-type(3)': {
              right: breakPoint ? '-1rem' : '-30px'
            },
            '& img': {
              height: breakPoint ? '35rem!important' : '320px!important',
              borderRadius: breakPoint ? '1.8rem' : '15px'
            }
          }}
        >
          <img
            src={item.img}
            // srcSet={item.img}
            alt={item.title}
            loading="lazy"
          />
        </ImageListItem>
      ))}
    </ImageList>
  )
}
