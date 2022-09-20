import { createContext } from 'app/utils/createContext'

import useIpfs from './hooks/useIpfs'

import AssetsProvider from './assets'
import FollowProvider from './follow'
import ProfileProvider from './profile'
import SocialProvider from './social'
import WalletProvider from './wallet'

const useNFT3Service = () => {
  const { format, upload } = useIpfs()

  return {
    format,
    upload,
  }
}
const { Provider: NFT3Provider, createUseContext } = createContext(useNFT3Service)

export const createNFT3Context = createUseContext
export { createAssetsContext } from './assets'
export { createFollowContext } from './follow'
export { createProfileContext } from './profile'
export { createSocialContext } from './social'
export { createWalletContext } from './wallet'

const Provider: FC = ({ children }) => {
  return (
    <NFT3Provider>
      <ProfileProvider>
        <SocialProvider>
          <AssetsProvider>
            <WalletProvider>
              <FollowProvider>{children}</FollowProvider>
            </WalletProvider>
          </AssetsProvider>
        </SocialProvider>
      </ProfileProvider>
    </NFT3Provider>
  )
}

export default Provider
