import axios, {
  AxiosRequestHeaders,
  AxiosRequestConfig,
  AxiosResponse
} from 'axios'
import { HttpRes } from '../types/HttpRes'
import { BE_DOMAIN } from '../consts/domain'
import { getToken } from '../utils/token'

// 记录对哪些url的请求正在进行中, 若上一次请求未完成则不进行下一次请求
const requestSet = new Set<string>()

export async function request<T>(config: AxiosRequestConfig) {
  // 判断两个请求是否完全相同的 key
  // 后置! 使null和undefined类型可以赋值给其他类型并通过编译，表示该变量值可空
  const key =
    JSON.stringify(config.data) + config.url! + JSON.stringify(config.params)

  // 根据指定配置创建一个新的 axios
  const instance = axios.create({
    baseURL: BE_DOMAIN,
    timeout: 60000
  })

  // 添加请求拦截器
  instance.interceptors.request.use(
    // 在发送请求之前做些什么
    (config) => {
      const token = getToken()
      if (token) (config.headers as AxiosRequestHeaders).Authorization = token
      return config
    },
    // 对请求错误做些什么
    (err) => {
      console.error(err)
      return err
    }
  )

  return new Promise<HttpRes<T>>((resolve, reject) => {
    instance(config)
      .then((res: AxiosResponse<HttpRes<T>>) => {
        resolve(res.data)
      })
      .finally(() => {
        requestSet.delete(key)
      })
  })
}
