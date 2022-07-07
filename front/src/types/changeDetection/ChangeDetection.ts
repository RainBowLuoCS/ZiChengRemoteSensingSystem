import { HttpRes } from '../HttpRes'

export type PostDetectReqData = {
  projectID: number
  oldUUID: string
  newUUID: string
  targetUUID: string
  targetName: string
}

export type PostDetectResData = {
  url: string
  name: string
}

export type PostDetectRes = HttpRes<PostDetectResData>
