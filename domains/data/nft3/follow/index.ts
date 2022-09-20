import { useCallback, useEffect, useState } from 'react'
import { createContext } from 'app/utils/createContext'
import { useNFT3Profile, useUser } from 'domains/data'
import { useFollow } from './hooks'
import { createToastifyPromise } from 'app/utils/promise/toastify'

const useFollowService = () => {
  const { identifier } = useUser()
  const { did } = useNFT3Profile()
  const [followed, setFollowed] = useState(false)
  const { count, following, followers, follow, unfollow, check } = useFollow(did)

  const checkUserFollow = useCallback(() => {
    if (!identifier) return
    return check(identifier).then((result) => {
      setFollowed(result)
    })
  }, [check, identifier])

  useEffect(() => {
    checkUserFollow()
  }, [checkUserFollow])

  const userFollow = useCallback(() => {
    return createToastifyPromise(follow().then(() => checkUserFollow()))
  }, [checkUserFollow, follow])

  const userUnfollow = useCallback(() => {
    return createToastifyPromise(unfollow().then(() => checkUserFollow()))
  }, [checkUserFollow, unfollow])

  return {
    followed,
    count,
    following,
    followers,
    follow: userFollow,
    unfollow: userUnfollow,
  }
}
const { Provider: FollowProvider, createUseContext } = createContext(useFollowService)
export const createFollowContext = createUseContext

export default FollowProvider
