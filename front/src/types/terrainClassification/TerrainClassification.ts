import { HttpRes } from '../HttpRes'

export type PostSortReqData = {
  projectID: number
  originUUID: string
  targetUUID: string
  targetName: string
}

export type PostSortResData = {
  url: string
  name: string
}

export type PostSortRes = HttpRes<PostSortResData>
