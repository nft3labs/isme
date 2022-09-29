import type { ProfileModel } from '@nft3sdk/client'

import { getDefaultProfileAvatar } from './profileAvatar'

export const getProfile = (profile: ProfileModel) => {
  if (!profile.name) return profile
  profile.avatar = profile.avatar || getDefaultProfileAvatar(profile.name)
  return profile
}
