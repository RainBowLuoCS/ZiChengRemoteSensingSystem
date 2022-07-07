import { request } from '../request'
import { GetRecentRes, GetRecentResData } from '../../types/project/Project'

export async function getRecentProjects(): Promise<GetRecentRes> {
  const res = await request<GetRecentResData>({
    method: 'GET',
    url: '/v1/project'
  })

  return res
}
