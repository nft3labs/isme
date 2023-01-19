import { createContext } from 'app/utils/createContext'
import { useNFT3Profile } from 'domains/data'
import { useSocial } from './hooks/useSocial'

const useSocialService = () => {
  const { did } = useNFT3Profile()
  return useSocial(did)
}
const { Provider: SocialProvider, createUseContext } = createContext(useSocialService)
export const createSocialContext = createUseContext

export default SocialProvider
