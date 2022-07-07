import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import { listStyles } from './styles'
import { listItems } from './consts/listItems'
import { useNavigate, useLocation } from 'react-router-dom'

function _List() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <List sx={listStyles.list}>
      {listItems.map((item) => (
        <ListItem
          selected={pathname.includes(item.route)}
          button
          key={item.id}
          onClick={() => navigate(item.route)}
          sx={listStyles.item}
        >
          <ListItemText primary={item.label} />
        </ListItem>
      ))}
    </List>
  )
}

export default _List
