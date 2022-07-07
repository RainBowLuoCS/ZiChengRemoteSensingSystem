import { request } from '../request'
import {
  PostSortReqData,
  PostSortResData,
  PostSortRes
} from '../../types/terrainClassification/TerrainClassification'

export async function postExtractReq(
  data: PostSortReqData
): Promise<PostSortRes> {
  const res = await request<PostSortResData>({
    method: 'POST',
    data,
    url: '/v1/project/picture/oa'
  })

  return res
}
