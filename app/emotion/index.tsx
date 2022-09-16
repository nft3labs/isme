import type { EmotionCache } from '@emotion/cache'
import { CacheProvider } from '@emotion/react'

import createEmotionCache from './createEmotionCache'

const clientSideEmotionCache = createEmotionCache()

export type EmotionProps = {
  emotionServerCache: EmotionCache
}

export const Provider: FC<EmotionProps> = ({ emotionServerCache, children }) => {
  const cache = emotionServerCache || clientSideEmotionCache
  return <CacheProvider value={cache}>{children}</CacheProvider>
}
export default Provider
