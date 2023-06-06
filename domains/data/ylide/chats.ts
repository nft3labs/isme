import { useCallback, useEffect, useRef, useState } from 'react'
import { useUser, useYlide } from '../index'
import { useNFT3 } from '@nft3sdk/did-manager'
import type { IMessage } from '@ylide/sdk'
import { MessageContentV4, YMF } from '@ylide/sdk'
import type { YlideDecodedMessage } from './index'
import { AuthState } from './index'
import { indexerRequest } from './utils/net'

const CHAT_LIST_ENDPOINT = '/nft3-chats'

interface ChatThread {
  didname: string
  lastMessageDate: number
}

export enum ChatListState {
  IDLE,
  LOADING,
}

export function useChatList() {
  const { client } = useNFT3()
  const { account } = useUser()
  const { authState, forceAuth } = useYlide()

  const stateRef = useRef(ChatListState.IDLE)
  const [state, setState] = useState(stateRef.current)
  const [list, setList] = useState<ChatThread[]>([])

  const loadThreads = useCallback(async () => {
    const { totalCount, entries } = await indexerRequest<{
      totalCount: number
      entries: { address: string; lastMessageTimestamp: number }[]
    }>(CHAT_LIST_ENDPOINT, {
      myAddress: account,
      offset: 0,
      limit: 1000,
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
  }, [account, client.did])

  useEffect(() => {
    let isCancelled = false

    if (!account) {
      return
    }
    if (authState === AuthState.LOADING) {
      return
    }
    if (authState === AuthState.NOT_AUTHORIZED) {
      return
    }

    if (authState !== AuthState.AUTHORIZED) {
      console.log(account, authState)
      forceAuth()
      return
    }

    setState((stateRef.current = ChatListState.LOADING))

    loadThreads()
      .then(({ threads }) => {
        if (isCancelled) return

        setList(threads)
        setState((stateRef.current = ChatListState.IDLE))
      })
      .catch((e) => {
        if (isCancelled) return

        console.error('Loading chat list failed', e)
        setList([])
        setState((stateRef.current = ChatListState.IDLE))
      })

    return () => {
      isCancelled = true
    }
  }, [account, authState, forceAuth, loadThreads])

  return {
    state,
    list,
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
  const { walletAccount, decodeMessage, forceAuth, isLoading, authState } = useYlide()

  const stateRef = useRef(ChatState.IDLE)
  const [state, setState] = useState(stateRef.current)
  const [list, setList] = useState<ChatMessage[]>([])

  const loadMessages = useCallback(async () => {
    const recipientInfo = await client.did.info(client.did.convertName(recipientName))
    const recipientAddress = recipientInfo.addresses[0]?.split(':')[1]

    const { entries: enteriesRaw } = await indexerRequest<{
      totalCount: number
      entries: { type: 'message' | string; id: string; isIncoming: boolean; msg: IMessage }[]
    }>(CHAT_ENDPOINT, {
      myAddress: account,
      recipientAddress: recipientAddress || recipientName,
      offset: 0,
      limit: 1000,
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
  }, [account, client.did, decodeMessage, recipientName, walletAccount])

  const [reloadCounter, setReloadCounter] = useState(0)
  const reloadMessages = useCallback(() => setReloadCounter((c) => c + 1), [])

  useEffect(() => {
    const timer = setInterval(reloadMessages, 15 * 1000)
    return () => clearInterval(timer)
  }, [reloadMessages])

  useEffect(() => {
    let isCancelled = false

    if (authState === AuthState.LOADING) {
      return
    }
    if (authState === AuthState.NOT_AUTHORIZED) {
      return
    }

    if (authState !== AuthState.AUTHORIZED) {
      forceAuth()
      return
    }

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
  }, [reloadCounter, loadMessages, forceAuth, isLoading, authState])

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
