import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import SvgIcon from '../../../../components/SvgIcon'
import projectCover from '../../../../assets/imgs/projectCover.png'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useState, useEffect } from 'react'
import { binStyles } from './styles'
import { getToken } from '../../../../utils/token'
import { getBinProjects } from '../../../../network/project/getBinProjects'
import { deleteFromBin } from '../../../../network/project/deleteFromBin'
import { searchProjectsInBin } from '../../../../network/project/searchProjects'
import { moveToRecent } from '../../../../network/project/moveToRecent'
import { useParams } from '../../../../hooks/useParams'
import { Project as ProjectType } from '../../../../types/project/Project'

function Project() {
  const [binProjects, setBinProjects] = useState<ProjectType[]>([])
  const breakPoint = useMediaQuery('(min-width:1000px)')
  const keyword = useParams('keyword')
  let token = getToken()

  useEffect(() => {
    token = getToken()

    if (!keyword) {
      getBinProjects().then((res) => {
        setBinProjects(res.data.projects)
      })
    } else {
      searchProjectsInBin(keyword).then((res) => {
        setBinProjects(res.data.projects)
      })
    }
  }, [token, keyword])

  async function clickToDelete(id: string) {
    if (confirm('确定要将该项目彻底删除吗?')) {
      const res = await deleteFromBin(id)
      if (res.code === 0) {
        getBinProjects().then((res) => {
          setBinProjects(res.data.projects)
        })
      }
    }
  }

  async function clickToRecover(id: string) {
    const res = await moveToRecent(id)
    if (res.code === 0) {
      getBinProjects().then((res) => {
        setBinProjects(res.data.projects)
      })
    }
  }

  return (
    <Box sx={binStyles.wrapper}>
      {binProjects?.slice(0, 8).map((item) => (
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
            <Typography sx={binStyles.bottom}>{item.name}</Typography>
          </Box>
          <Box
            className="mask"
            sx={binStyles.mask}
            style={{
              width: breakPoint ? '18rem' : '180px',
              height: breakPoint ? '18rem' : '180px',
              borderRadius: breakPoint ? '1rem' : '10px'
            }}
          >
            <Box
              sx={binStyles.middle}
              mb={'1rem'}
              onClick={() => {
                clickToRecover(item.id.toString())
              }}
            >
              <SvgIcon name="recover" />
              <Typography fontSize={'1rem'} fontWeight={600} ml={'0.5rem'}>
                恢复项目
              </Typography>
            </Box>
            <Box
              sx={binStyles.middle}
              mb={'1rem'}
              onClick={() => {
                clickToDelete(item.id.toString())
              }}
            >
              <SvgIcon name="delete" />
              <Typography
                color={'000'}
                fontSize={'1rem'}
                fontWeight={600}
                ml={'0.5rem'}
              >
                彻底删除
              </Typography>
            </Box>
            <Typography sx={binStyles.bottom}>{item.name}</Typography>
          </Box>
        </Box>
      ))}
    </Box>
  )
}

export default Project
