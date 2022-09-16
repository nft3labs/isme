import { createContext } from 'app/utils/createContext'
import { createToastifyPromise } from 'app/utils/promise/toastify'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { useUser } from '..'
import useAssets from './hooks/useAssets'
import useFollow from './hooks/useFollow'

import useIpfs from './hooks/useIpfs'
import useProfile from './hooks/useProfile'
import useSocial from './hooks/useSocial'

const useProfileBoardService = () => {
  const [didname, setDidname] = useState('')
  const { client, identifier } = useUser()
  const { format } = useIpfs()

  const did = useMemo(() => {
    return client.did.convertName(didname!)
  }, [didname, client.did])

  const [followed, setFollowed] = useState(false)
  const [ready, setReady] = useState(false)
  const { socials, list } = useSocial()
  const { count, getCount, check, follow, unfollow, getFollowers, getFollowing, followers, following } = useFollow()
  const { tokens, nfts, txs, openseaAssets } = useAssets(did)
  const { profile, didinfo, info } = useProfile(did)

  const twitterAccount = useMemo(() => {
    const record = socials.find((item) => item.type === 'twitter' && item.verified === true)
    return record
  }, [socials])

  const checkFollow = useCallback(async () => {
    const result = await check(identifier!, did)
    setFollowed(result)
  }, [check, did, identifier])

  const followDID = () => {
    return createToastifyPromise(follow(did)).finally(() => {
      getCount(did)
      checkFollow()
    })
  }

  const unfollowDID = () => {
    return createToastifyPromise(unfollow(did)).finally(() => {
      getCount(did)
      checkFollow()
    })
  }

  useEffect(() => {
    if (!identifier) return
    checkFollow()
  }, [checkFollow, identifier])

  useEffect(() => {
    if (did) {
      getCount(did)
      getFollowers(did)
      getFollowing(did)
    }
  }, [did, getCount, getFollowers, getFollowing])

  useEffect(() => {
    createToastifyPromise(info()).finally(() => {
      setReady(true)
    })
  }, [info])

  useEffect(() => {
    list(did)
  }, [list, did])

  useEffect(() => {
    if (didinfo?.addresses?.length) {
      openseaAssets(didinfo.addresses[0].split(':')[1])
    }
  }, [didinfo, openseaAssets])

  return {
    setDidname,
    twitterAccount,
    format,
    ready,
    profile,
    follow: {
      followed,
      count,
      followDID,
      unfollowDID,
      followers,
      following,
    },
    info: {
      tokens,
      nfts,
      txs,
    },
  }
}
const { Provider: ProfileBoardProvider, createUseContext } = createContext(useProfileBoardService)
export const createProfileBoardContext = createUseContext

export default ProfileBoardProvider
