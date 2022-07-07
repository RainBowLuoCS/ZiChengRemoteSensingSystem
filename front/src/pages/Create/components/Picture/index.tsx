import Box from '@mui/material/Box'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
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
  return (
    <ImageList sx={pictureStyles.wrapper}>
      {itemData.map((item) => (
        <ImageListItem key={item.img} sx={pictureStyles.item}>
          <img
            src={item.img}
            srcSet={item.img}
            alt={item.title}
            loading="lazy"
          />
        </ImageListItem>
      ))}
    </ImageList>
  )
}
