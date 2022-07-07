import { request } from '../request'
import {
  UpdateImgNameReqData,
  UpdateImgNameRes,
  UpdateImgNameResData
} from '../../types/project/ImgAndGroup'

export async function updateImgName(
  data: UpdateImgNameReqData
): Promise<UpdateImgNameRes> {
  const res = await request<UpdateImgNameResData>({
    method: 'POST',
    data,
    url: `/v1/project/picture/name`
  })
  return res
}
