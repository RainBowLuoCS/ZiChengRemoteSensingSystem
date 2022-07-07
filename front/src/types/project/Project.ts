import { HttpRes } from '../HttpRes'

export type Project = {
  id: number
  name: string
  lastVisit: string
  coverURL: string
}

// 创建项目
export type CreateProjectReqData = {
  name: string
}
export type CreateProjectResData = {
  projectID: number
}
export type CreateProjectRes = HttpRes<CreateProjectResData>

// 移动项目至回收站
export type MoveToBinResData = {}
export type MoveToBinRes = HttpRes<MoveToBinResData>

// 彻底删除项目
export type DeleteProjectResData = {}
export type DeleteProjectRes = HttpRes<DeleteProjectResData>

// 获得最近项目
export type GetRecentResData = {
  projects: Project[]
}
export type GetRecentRes = HttpRes<GetRecentResData>

// 获得回收站项目
export type GetBinResData = {
  projects: Project[]
}
export type GetBinRes = HttpRes<GetRecentResData>
