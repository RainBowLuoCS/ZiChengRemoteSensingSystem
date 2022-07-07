import { request } from '../request'
import {
  AnalyseReqData,
  AnalyseResData,
  AnalyseRes
} from '../../types/analyse/Analyse'

export async function postAnalyseReq(
  data: AnalyseReqData
): Promise<AnalyseRes> {
  const res = await request<AnalyseResData>({
    method: 'POST',
    data,
    url: '/v1/project/picture/overall'
  })

  /*@ts-ignore*/
  return res
}
