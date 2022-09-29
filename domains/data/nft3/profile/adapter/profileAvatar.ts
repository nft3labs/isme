import * as localStorage from 'app/utils/cache/localStorage'
import { DEFAULT_AVATARS, getFilePath } from 'app/constant'

let i = 0
export const getDefaultProfileAvatar = (name: string) => {
  const key = `profile_avatar_${name}`
  let avatar = localStorage.getItem(key)
  if (!avatar) {
    if (i === DEFAULT_AVATARS.length) i = 0
    avatar = getFilePath(DEFAULT_AVATARS[i++])
    localStorage.setItem(key, avatar)
  }

  return avatar
}
