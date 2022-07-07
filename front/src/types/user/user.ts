import { HttpRes } from '../HttpRes'

export type User = {
  name: string
  avatarURL: string
}

export type GetUserDataResData = User

export type GetUserDataRes = HttpRes<GetUserDataResData>
