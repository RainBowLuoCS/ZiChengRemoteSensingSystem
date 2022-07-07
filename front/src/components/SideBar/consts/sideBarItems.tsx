import SvgIcon from '../../SvgIcon'

export const sideBarItems = [
  {
    id: 1,
    icon: <SvgIcon name="综合分析台" />,
    label: '综合分析台',
    route: '/analysis'
  },
  {
    id: 2,
    icon: <SvgIcon name="变化检测" />,
    label: '变化检测',
    route: '/change-detection'
  },
  {
    id: 3,
    icon: <SvgIcon name="地物分类" />,
    label: '地物分类',
    route: '/terrain-classification'
  },
  {
    id: 4,
    icon: <SvgIcon name="目标提取" />,
    label: '目标提取',
    route: '/object-extract'
  },
  {
    id: 5,
    icon: <SvgIcon name="目标检测" />,
    label: '目标检测',
    route: '/object-detection'
  }
]
