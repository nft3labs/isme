import type { ProfileModel, WithMeta } from '@nft3sdk/client'

import { getDefaultProfileAvatar } from './profileAvatar'

export const getProfile = (profile: WithMeta<ProfileModel>) => {
  if (!profile.name) return profile
  profile.avatar = profile.avatar || getDefaultProfileAvatar(profile.name)
  return profile
}
