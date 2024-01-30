import type { SocialAccountModel, WithMeta } from '@rootlabs/client'
export interface SocialRecord extends WithMeta<SocialAccountModel> {
  verified: boolean
}
