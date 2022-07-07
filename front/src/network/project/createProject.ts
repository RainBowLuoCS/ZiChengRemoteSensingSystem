import { request } from '../request'
import {
  CreateProjectReqData,
  CreateProjectResData,
  CreateProjectRes
} from '../../types/project/Project'

export async function createProject(
  data: CreateProjectReqData
): Promise<CreateProjectRes> {
  const res = await request<CreateProjectResData>({
    method: 'POST',
    data,
    url: '/v1/project'
  })

  return res
}
