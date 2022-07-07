import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { ProjectStore } from '../../../../../../../../mobx/project'
import { mainStyles } from '../../../../styles'
import { observer } from 'mobx-react-lite'

function _MySelect() {
  return (
    <FormControl required sx={{ marginBottom: '10px', minWidth: '100%' }}>
      <Select
        multiple
        value={ProjectStore.imgNameArr}
        onChange={(e) => {
          ProjectStore.updateImgNameArr(e.target.value as string[])
        }}
        sx={mainStyles.select}
        displayEmpty
        renderValue={(value) => (
          <Box>
            {ProjectStore.imgNameArr.length === 0 && (
              <span style={{ color: '#ADADA8' }}>请选择将要分析的图片</span>
            )}
            {ProjectStore.singleWaitingGroups.map((item) => (
              <Box
                sx={{ display: 'flex', alignItems: 'center' }}
                key={item.uuid}
              >
                <img
                  src={item.url}
                  style={{ width: '30px', marginRight: '10px' }}
                />
                {item.name}
              </Box>
            ))}
          </Box>
        )}
      >
        {ProjectStore.imgs.map((item, index) => (
          <MenuItem
            value={item.name}
            sx={mainStyles.selectItem}
            // 这里key用item.uuid会冲突
            key={index}
          >
            <img
              src={item.url}
              style={{ width: '30px', marginRight: '10px' }}
            />
            {`${item.name.slice(0, 24)}${item.name.length > 24 ? '...' : ''}`}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

const MySelect = observer(_MySelect)

export default MySelect
