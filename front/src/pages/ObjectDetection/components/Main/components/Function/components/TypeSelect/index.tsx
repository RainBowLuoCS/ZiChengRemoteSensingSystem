import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { mainStyles } from '../../../../styles'
import { selectItems } from './consts/selectItems'
import { ObjectType } from '../../../../../../../../types/objectDetection/ObjectType'

type Props = {
  objectType: ObjectType
  setObjectType: (val: ObjectType) => void
}

function _TypeSelect(props: Props) {
  const { objectType, setObjectType } = props
  const [selectValue, setSelectValue] = useState('')

  return (
    <FormControl required sx={{ marginBottom: '10px', minWidth: '100%' }}>
      <Select
        value={selectValue}
        onChange={(e) => {
          let value = e.target.value
          switch (e.target.value) {
            case '操场':
              setObjectType('playground')
              break
            case '立交桥':
              setObjectType('overpass')
              break
            case '飞机':
              setObjectType('aircraft')
              break
            default:
              setObjectType('oiltank')
          }
          setSelectValue(value)
        }}
        sx={mainStyles.select}
        displayEmpty
      >
        <MenuItem value="" disabled>
          <span style={{ color: '#ADADA8' }}>请选择将要检测的对象类型</span>
        </MenuItem>
        {selectItems.map((item, index) => (
          <MenuItem value={item.label} sx={mainStyles.selectItem} key={item.id}>
            {item.icon}
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

const TypeSelect = observer(_TypeSelect)

export default TypeSelect
