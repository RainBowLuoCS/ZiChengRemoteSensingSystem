import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import useMediaQuery from '@mui/material/useMediaQuery'
import { checkLogin } from '../../../../utils/checkLogin'
import { functionsStyles } from './styles'
import { functionItems } from './consts/functionItems'
import { useNavigate } from 'react-router-dom'
import { createProject } from '../../../../network/project/createProject'
import { ProjectStore } from '../../../../mobx/project'

type Props = {
  name: string
  id?: number
}

function Functions(props: Props) {
  const navigate = useNavigate()
  const breakPoint = useMediaQuery('(min-width:1000px)')
  const { name, id } = props

  async function clickFunctionItem(name: string, route: string) {
    const res = await checkLogin()
    if (!res) {
      return alert('请先登录')
    }
    // 在项目创建之前点击，则新建未命名项目
    if (name === '') {
      createProject({ name: '未命名项目' }).then((res) => {
        ProjectStore.setProjectName('未命名项目')
        navigate(`${route}?id=${res.data.projectID}`)
      })
      return
    }
    // 在项目创建之后点击，需要带上该项目的id
    navigate(`${route}?id=${id}`)
  }

  return (
    <Box
      sx={functionsStyles.wrapper}
      style={{
        padding: breakPoint ? '0 6rem 0 9rem' : '0 60px 0 90px'
      }}
    >
      {functionItems.map((item) => (
        <Box key={item.label}>
          <Card
            sx={functionsStyles.item}
            style={{
              width: breakPoint ? '13rem' : '130px',
              height: breakPoint ? '6rem' : '65px'
            }}
          >
            <CardContent>
              <Container sx={{ display: 'flex', justifyContent: 'center' }}>
                <IconButton
                  aria-label="search"
                  sx={functionsStyles.icon}
                  style={{
                    width: breakPoint ? '2.5rem' : '30px',
                    height: breakPoint ? '2.5rem' : '30px'
                  }}
                >
                  {item.icon}
                </IconButton>
              </Container>
              <Typography
                fontSize={breakPoint ? '1.2rem' : '13px'}
                color={'secondary'}
                fontWeight={300}
              >
                {item.label}
              </Typography>
            </CardContent>
          </Card>
          <Card
            sx={functionsStyles.hoverItem}
            style={{
              width: breakPoint ? '13rem' : '130px',
              height: breakPoint ? '14rem' : '140px',
              borderRadius: breakPoint ? '1rem' : '12px',
              bottom: breakPoint ? '1rem' : '12px'
            }}
            onClick={() => clickFunctionItem(name, item.route)}
          >
            <CardContent>
              <Container sx={{ display: 'flex', justifyContent: 'center' }}>
                <IconButton
                  aria-label="search"
                  sx={functionsStyles.icon}
                  style={{
                    width: breakPoint ? '2.5rem' : '30px',
                    height: breakPoint ? '2.5rem' : '30px'
                  }}
                >
                  {item.icon}
                </IconButton>
              </Container>
              <Typography
                fontSize={'1.2rem'}
                color={'secondary'}
                fontWeight={300}
                textAlign="center"
                mb={'0.5rem'}
              >
                {item.label}
              </Typography>
              <Typography fontSize={'0.9rem'} color={'#000'} fontWeight={300}>
                {item.descripion}
              </Typography>
            </CardContent>
          </Card>
          {/* <div className="mask"></div> */}
        </Box>
      ))}
    </Box>
  )
}

export default Functions
