import { useState, useCallback } from 'react'
import { useNFT3 } from '@nft3sdk/did-manager'
import type { FollowMember } from '@nft3sdk/client'

export default function useFollow() {
  const { client } = useNFT3()
  const [count, setCount] = useState({
    following: 0,
    followers: 0,
  })
  const [following, setFollowing] = useState<FollowMember[]>([])
  const [followers, setFollowers] = useState<FollowMember[]>([])

  const getCount = useCallback(
    async (identifier: string) => {
      const result = await client.follow.count(identifier)
      setCount(result)
    },
    [client.follow]
  )

  const getFollowing = useCallback(
    async (identifier: string, offset = 0, limit = 10) => {
      const items = await client.follow.following({
        identifier,
        offset,
        limit,
      })
      setFollowing(items)
    },
    [client.follow]
  )

  const getFollowers = useCallback(
    async (identifier: string, offset = 0, limit = 10) => {
      const items = await client.follow.followers({
        identifier,
        offset,
        limit,
      })
      setFollowers(items)
    },
    [client.follow]
  )

  const follow = useCallback(
    async (identifier: string) => {
      const result = await client.follow.follow(identifier)
      return result
    },
    [client.follow]
  )

  const unfollow = useCallback(
    async (identifier: string) => {
      const result = await client.follow.unfollow(identifier)
      return result
    },
    [client.follow]
  )

  const check = useCallback(
    async (identifier: string, followingDid: string) => {
      const result = await client.follow.check(identifier, followingDid)
      return result
    },
    [client.follow]
  )

  return {
    count,
    following,
    followers,
    getCount,
    getFollowing,
    getFollowers,
    follow,
    unfollow,
    check,
  }
}
