import { useMemo } from 'react'
import { NFT3Queryer } from '@nft3sdk/client'
import { createContext } from 'app/utils/createContext'

import useIpfs from './hooks/useIpfs'

import AssetsProvider from './assets'
import FollowProvider from './follow'
import ProfileProvider from './profile'
import SocialProvider from './social'
import WalletProvider from './wallet'
import FeaturedPeoplesProvider from './featuredPeoples'

const useNFT3Service = () => {
  const { format, upload } = useIpfs()

  const queryer = useMemo(() => {
    return new NFT3Queryer('https://t0.onebitdev.com/nft3-queryer/')
  }, [])

  return {
    format,
    upload,
    queryer,
  }
}
const { Provider: NFT3Provider, createUseContext } = createContext(useNFT3Service)

export const createNFT3Context = createUseContext
export { createAssetsContext } from './assets'
export { createFollowContext } from './follow'
export { createProfileContext } from './profile'
export { createSocialContext } from './social'
export { createWalletContext } from './wallet'
export { createFeaturedPeoplesContext } from './featuredPeoples'

const Provider: FC = ({ children }) => {
  return (
    <NFT3Provider>
      <ProfileProvider>
        <SocialProvider>
          <AssetsProvider>
            <WalletProvider>
              <FollowProvider>
                <FeaturedPeoplesProvider>{children}</FeaturedPeoplesProvider>
              </FollowProvider>
            </WalletProvider>
          </AssetsProvider>
        </SocialProvider>
      </ProfileProvider>
    </NFT3Provider>
  )
}

export default Provider
