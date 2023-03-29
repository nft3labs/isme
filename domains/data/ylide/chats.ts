import { useCallback, useEffect, useState } from 'react'
import { useYlide } from '../index'
import { useNFT3 } from '@nft3sdk/did-manager'
import type { IMessage } from '@ylide/sdk'
import type { YlideDecodedMessage } from './index'

const INDEXER_URL = 'https://idx1.ylide.io'

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

const CHAT_LIST_ENDPOINT = '/otc-chats'
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
  const [hasMore, setHasMore] = useState(false)

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
  }, [checkReadingAvailable, client.did, list, page, state, walletAccount])

  useEffect(() => {
    loadMore()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    state,
    list,
    hasMore,
    loadMore,
  }
}

//

const CHAT_ENDPOINT = '/otc-thread'

export interface ChatMessage {
  id: string
  msg: IMessage
  isIncoming: boolean
  decoded: YlideDecodedMessage
}

export enum ChatState {
  IDLE,
  LOADING,
  LOADED,
  ERROR,
}

export function useChat({ recipientName }: { recipientName?: string }) {
  const { client } = useNFT3()
  const { checkReadingAvailable, walletAccount, decodeMessage } = useYlide()

  const [state, setState] = useState(ChatState.IDLE)
  const [list, setList] = useState<ChatMessage[]>([])

  useEffect(() => {
    ;(async () => {
      try {
        if (!recipientName || !checkReadingAvailable() || state !== ChatState.IDLE) return
        setState(ChatState.LOADING)

        const recipientInfo = await client.did.info(client.did.convertName(recipientName))
        const recipientAddress = recipientInfo.addresses[0]?.split(':')[1]

        const { entries: enteriesRaw } = await request<{
          totalCount: number
          entries: { type: 'message' | string; id: string; isIncoming: boolean; msg: IMessage }[]
        }>(CHAT_ENDPOINT, {
          myAddress: walletAccount.address,
          recipientAddress,
          offset: 0,
          limit: 100,
        })

        const entries = enteriesRaw.map((entry) => ({
          ...entry,
          msg: {
            ...entry.msg,
            key: new Uint8Array(entry.msg.key),
          },
        }))

        const messages = await Promise.all(
          entries
            .filter((e) => e.type === 'message')
            .map(async (entry) => {
              const decoded = await decodeMessage(entry.id, entry.msg, walletAccount)

              return {
                id: entry.id,
                msg: entry.msg,
                isIncoming: entry.isIncoming,
                decoded,
              } as ChatMessage
            })
        )

        setList(messages)
        setState(ChatState.LOADED)
      } catch (e) {
        console.log('Loading chat failed', e)
        setState(ChatState.ERROR)
      }
    })()
  }, [checkReadingAvailable, client.did, decodeMessage, recipientName, state, walletAccount])

  return {
    state,
    list,
  }
}
