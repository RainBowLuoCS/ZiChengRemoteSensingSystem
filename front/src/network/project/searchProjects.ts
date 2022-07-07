import { request } from '../request'
import { GetRecentRes, GetRecentResData } from '../../types/project/Project'

export async function searchProjects(keyword: string): Promise<GetRecentRes> {
  const res = await request<GetRecentResData>({
    method: 'GET',
    url: `/v1/project?keyword=${keyword}`
  })

  return res
}

export async function searchProjectsInBin(
  keyword: string
): Promise<GetRecentRes> {
  const res = await request<GetRecentResData>({
    method: 'GET',
    url: `/v1/project/recycle?keyword=${keyword}`
  })

  return res
}
