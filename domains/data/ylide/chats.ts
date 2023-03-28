import { useCallback, useEffect, useState } from 'react'
import { useYlide } from '../index'
import { useNFT3 } from '@nft3sdk/did-manager'

const INDEXER_URL = 'https://idx1.ylide.io'
const CHAT_LIST_ENDPOINT = '/otc-chats'

async function request<Data>(url: string, body: any) {
  const response = await fetch(`${INDEXER_URL}${url}`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'text/plain',
    },
  })

  const responseBody = await response.json()
  if (responseBody.data) {
    return responseBody.data as Data
  } else {
    throw new Error(responseBody.error || 'Request error')
  }
}

//

const CHAT_LIST_PAGE_SIZE = 10

interface ChatThread {
  didname: string
  lastMessageDate: number
}

export enum ChatListState {
  IDLE,
  LOADING,
  ERROR,
}

export function useChatList() {
  const { client } = useNFT3()
  const { checkReadingAvailable, walletAccount } = useYlide()

  const [state, setState] = useState(ChatListState.IDLE)
  const [list, setList] = useState<ChatThread[]>([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const loadMore = useCallback(async () => {
    try {
      if (!checkReadingAvailable() || state === ChatListState.LOADING) return
      setState(ChatListState.LOADING)

      const newPage = page + 1

      const { totalCount, entries } = await request<{
        totalCount: number
        entries: { address: string; lastMessageTimestamp: number }[]
      }>(CHAT_LIST_ENDPOINT, {
        myAddress: walletAccount.address,
        offset: page * CHAT_LIST_PAGE_SIZE,
        limit: CHAT_LIST_PAGE_SIZE,
      })

      const threads = await Promise.all(
        entries.map(async (entry) => {
          const didname = (
            await client.did.search({
              keyword: entry.address,
              mode: 'address',
            })
          )[0]?.didname

          return {
            didname: didname || entry.address,
            lastMessageDate: entry.lastMessageTimestamp * 1000,
          } as ChatThread
        })
      )

      setPage(newPage)
      setHasMore(totalCount > newPage * CHAT_LIST_PAGE_SIZE)
      setList([...list, ...threads])
      setState(ChatListState.IDLE)
    } catch (e) {
      console.log('Loading chat list failed', e)
      setState(ChatListState.ERROR)
    }
  }, [checkReadingAvailable, client.did, list, page, state, walletAccount.address])

  useEffect(() => {
    console.log(`useEffect`)
    loadMore().then()
  }, [])

  return {
    state,
    list,
    hasMore,
    loadMore,
  }
}
