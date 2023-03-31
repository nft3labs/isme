import { useCallback, useEffect, useRef, useState } from 'react'
import { useUser, useYlide } from '../index'
import { useNFT3 } from '@nft3sdk/did-manager'
import type { IMessage, Uint256 } from '@ylide/sdk'
import { MessageContentV4, YMF } from '@ylide/sdk'
import type { YlideDecodedMessage } from './index'
import { constructFeedId } from '@ylide/ethereum'

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

const CHAT_LIST_ENDPOINT = '/nft3-chats'
const CHAT_LIST_PAGE_SIZE = 10

interface ChatThread {
  didname: string
  lastMessageDate: number
}

export enum ChatListState {
  IDLE,
  LOADING,
}

const uniqueFeedId = '0000000000000000000000000000000000000000000000000000000000000117' as Uint256 // ISME const

export function useFeedLoader(userAddress: string) {
  const feedId = constructFeedId(userAddress, true, uniqueFeedId)
  const { walletAccount, decodeMessage } = useYlide()

  const loadFeedPosts = useCallback(
    async (offset: number, limit: number) => {
      const data = await request<IMessage[]>(`/broadcasts/`, {
        feedId,
        offset,
        limit,
      })

      const messages = await Promise.all(
        data.map(async (entry) => {
          const decoded = await decodeMessage(entry.msgId, entry, walletAccount)

          return decoded
        })
      )

      return data.map((d, idx) => ({
        body: messages[idx],
        msg: d,
      }))
    },
    [decodeMessage, feedId, walletAccount]
  )

  return loadFeedPosts
}

export function useChatList() {
  const { client } = useNFT3()
  const { account } = useUser()
  const { checkReadingAvailable } = useYlide()

  const stateRef = useRef(ChatListState.IDLE)
  const [state, setState] = useState(stateRef.current)
  const [list, setList] = useState<ChatThread[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  const loadMore = useCallback(() => setPage((p) => p + 1), [])

  const loadThreads = useCallback(
    async (page: number) => {
      if (!account || !checkReadingAvailable()) {
        throw new Error('Wrong state')
      }

      const { totalCount, entries } = await request<{
        totalCount: number
        entries: { address: string; lastMessageTimestamp: number }[]
      }>(CHAT_LIST_ENDPOINT, {
        myAddress: account,
        offset: (page - 1) * CHAT_LIST_PAGE_SIZE,
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

      return { totalCount, threads }
    },
    [account, checkReadingAvailable, client.did]
  )

  useEffect(() => {
    let isCancelled = false

    setState((stateRef.current = ChatListState.LOADING))

    loadThreads(page)
      .then(({ totalCount, threads }) => {
        if (isCancelled) return

        setHasMore(totalCount > page * CHAT_LIST_PAGE_SIZE)
        setList((l) => [...l, ...threads])
        setState((stateRef.current = ChatListState.IDLE))
      })
      .catch((e) => {
        if (isCancelled) return

        console.error('Loading chat list failed', e)
        setState((stateRef.current = ChatListState.IDLE))
      })

    return () => {
      isCancelled = true
    }
  }, [loadThreads, page])

  return {
    state,
    list,
    hasMore,
    loadMore,
  }
}

//

const CHAT_ENDPOINT = '/nft3-thread'

export interface ChatMessage {
  id: string
  msg: IMessage
  isIncoming: boolean
  recipientName: string
  decoded: YlideDecodedMessage
}

export enum ChatState {
  IDLE,
  LOADING,
}

export function useChat({ recipientName }: { recipientName?: string }) {
  const { client } = useNFT3()
  const { account } = useUser()
  const { checkReadingAvailable, walletAccount, decodeMessage } = useYlide()

  const stateRef = useRef(ChatState.IDLE)
  const [state, setState] = useState(stateRef.current)
  const [list, setList] = useState<ChatMessage[]>([])

  const loadMessages = useCallback(async () => {
    if (!account || !checkReadingAvailable() || !walletAccount || !recipientName) {
      throw new Error('Wrong state')
    }

    const recipientInfo = await client.did.info(client.did.convertName(recipientName))
    const recipientAddress = recipientInfo.addresses[0]?.split(':')[1]

    const { entries: enteriesRaw } = await request<{
      totalCount: number
      entries: { type: 'message' | string; id: string; isIncoming: boolean; msg: IMessage }[]
    }>(CHAT_ENDPOINT, {
      myAddress: account,
      recipientAddress: recipientAddress || recipientName,
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

    return await Promise.all(
      entries
        .filter((e) => e.type === 'message')
        .map(async (entry) => {
          const decoded = await decodeMessage(entry.id, entry.msg, walletAccount)

          return {
            id: entry.id,
            msg: entry.msg,
            isIncoming: entry.isIncoming,
            recipientName,
            decoded,
          } as ChatMessage
        })
    )
  }, [account, checkReadingAvailable, client.did, decodeMessage, recipientName, walletAccount])

  const [reloadCounter, setReloadCounter] = useState(0)
  const reloadMessages = useCallback(() => setReloadCounter((c) => c + 1), [])

  useEffect(() => {
    const timer = setInterval(reloadMessages, 15 * 1000)
    return () => clearInterval(timer)
  }, [reloadMessages])

  useEffect(() => {
    let isCancelled = false

    setState((stateRef.current = ChatState.LOADING))

    loadMessages()
      .then((messages) => {
        if (isCancelled) return

        setList(messages)
        setState((stateRef.current = ChatState.IDLE))
      })
      .catch((e) => {
        if (isCancelled) return

        console.log('Loading chat failed', e)

        setList([])
        setState((stateRef.current = ChatState.IDLE))
      })

    return () => {
      isCancelled = true
    }
  }, [reloadCounter, loadMessages])

  return {
    state,
    list,
    reloadMessages,
  }
}

//

export function useSendChatMessage() {
  const { client } = useNFT3()
  const { sendMessage } = useYlide()

  const [isSending, setSending] = useState(false)

  const send = useCallback(
    async ({ recipientName, text }: { recipientName: string; text: string }) => {
      try {
        setSending(true)

        const content = new MessageContentV4({
          sendingAgentName: 'ysh',
          sendingAgentVersion: { major: 1, minor: 0, patch: 0 },
          subject: '',
          content: YMF.fromPlainText(text.trim()),
          attachments: [],
          extraBytes: new Uint8Array(0),
          extraJson: {},
        })

        const recipientInfo = await client.did.info(client.did.convertName(recipientName))
        const recipientAddress = recipientInfo.addresses[0]?.split(':')[1]

        if (!recipientAddress) {
          throw new Error("Couldn't find recipient address")
        }

        await sendMessage({
          recipients: [recipientAddress],
          content,
        })
      } finally {
        setSending(false)
      }
    },
    [client.did, sendMessage]
  )

  return {
    isSending,
    send,
  }
}
