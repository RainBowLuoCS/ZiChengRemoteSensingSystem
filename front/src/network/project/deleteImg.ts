import { request } from '../request'
import {
  DeleteImgReqData,
  DeleteImgResData,
  DeleteImgRes
} from '../../types/project/ImgAndGroup'

export async function deleteImg(data: DeleteImgReqData): Promise<DeleteImgRes> {
  const res = await request<DeleteImgResData>({
    method: 'DELETE',
    data,
    url: '/v1/project/picture'
  })

  return res
}
