import UserProvider, { createUserContext } from './user'
import NFT3Provider, {
  createNFT3Context,
  createAssetsContext,
  createFollowContext,
  createProfileContext,
  createSocialContext,
  createWalletContext,
  createFeaturedPeoplesContext,
  createStatsContext,
  createReferrerStatsContext,
} from './nft3'
import YlideProvider from './ylide'

const Provider: FC = ({ children }) => {
  return (
    <UserProvider>
      <YlideProvider>
        <NFT3Provider>{children}</NFT3Provider>
      </YlideProvider>
    </UserProvider>
  )
}

export default Provider

export const useUser = createUserContext()
export const useNFT3 = createNFT3Context()
export const useNFT3Assets = createAssetsContext()
export const useNFT3Follow = createFollowContext()
export const useNFT3Profile = createProfileContext()
export const useNFT3Social = createSocialContext()
export const useNFT3Wallet = createWalletContext()
export const useNFT3FeaturedPeoples = createFeaturedPeoplesContext()
export const useNFT3Stats = createStatsContext()
export const useNFT3ReferrerStats = createReferrerStatsContext()
