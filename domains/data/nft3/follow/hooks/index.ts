import { useCallback, useState } from 'react'
import { useROOT } from '@rootlabs/did-manager'
import type { FollowMember } from 'components/Follow/types'
import { useDebounceMemo } from 'app/hooks/useDebounceMemo'

export const useFollow = (identifier: string) => {
  const { client } = useROOT()
  const [count, setCount] = useState({
    following: 0,
    followers: 0,
  })
  const [following, setFollowing] = useState<FollowMember[]>([])
  const [followers, setFollowers] = useState<FollowMember[]>([])
  const [followingOffset, setFollowingOffset] = useState(0)
  const [followersOffset, setFollowersOffset] = useState(0)
  const [isFollowingEnd, setIsFollowingEnd] = useState(false)
  const [isFollowersEnd, setIsFollowersEnd] = useState(false)
  const [followingLoading, setFollowingLoading] = useState(false)
  const [followersLoading, setFollowersLoading] = useState(false)

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

  const loadMoreFollowingData = useCallback(async () => {
    if (!identifier) return
    setFollowingLoading(true)
    const limit = 10
    const items = await client.follow.following({
      identifier,
      offset: (followingOffset + 1) * limit,
      limit,
    })
    if (items.length < limit) {
      setIsFollowingEnd(true)
    }
    setFollowingOffset((i) => ++i)
    setFollowing((data) => data.concat(items))
    setFollowingLoading(false)
  }, [client.follow, followingOffset, identifier])
  const loadMoreFollowersData = useCallback(async () => {
    if (!identifier) return
    setFollowersLoading(true)
    const limit = 10
    const items = await client.follow.followers({
      identifier,
      offset: (followersOffset + 1) * limit,
      limit,
    })
    if (items.length < limit) {
      setIsFollowersEnd(true)
    }
    setFollowersOffset((i) => ++i)
    setFollowers((data) => data.concat(items))
    setFollowersLoading(false)
  }, [client.follow, followersOffset, identifier])

  const updateFollowCount = useCallback(() => {
    return Promise.all([getCount()])
  }, [getCount])

  const updateFollower = useCallback(() => {
    setFollowingOffset(0)
    setFollowersOffset(0)
    setFollowingLoading(false)
    setFollowersLoading(false)
    setIsFollowingEnd(false)
    setIsFollowersEnd(false)

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
    loadMoreFollowingData,
    loadMoreFollowersData,
    isFollowingEnd,
    isFollowersEnd,
    followingLoading,
    followersLoading,
  }
}
