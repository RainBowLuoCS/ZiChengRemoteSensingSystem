// 判断用户是否已登录
import { getUserData } from '../network/user/getUserData'

export async function checkLogin(): Promise<boolean> {
  const res = await getUserData()
  if (res.code === 2000) return false
  return true
}
