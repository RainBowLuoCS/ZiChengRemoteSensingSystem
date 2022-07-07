// 将项目移动至回收站
import { request } from '../request'
import { MoveToBinResData, MoveToBinRes } from '../../types/project/Project'

export async function moveToBin(id: string): Promise<MoveToBinRes> {
  const res = await request<MoveToBinResData>({
    method: 'POST',
    url: `/v1/project/${id}/delete`
  })

  return res
}
