import { request } from '../request'
import {
  PostDetectReqData,
  PostDetectRes,
  PostDetectResData
} from '../../types/objectDetection/ObjectDetection'

export async function postDetectReq(
  data: PostDetectReqData
): Promise<PostDetectRes> {
  const res = await request<PostDetectResData>({
    method: 'POST',
    data,
    url: '/v1/project/picture/od'
  })

  return res
}
