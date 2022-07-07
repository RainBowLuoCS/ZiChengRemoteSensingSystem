import { request } from '../request'
import {
  UploadImgReqData,
  UploadImgRes,
  UploadImgResData
} from '../../types/project/ImgAndGroup'

export async function uploadFile(
  data: UploadImgReqData
): Promise<UploadImgRes> {
  const res = await request<UploadImgResData>({
    method: 'POST',
    data,
    url: '/v1/project/picture'
  })

  return res
}
