import { request } from '../request'
import {
  RegisterReqData,
  RegisterRes,
  RegisterResData
} from '../../types/user/register'

export async function register(data: RegisterReqData): Promise<RegisterRes> {
  const resData = await request<RegisterResData>({
    method: 'POST',
    data,
    url: '/v1/user'
  })

  return resData
}
