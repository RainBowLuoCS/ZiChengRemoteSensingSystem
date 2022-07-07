import Box from '@mui/material/Box'
import ListItem from '@mui/material/ListItem'
import Divider from '@mui/material/Divider'
import SvgIcon from '../../../SvgIcon'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { toolBarStyles } from '../../styles'
import { ProjectStore } from '../../../../mobx/project'
import { deleteImg } from '../../../../network/project/deleteImg'
import { getUpdatedImgs } from '../../../../network/project/getUpdatedImgs'
import { updateImgName } from '../../../../network/project/updateImgName'
import { Img } from '../../../../types/project/ImgAndGroup'
import { useShowDropDown } from '../../hooks/useShowDropdown'
import { useParams } from '../../../../hooks/useParams'

type Props = {
  item: Img
}

function _Item(props: Props) {
  const { item } = props
  const { showDropDown, setShowDropDown } = useShowDropDown()
  const projectID = useParams('id') as string
  const [isEdited, setIsEdited] = useState(false)
  const [imgName, setImgName] = useState('')

  async function clickToDeleteImg(uuid: string) {
    const reqData = {
      projectID: parseInt(projectID),
      pictures: [uuid]
    }
    if (window.confirm('确定要删除该图片吗?')) {
      setShowDropDown(false)
      const res = await deleteImg(reqData)
      if (res.code === 0) {
        getUpdatedImgs(projectID).then((res) => {
          const data = res.data
          ProjectStore.updateImgs(data.pictures)
          ProjectStore.setShowPerspective(false)
          ProjectStore.setDisplayType(0)
        })
      }
    }
  }

  return (
    <ListItem key={item.uuid} sx={toolBarStyles.listItem}>
      <div
        style={{
          width: '170px',
          height: '40px',
          lineHeight: '40px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          display: isEdited ? 'none' : 'block'
        }}
      >
        {!isEdited && item.name}
      </div>
      {isEdited && (
        <input
          type="text"
          style={{
            width: '160px',
            height: '100%',
            padding: '0',
            outline: 'none',
            border: 'none',
            backgroundColor: '#313131',
            color: '#fcfbf4',
            fontSize: '15px'
          }}
          maxLength={20}
          onChange={(e) => {
            setImgName(e.target.value)
          }}
          onBlur={() => {
            setIsEdited(false)
          }}
          onKeyDown={(e) => {
            if (e.nativeEvent.key === 'Enter') {
              setShowDropDown(false)
              const reqData = {
                projectID: parseInt(projectID),
                uuid: item.uuid,
                name: imgName
              }
              updateImgName(reqData).then((res) => {
                getUpdatedImgs(projectID).then((res) => {
                  ProjectStore.updateImgs(res.data.pictures)
                  ProjectStore.updateImgGroup(res.data.groups)

                  ProjectStore.setShowPerspective(false)
                  ProjectStore.setDisplayType(0)
                  setIsEdited(false)
                })
              })
            }
          }}
        />
      )}

      <div
        onClick={(e) => {
          setShowDropDown(!showDropDown)
          e.stopPropagation()
        }}
      >
        <SvgIcon name="more" class="toolbar right" />
      </div>
      <Box
        sx={toolBarStyles.dropDown}
        onClick={(e) => e.stopPropagation()}
        style={{ display: showDropDown ? 'block' : 'none' }}
      >
        <Box
          sx={toolBarStyles.dropDownItem}
          onClick={() => {
            setIsEdited(true)
          }}
        >
          <SvgIcon name="rename" class="toolbar dropdown" />
          重命名
        </Box>
        <Divider color="secondary" variant="middle" />
        <Box
          sx={toolBarStyles.dropDownItem}
          onClick={() => {
            clickToDeleteImg(item.uuid)
          }}
        >
          <SvgIcon name="tb_bin" class="toolbar dropdown" />
          移除
        </Box>
      </Box>
    </ListItem>
  )
}

const Item = observer(_Item)

export default Item
