// 彻底删除项目
import { request } from '../request'
import {
  DeleteProjectRes,
  DeleteProjectResData
} from '../../types/project/Project'

export async function deleteProject(id: string): Promise<DeleteProjectRes> {
  const res = await request<DeleteProjectResData>({
    method: 'DELETE',
    url: `/v1/project/${id}`
  })

  return res
}
