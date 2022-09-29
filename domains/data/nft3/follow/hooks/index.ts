import { useCallback, useState } from 'react'
import { useNFT3 } from '@nft3sdk/did-manager'
import type { FollowMember } from 'UI/profile-board/Follow/types'
import { useDebounceMemo } from 'app/hooks/useDebounceMemo'

export const useFollow = (identifier: string) => {
  const { client } = useNFT3()
  const [count, setCount] = useState({
    following: 0,
    followers: 0,
  })
  const [following, setFollowing] = useState<FollowMember[]>([])
  const [followers, setFollowers] = useState<FollowMember[]>([])

  const getCount = useCallback(async () => {
    if (!identifier) return
    const result = await client.follow.count(identifier)
    setCount(result)
  }, [client.follow, identifier])

  const getFollowing = useCallback(
    async (offset = 0, limit = 10) => {
      if (!identifier) return
      const items = await client.follow.following({
        identifier,
        offset,
        limit,
      })
      setFollowing(items)
    },
    [client.follow, identifier]
  )

  const getFollowers = useCallback(
    async (offset = 0, limit = 10) => {
      if (!identifier) return
      const items = await client.follow.followers({
        identifier,
        offset,
        limit,
      })
      setFollowers(items)
    },
    [client.follow, identifier]
  )

  const updateFollowCount = useCallback(() => {
    return Promise.all([getCount()])
  }, [getCount])

  const updateFollower = useCallback(() => {
    return Promise.all([getFollowing(), getFollowers()])
  }, [getFollowers, getFollowing])

  const follow = useCallback(async () => {
    if (!identifier) return
    const result = await client.follow.follow(identifier)
    updateFollowCount()
    updateFollower()
    return result
  }, [client.follow, identifier, updateFollowCount, updateFollower])

  const unfollow = useCallback(async () => {
    if (!identifier) return
    const result = await client.follow.unfollow(identifier)
    updateFollowCount()
    updateFollower()
    return result
  }, [client.follow, identifier, updateFollowCount, updateFollower])

  const check = useCallback(
    async (identifier: string, followingDid: string) => {
      if (!identifier || !followingDid) return
      const result = await client.follow.check(identifier, followingDid)
      return result
    },
    [client.follow]
  )

  useDebounceMemo(() => {
    updateFollowCount()
  }, [updateFollowCount])

  return {
    count,
    following,
    followers,
    follow,
    unfollow,
    check,
    updateFollower,
    updateFollowCount,
  }
}
