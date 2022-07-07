import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { ProjectStore } from '../../../../../../../../mobx/project'
import { mainStyles } from '../../../../styles'
import { observer } from 'mobx-react-lite'

export default function _MySelect() {
  return (
    <FormControl required sx={{ marginBottom: '10px', minWidth: '100%' }}>
      <Select
        value={ProjectStore.coverImg.name}
        onChange={(e) => {
          ProjectStore.setCoverImgByName(e.target.value)
        }}
        sx={mainStyles.select}
        displayEmpty
        renderValue={(value) => (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <img
                src={ProjectStore.coverImg.url}
                style={{ width: '30px', marginRight: '10px' }}
              />
              {ProjectStore.coverImg.name}
            </Box>
          </Box>
        )}
      >
        {ProjectStore.generatedImgs.map((item, index) => (
          <MenuItem
            value={item.name}
            sx={{ color: 'secondary.main' }}
            key={item.uuid}
          >
            <img
              src={item.url}
              style={{ width: '30px', marginRight: '10px' }}
              key={item.uuid}
            />
            {`${item.name.slice(0, 24)}${item.name.length > 24 ? '...' : ''}`}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

const MySelect = observer(_MySelect)
