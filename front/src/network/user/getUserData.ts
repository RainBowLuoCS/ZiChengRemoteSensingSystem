import { request } from '../request'
import { GetUserDataResData, GetUserDataRes } from '../../types/user/user'

export async function getUserData(): Promise<GetUserDataRes> {
  const res = await request<GetUserDataResData>({
    method: 'GET',
    url: '/v1/user'
  })

  return res
}
