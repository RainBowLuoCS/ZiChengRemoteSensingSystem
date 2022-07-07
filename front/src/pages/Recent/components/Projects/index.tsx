import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import SvgIcon from '../../../../components/SvgIcon'
import projectCover from '../../../../assets/imgs/projectCover.png'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { projectStyles } from './styles'
import { getRecentProjects } from '../../../../network/project/getRecentProjects'
import { searchProjects } from '../../../../network/project/searchProjects'
import { moveToBin } from '../../../../network/project/moveToBin'
import { getToken } from '../../../../utils/token'
import { ProjectStore } from '../../../../mobx/project'
import { useParams } from '../../../../hooks/useParams'
import { Project as ProjectType } from '../../../../types/project/Project'

function Project() {
  const navigate = useNavigate()
  const [recentProjects, setRecentProjects] = useState<ProjectType[]>([])
  const keyword = useParams('keyword')
  const breakPoint = useMediaQuery('(min-width:1000px)')
  let token = getToken()

  useEffect(() => {
    token = getToken()

    if (!keyword) {
      getRecentProjects().then((res) => {
        setRecentProjects(res.data.projects)
      })
    } else {
      searchProjects(keyword).then((res) => {
        setRecentProjects(res.data.projects)
      })
    }
  }, [token, keyword])

  async function clickToMove(id: string) {
    if (confirm('确定要将该项目移动至回收站吗?')) {
      const res = await moveToBin(id)
      if (res.code === 0) {
        getRecentProjects().then((res) => {
          setRecentProjects(res.data.projects)
        })
      }
    }
  }

  return (
    <Box
      sx={projectStyles.wrapper}
      style={{
        marginTop: breakPoint ? '5rem' : '50px'
      }}
    >
      {recentProjects?.slice(0, 8).map((item) => (
        <Box key={item.id} sx={{ position: 'relative' }}>
          <Box
            sx={{
              width: breakPoint ? '18rem' : '180px',
              height: breakPoint ? '18rem' : '180px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',

              '&:hover + .mask': {
                display: 'flex!important'
              },
              '& + .mask:hover': {
                display: 'flex!important'
              },
              '& img': {
                width: breakPoint ? '11rem' : '110px',
                borderRadius: '1rem'
              }
            }}
          >
            <img src={projectCover} />
            <Typography sx={projectStyles.bottom}>{item.name}</Typography>
          </Box>
          <Box
            className="mask"
            sx={projectStyles.mask}
            style={{
              width: breakPoint ? '18rem' : '180px',
              height: breakPoint ? '18rem' : '180px',
              borderRadius: breakPoint ? '1rem' : '10px'
            }}
          >
            <Typography color={'secondary.main'} fontSize={'1rem'}>
              最近编辑于
            </Typography>
            <Typography color={'secondary.main'} fontSize={'1rem'}>
              {item.lastVisit}
            </Typography>
            <Box
              sx={projectStyles.middle}
              mt={'1rem'}
              mb={'1rem'}
              onClick={() => {
                ProjectStore.setProjectName(item.name)
                navigate(`/change-detection?id=${item.id}`)
              }}
            >
              <SvgIcon name="open" />
              <Typography
                color={'000'}
                fontSize={'1rem'}
                fontWeight={600}
                ml={'0.5rem'}
              >
                打开项目
              </Typography>
            </Box>
            <Box
              sx={projectStyles.middle}
              onClick={() => {
                clickToMove(item.id.toString())
              }}
            >
              <SvgIcon name="delete" />
              <Typography
                color={'000'}
                fontSize={'1rem'}
                fontWeight={600}
                ml={'0.5rem'}
              >
                删除项目
              </Typography>
            </Box>
            <Typography sx={projectStyles.bottom}>{item.name}</Typography>
          </Box>
        </Box>
      ))}
    </Box>
  )
}

export default Project
