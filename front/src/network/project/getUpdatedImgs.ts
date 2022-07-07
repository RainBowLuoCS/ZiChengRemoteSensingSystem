import { request } from '../request'
import {
  GetUpdatedResData,
  GetUpdatedRes
} from '../../types/project/ImgAndGroup'

export async function getUpdatedImgs(id: string): Promise<GetUpdatedRes> {
  const res = await request<GetUpdatedResData>({
    method: 'GET',
    url: `/v1/project/${id}`
  })

  return res
}
