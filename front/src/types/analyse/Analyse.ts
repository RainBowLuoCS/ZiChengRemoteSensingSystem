import { HttpRes } from '../HttpRes'
import { Img } from '../project/ImgAndGroup'

export type AnalyseReqData = {
  projectID: number
  originUUID: string
}

export type AnalyseResData = {
  oa: Img
  // fix
  gs: Img
  od: Img
  cd: [Img, Img][]
}

export type AnalyseRes = HttpRes<AnalyseReqData>
