import Box from '@mui/material/Box'
import { loadingStyles } from './styles'

export default function Loading() {
  return (
    // 最外层圆 - 内层圆 - 旋转的扇形
    <Box sx={loadingStyles.loading}>
      <Box sx={loadingStyles.loading.inner}>正在分析中</Box>
      <Box sx={loadingStyles.loading.rotate}></Box>
    </Box>
  )
}
