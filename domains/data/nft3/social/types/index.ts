import type { SocialAccountModel, WithMeta } from '@nft3sdk/client'
export interface SocialRecord extends WithMeta<SocialAccountModel> {
  verified: boolean
}
