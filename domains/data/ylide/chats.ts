import { useCallback, useEffect, useRef, useState } from 'react'
import { useUser, useYlide } from '../index'
import { useNFT3 } from '@nft3sdk/did-manager'
import type { IMessage } from '@ylide/sdk'
import { MessageContentV4, YMF } from '@ylide/sdk'
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

const CHAT_LIST_ENDPOINT = '/nft3-chats'
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
  const { account } = useUser()
  const { checkReadingAvailable } = useYlide()

  const stateRef = useRef(ChatListState.IDLE)
  const [state, setState] = useState(stateRef.current)
  const [list, setList] = useState<ChatThread[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  const loadMore = useCallback(() => setPage((p) => p + 1), [])

  /*
  Reset everything if account has been changed.
  PS: It's kind of weird that one of deps is 'checkReadingAvailable'... FIXME
   */
  useEffect(() => {
    setState((stateRef.current = ChatListState.IDLE))
    setList([])
    setPage(1)
    setHasMore(false)
  }, [account, checkReadingAvailable])

  useEffect(() => {
    let isCancelled = false

    ;(async () => {
      try {
        if (stateRef.current === ChatListState.LOADING || !account || !checkReadingAvailable()) return
        setState((stateRef.current = ChatListState.LOADING))

        const { totalCount, entries } = await request<{
          totalCount: number
          entries: { address: string; lastMessageTimestamp: number }[]
        }>(CHAT_LIST_ENDPOINT, {
          myAddress: account,
          offset: page * CHAT_LIST_PAGE_SIZE,
          limit: CHAT_LIST_PAGE_SIZE,
        })

        if (isCancelled) return

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

        if (isCancelled) return

        setHasMore(totalCount > page * CHAT_LIST_PAGE_SIZE)
        setList((list) => [...list, ...threads])
        setState((stateRef.current = ChatListState.IDLE))
      } catch (e) {
        if (isCancelled) return
        console.error('Loading chat list failed', e)
        setState((stateRef.current = ChatListState.ERROR))
      }
    })()

    return () => {
      isCancelled = true
      setState((stateRef.current = ChatListState.IDLE))
    }
  }, [account, checkReadingAvailable, client.did, page])

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
  LOADED,
  ERROR,
}

export function useChat({ recipientName }: { recipientName?: string }) {
  const { client } = useNFT3()
  const { account } = useUser()
  const { checkReadingAvailable, walletAccount, decodeMessage } = useYlide()

  const stateRef = useRef(ChatState.IDLE)
  const [state, setState] = useState(stateRef.current)
  const [list, setList] = useState<ChatMessage[]>([])

  /*
  Reset everything if account has been changed.
  PS: It's kind of weird that one of deps is 'checkReadingAvailable'... FIXME
   */
  useEffect(() => {
    setState((stateRef.current = ChatState.IDLE))
    setList([])
  }, [account, checkReadingAvailable])

  useEffect(() => {
    const isCancelled = false

    ;(async () => {
      try {
        if (
          stateRef.current !== ChatState.IDLE ||
          !account ||
          !checkReadingAvailable() ||
          !walletAccount ||
          !recipientName
        )
          return
        setState((stateRef.current = ChatState.LOADING))

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

        if (isCancelled) return

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
                recipientName,
                decoded,
              } as ChatMessage
            })
        )

        if (isCancelled) return

        setList(messages)
        setState((stateRef.current = ChatState.LOADED))
      } catch (e) {
        if (isCancelled) return
        console.log('Loading chat failed', e)
        setState((stateRef.current = ChatState.ERROR))
      }
    })()
  }, [account, checkReadingAvailable, client.did, decodeMessage, recipientName, walletAccount])

  return {
    state,
    list,
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
