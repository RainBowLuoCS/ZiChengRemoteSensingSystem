import { HttpRes } from '../HttpRes'
import { ObjectType } from '../objectDetection/ObjectType'
import { BoxType } from '../objectDetection/BoxType'

export type Img = {
  uuid: string
  url: string
  name: string
  // 控制图层的显示与隐藏
  isShown?: boolean
  // 用于平面视角
  groupID?: number
  groupShown?: boolean
}

export type Info = {
  // 目标提取
  colors: number[]
} & {
  // 地物分类
  colors: number[]
  nums: number[]
} & {
  // 变化检测
  num: number
  colors: number[]
} & {
  // 目标检测
  type: ObjectType
  w: number
  h: number
  boxs: BoxType
}

export type Group = {
  groupID: number
  groupName: string
  groupType: 1 | 2 | 3 | 4 | 5
  info: Info
  pictures: Img[]
  // 控制图层的显示与隐藏
  isShown?: boolean
}

export type WaitingGroup = {
  id: number
  oldImg: Img
  newImg: Img
}

// 删除图片
export type DeleteImgReqData = {
  projectID: number
  // uuid 数组
  pictures: string[]
}
export type DeleteImgResData = {}
export type DeleteImgRes = HttpRes<DeleteImgResData>

// 删除组
export type DeleteGroupReqData = {
  projectID: number
  groupID: number
}
export type DeleteGroupResData = {}
export type DeleteGroupRes = HttpRes<DeleteImgResData>

// 获得当前项目的组和图片
export type GetUpdatedResData = {
  groups: Group[]
  pictures: Img[]
}
export type GetUpdatedRes = HttpRes<GetUpdatedResData>

// 上传图片
export type UploadImgReqData = FormData
export type UploadImgResData = {}
export type UploadImgRes = HttpRes<UploadImgResData>

// 修改图片名称
export type UpdateImgNameReqData = {
  projectID: number
  uuid: string
  name: string
}
export type UpdateImgNameResData = {}
export type UpdateImgNameRes = HttpRes<UpdateImgNameResData>

// 修改组名称
export type UpdateGroupNameReqData = {
  projectID: number
  groupID: number
  name: string
}
export type UpdateGroupNameResData = {}
export type UpdateGroupNameRes = HttpRes<UpdateGroupNameResData>
