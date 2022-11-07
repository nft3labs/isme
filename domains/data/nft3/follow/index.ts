import { useCallback, useEffect, useState } from 'react'
import { createContext } from 'app/utils/createContext'
import { useNFT3Profile, useUser } from 'domains/data'
import { useFollow } from './hooks'
import { createToastifyPromise } from 'app/utils/promise/toastify'

const useFollowService = () => {
  const { identifier } = useUser()
  const { did } = useNFT3Profile()
  const [followed, setFollowed] = useState(false)
  const {
    count,
    following,
    followers,
    follow,
    unfollow,
    check,
    updateFollower,
    loadMoreFollowingData,
    loadMoreFollowersData,
    isFollowingEnd,
    isFollowersEnd,
    followingLoading,
    followersLoading,
  } = useFollow(did)

  const checkUserFollow = useCallback(() => {
    if (!did) return
    updateFollower()
    if (!identifier) return
    return check(identifier, did).then((result) => {
      setFollowed(result)
    })
  }, [check, did, identifier, updateFollower])

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
    check,
    followed,
    count,
    following,
    followers,
    follow: userFollow,
    unfollow: userUnfollow,
    checkUserFollow,
    loadMoreFollowingData,
    loadMoreFollowersData,
    isFollowingEnd,
    isFollowersEnd,
    followingLoading,
    followersLoading,
  }
}
const { Provider: FollowProvider, createUseContext } = createContext(useFollowService)
export const createFollowContext = createUseContext

export default FollowProvider
