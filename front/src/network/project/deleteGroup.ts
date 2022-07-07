import { request } from '../request'
import {
  DeleteGroupReqData,
  DeleteGroupResData,
  DeleteGroupRes
} from '../../types/project/ImgAndGroup'

export async function deleteGroup(
  data: DeleteGroupReqData
): Promise<DeleteGroupRes> {
  const res = await request<DeleteGroupResData>({
    method: 'DELETE',
    data,
    url: '/v1/project/group'
  })

  return res
}
