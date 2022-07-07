import Box from '@mui/material/Box'
import SvgIcon from '../SvgIcon'
import { ProjectStore } from '../../mobx/project'
import { subHeaderStyles } from './styles'
import { observer } from 'mobx-react-lite'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { getRecentProjects } from '../../network/project/getRecentProjects'
import { useParams } from '../../hooks/useParams'
import { Project } from '../../types/project/Project'

function _SubHeader() {
  const navigate = useNavigate()
  const id = useParams('id') as string

  useEffect(() => {
    if (ProjectStore.name === '') {
      getRecentProjects().then((res) => {
        const project = res.data.projects.find(
          (item) => item.id === parseInt(id)
        ) as Project
        ProjectStore.setProjectName(project.name)
      })
    }
  }, [])

  return (
    <Box sx={subHeaderStyles.wrapper}>
      {!ProjectStore.showPerspective ? (
        <Box
          sx={subHeaderStyles.left}
          onClick={() => {
            navigate('/recent')
          }}
        >
          <SvgIcon name="left" class="main header left" />
          回到最近项目
        </Box>
      ) : (
        <Box
          sx={subHeaderStyles.left}
          onClick={() => {
            ProjectStore.setShowPerspective(false)
          }}
        >
          <SvgIcon name="change_rule" class="main header left" />
          更换检测条件
        </Box>
      )}
      <Box>{ProjectStore.name}</Box>
    </Box>
  )
}

const SubHeader = observer(_SubHeader)

export default SubHeader
