import Box from '@mui/material/Box'
import SvgIcon from '../../../SvgIcon'
import ListItem from '@mui/material/ListItem'
import Item from './components/Item'
import Divider from '@mui/material/Divider'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { toolBarStyles } from '../../styles'
import { ProjectStore } from '../../../../mobx/project'
import { deleteGroup } from '../../../../network/project/deleteGroup'
import { updateGroupName } from '../../../../network/project/updateGroupName'
import { getUpdatedImgs } from '../../../../network/project/getUpdatedImgs'
import { Img, Group as ImgGroup } from '../../../../types/project/ImgAndGroup'
import { useShowDropDown } from '../../hooks/useShowDropdown'
import { useParams } from '../../../../hooks/useParams'

type Props = {
  group: ImgGroup
}

function _Group(props: Props) {
  const { group } = props
  const [isClosed, setIsClosed] = useState(true)
  const { showDropDown, setShowDropDown } = useShowDropDown()
  const { pathname } = useLocation()
  const projectID = useParams('id') as string
  // 当前组是否有效
  const [isValid, setIsValid] = useState(
    (pathname === '/analysis' && group.groupType === 1) ||
      (pathname === '/change-detection' && group.groupType === 5) ||
      (pathname === '/terrain-classification' && group.groupType === 3) ||
      (pathname === '/object-extract' && group.groupType === 2) ||
      (pathname === '/object-detection' && group.groupType === 4)
  )
  const [isEdited, setIsEdited] = useState(false)
  const [groupName, setGroupName] = useState('')

  async function clickToDeleteGroup() {
    const reqData = {
      projectID: parseInt(projectID),
      groupID: group.groupID
    }
    if (confirm('确定要删除该组吗?')) {
      setShowDropDown(false)
      const res = await deleteGroup(reqData)
      if (res.code === 0) {
        getUpdatedImgs(projectID).then((res) => {
          const data = res.data
          ProjectStore.updateImgGroup(data.groups)
          ProjectStore.setShowPerspective(false)
          ProjectStore.setDisplayType(0)
        })
      }
    }
  }

  return (
    <Box
      sx={{
        marginBottom: '20px',
        position: 'relative',
        display: isValid ? 'block' : 'none'
      }}
    >
      <ListItem
        sx={toolBarStyles.listParent}
        onClick={() => {
          if (isValid && ProjectStore.displayType === 0) {
            ProjectStore.setShowPerspective(true)
            ProjectStore.setShowDetail(false)

            ProjectStore.updateCurShownGroup(group.groupID)
            ProjectStore.setCoverImg(ProjectStore.currentShownGroup.pictures[0])
            ProjectStore.hideAllGroups()
            ProjectStore.setGroupDisplayStatus(group.groupID, true)
          }
        }}
        style={{
          cursor: ProjectStore.displayType === 0 ? 'cursor' : 'default'
        }}
      >
        {ProjectStore.displayType === 1 ? (
          <div
            onClick={() => {
              ProjectStore.setGroupDisplayStatus(group.groupID)
            }}
          >
            {!group.isShown ? (
              <SvgIcon name="eye_hidden" class="toolbar" />
            ) : (
              <SvgIcon name="eye" class="toolbar" />
            )}
          </div>
        ) : (
          ''
        )}
        <SvgIcon name="folder" class="toolbar folder" />
        <div
          style={{
            width: ProjectStore.displayType === 0 ? '120px' : '85px',
            height: '40px',
            lineHeight: '40px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: isEdited ? 'none' : 'block'
          }}
        >
          {group.groupName}
        </div>

        {isEdited && (
          <input
            type="text"
            style={{
              width: ProjectStore.displayType === 0 ? '115px' : '85px',
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
              setGroupName(e.target.value)
            }}
            onBlur={() => {
              setIsEdited(false)
            }}
            onKeyDown={(e) => {
              if (e.nativeEvent.key === 'Enter') {
                setShowDropDown(false)
                const reqData = {
                  projectID: parseInt(projectID),
                  groupID: group.groupID,
                  name: groupName
                }
                updateGroupName(reqData).then((res) => {
                  getUpdatedImgs(projectID).then((res) => {
                    ProjectStore.updateImgGroup(res.data.groups)

                    ProjectStore.setShowPerspective(false)
                    ProjectStore.setDisplayType(0)
                    setIsEdited(false)
                  })
                })
              }
            }}
            onClick={(e) => e.stopPropagation()}
          />
        )}
        <div
          onClick={(e) => {
            setIsClosed(!isClosed)
            e.stopPropagation()
          }}
        >
          <SvgIcon name={isClosed ? 'down' : 'up'} class="toolbar up_down" />
        </div>
        <div
          onClick={(e) => {
            setShowDropDown(!showDropDown)
            e.stopPropagation()
          }}
        >
          <SvgIcon name="more" class="toolbar right" />
        </div>
      </ListItem>
      <Box
        sx={toolBarStyles.dropDown}
        onClick={(e) => e.stopPropagation()}
        style={{ display: showDropDown ? 'block' : 'none', top: '50px' }}
      >
        <ListItem
          sx={toolBarStyles.dropDownItem}
          onClick={() => {
            setIsEdited(true)
          }}
        >
          <SvgIcon name="rename" class="toolbar dropdown" />
          重命名
        </ListItem>
        <Divider color="secondary" variant="middle" />
        <ListItem
          sx={toolBarStyles.dropDownItem}
          onClick={() => {
            clickToDeleteGroup()
          }}
        >
          <SvgIcon name="tb_bin" class="toolbar dropdown" />
          移除
        </ListItem>
      </Box>

      <Box
        sx={toolBarStyles.listGroup}
        style={{ display: isClosed ? 'none' : 'block' }}
      >
        {group.pictures.map((item: Img, index) => (
          // 嵌套li会有warning，暂时不理会
          <Item item={item} key={item.uuid + index} groupID={group.groupID} />
        ))}
      </Box>
    </Box>
  )
}

const Group = observer(_Group)

export default Group
