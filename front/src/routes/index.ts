/*@ts-ignore*/
import loadable from '@loadable/component'
/*@ts-ignore*/
import { RouteConfig } from 'react-router-config'

const routesConfig: RouteConfig[] = [
  {
    path: '/home',
    exact: true,
    element: loadable(() => import('../pages/Home'))
  },
  {
    path: '/home/create',
    exact: true,
    element: loadable(() => import('../pages/Create'))
  },
  {
    path: '/recent',
    exact: true,
    element: loadable(() => import('../pages/Recent'))
  },
  {
    path: '/bin',
    exact: true,
    element: loadable(() => import('../pages/Bin'))
  },
  {
    path: '/analysis',
    exact: true,
    element: loadable(() => import('../pages/Analysis'))
  },
  {
    path: '/change-detection',
    exact: true,
    element: loadable(() => import('../pages/ChangeDetection'))
  },
  {
    path: '/terrain-classification',
    exact: true,
    element: loadable(() => import('../pages/TerrainClassification'))
  },
  {
    path: '/object-extract',
    exact: true,
    element: loadable(() => import('../pages/ObjectExtract'))
  },
  {
    path: '/object-detection',
    exact: true,
    element: loadable(() => import('../pages/ObjectDetection'))
  }
]

export default routesConfig
