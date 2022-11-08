import UserProvider, { createUserContext } from './user'
import NFT3Provider, {
  createNFT3Context,
  createAssetsContext,
  createFollowContext,
  createProfileContext,
  createSocialContext,
  createWalletContext,
  createFeaturedPeoplesContext,
} from './nft3'

const Provider: FC = ({ children }) => {
  return (
    <UserProvider>
      <NFT3Provider>{children}</NFT3Provider>
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
