export type HttpRes<T = unknown> = {
  // 状态码
  code: number
  // 信息
  msg: string
  // 数据
  data: T
}
