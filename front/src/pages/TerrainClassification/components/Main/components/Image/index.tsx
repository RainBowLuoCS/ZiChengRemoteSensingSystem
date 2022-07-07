import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import SvgIcon from '../../../../../../components/SvgIcon'
import useMediaQuery from '@mui/material/useMediaQuery'
import { ProjectStore } from '../../../../../../mobx/project'
import { HeightStore } from '../../../../../../mobx/height'
import { mainStyles } from '../../styles'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'

function _Image() {
  const breakPoint = useMediaQuery('(min-width:1000px)')

  useEffect(() => {
    const firstGroup = ProjectStore.waitingGroups[0]
    if (firstGroup.oldImg.uuid !== '' || firstGroup.newImg.uuid !== '') {
      ProjectStore.updateChosenImgs([
        ProjectStore.waitingGroups[0].oldImg,
        ProjectStore.waitingGroups[0].newImg
      ])
    }
  }, [JSON.stringify(ProjectStore.waitingGroups)])

  return (
    <Box
      sx={mainStyles.image}
      style={{ height: HeightStore.bodyHeight - 115 + 'px' }}
    >
      {ProjectStore.singleWaitingGroups.length &&
      ProjectStore.singleWaitingGroups[0].uuid !== '' ? (
        <img src={ProjectStore.singleWaitingGroups[0].url} />
      ) : (
        <Box sx={mainStyles.placeholder}>
          <SvgIcon name="not_upload" />
          <Typography
            color="#fff"
            fontSize={breakPoint ? '18px' : '16px'}
            width="65%"
            mt={'20px'}
          >
            当前未上传待分析图像，请先在检测区中上传待分析图像
          </Typography>
        </Box>
      )}
    </Box>
  )
}

const Image = observer(_Image)

export default Image
