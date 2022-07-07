// 暂存localstorage
const TOKEN_KEY = '__remote_sensing_token'

export function setToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  window.localStorage.removeItem(TOKEN_KEY)
}

export function getToken(): string | null {
  const tokenStr = window.localStorage.getItem(TOKEN_KEY)
  if (!tokenStr) return null

  // 如果不parse，token会带引号
  // const token = JSON.parse(tokenStr)

  // return token
  return tokenStr
}
