import SvgIcon from '../../../../../components/SvgIcon'

export const functionItems = [
  {
    id: 1,
    label: '变化检测',
    route: '/change-detection',
    icon: <SvgIcon name="变化检测" />,
    descripion: '上传一组取样时间不同的同位置图片，AI自动检测输出变化区域'
  },
  {
    id: 2,
    label: '地物分类',
    route: '/terrain-classification',
    icon: <SvgIcon name="地物分类" />,
    descripion: '对输入图片各像素进行分析，区分出从属于不同对象种类的像素'
  },
  {
    id: 3,
    label: '目标提取',
    route: '/object-extract',
    icon: <SvgIcon name="目标提取" />,
    descripion: '对输入图片进行分析，提取目标对象在图片中所在区域'
  },
  {
    id: 4,
    label: '目标检测',
    route: '/object-detection',
    icon: <SvgIcon name="目标检测" />,
    descripion: '对输入图片进行分析，找到目标对象在图片中位置'
  }
]
