import { request } from '../request'
import { LoginReqData, LoginResData, LoginRes } from '../../types/user/login'

export async function login(data: LoginReqData): Promise<LoginRes> {
  const res = await request<LoginResData>({
    method: 'POST',
    data,
    url: '/v1/session'
  })

  return res
}
