import { HttpRes } from '../HttpRes'
import { ObjectType as _ObjectType } from './ObjectType'
import { BoxType } from './BoxType'

type ObjectType = Exclude<_ObjectType, ''>

export type PostDetectReqData = {
  projectID: number
  type: ObjectType
  originUUID: string
  targetUUID: string
  targetName: string
}

export type PostDetectResData = {
  url: string
  name: string
  boxs: BoxType
}

export type PostDetectRes = HttpRes<PostDetectResData>
