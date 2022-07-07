import { request } from '../request'
import {
  UpdateGroupNameReqData,
  UpdateGroupNameRes,
  UpdateGroupNameResData
} from '../../types/project/ImgAndGroup'

export async function updateGroupName(
  data: UpdateGroupNameReqData
): Promise<UpdateGroupNameRes> {
  const res = await request<UpdateGroupNameResData>({
    method: 'POST',
    data,
    url: `/v1/project/group/name`
  })
  return res
}
