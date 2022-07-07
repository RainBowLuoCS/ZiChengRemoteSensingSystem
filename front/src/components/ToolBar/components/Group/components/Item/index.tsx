import Box from '@mui/material/Box'
import ListItem from '@mui/material/ListItem'
import Divider from '@mui/material/Divider'
import SvgIcon from '../../../../../SvgIcon'
import { toolBarStyles } from '../../../../styles'
import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { ProjectStore } from '../../../../../../mobx/project'
import { Img } from '../../../../../../types/project/ImgAndGroup'
import { useShowDropDown } from '../../../../hooks/useShowDropdown'
import { getUpdatedImgs } from '../../../../../../network/project/getUpdatedImgs'
import { updateImgName } from '../../../../../../network/project/updateImgName'
import { deleteImg } from '../../../../../../network/project/deleteImg'
import { useParams } from '../../../../../../hooks/useParams'

type Props = {
  item: Img
  groupID: number
}

function _Item(props: Props) {
  const { item, groupID } = props
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
    <ListItem
      key={item.uuid}
      style={{
        backgroundColor:
          item.groupID === ProjectStore.coverImg.groupID &&
          item.uuid === ProjectStore.coverImg.uuid &&
          ProjectStore.displayType === 1
            ? '#0F4A4E'
            : '#313131'
      }}
      sx={toolBarStyles.listItemInGroup}
    >
      <Box
        onClick={() => {
          ProjectStore.setLayerDisplayStatus(groupID, item.uuid)
        }}
      >
        {ProjectStore.displayType === 1 ? (
          item.isShown ? (
            <SvgIcon name="eye" class="toolbar" />
          ) : (
            <SvgIcon name="eye_hidden" class="toolbar" />
          )
        ) : (
          ''
        )}
      </Box>
      <div
        style={{
          width: ProjectStore.displayType === 0 ? '150px' : '120px',
          height: '40px',
          lineHeight: '40px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          display: isEdited ? 'none' : 'block'
        }}
      >
        {item.name}
      </div>
      {isEdited && (
        <input
          type="text"
          style={{
            width: ProjectStore.displayType === 0 ? '145px' : '110px',
            height: '100%',
            padding: '0',
            outline: 'none',
            border: 'none',
            backgroundColor:
              item.groupID === ProjectStore.coverImg.groupID &&
              item.uuid === ProjectStore.coverImg.uuid &&
              ProjectStore.displayType === 1
                ? '#0F4A4E'
                : '#313131',
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
        style={{ display: showDropDown ? 'block' : 'none', top: '40px' }}
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
