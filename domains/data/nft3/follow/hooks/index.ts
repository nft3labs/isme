import { useCallback, useEffect, useState } from 'react'
import { useNFT3 } from '@nft3sdk/did-manager'
import type { FollowMember } from 'UI/profile-board/Follow/types'

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
    async (offset = 0, limit = 30) => {
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
    async (offset = 0, limit = 30) => {
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

  const updateFollow = useCallback(() => {
    return Promise.all([getCount(), getFollowing(), getFollowers()])
  }, [getCount, getFollowers, getFollowing])

  const follow = useCallback(async () => {
    if (!identifier) return
    const result = await client.follow.follow(identifier)
    updateFollow()
    return result
  }, [client.follow, identifier, updateFollow])

  const unfollow = useCallback(async () => {
    if (!identifier) return
    const result = await client.follow.unfollow(identifier)
    updateFollow()
    return result
  }, [client.follow, identifier, updateFollow])

  const check = useCallback(
    async (followingDid: string) => {
      if (!identifier || !followingDid) return
      const result = await client.follow.check(followingDid, identifier)
      return result
    },
    [client.follow, identifier]
  )

  useEffect(() => {
    updateFollow()
  }, [updateFollow])

  return {
    count,
    following,
    followers,
    follow,
    unfollow,
    check,
  }
}
