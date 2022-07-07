import { request } from '../request'
import { GetBinRes, GetBinResData } from '../../types/project/Project'

export async function getBinProjects(): Promise<GetBinRes> {
  const res = await request<GetBinResData>({
    method: 'GET',
    url: '/v1/project/recycle'
  })

  return res
}
