import type { EthereumBlockchainController, EthereumWalletController } from '@ylide/ethereum'
import { EVM_CHAINS, EVM_NAMES, evmBlockchainFactories, EVMNetwork, evmWalletFactories } from '@ylide/ethereum'
import type {
  BlockchainMap,
  ExternalYlidePublicKey,
  IGenericAccount,
  IMessage,
  IMessageContent,
  MessageContentV4,
  Uint256,
  YlideKey,
  YlideKeyPair,
  YMF,
} from '@ylide/sdk'
import { WalletEvent } from '@ylide/sdk'
import {
  BrowserLocalStorage,
  ServiceCode,
  Ylide,
  YlideKeyStore,
  YlideKeyStoreEvent,
  YlidePublicKeyVersion,
} from '@ylide/sdk'
import { toast } from 'lib/toastify'
import { createContext } from 'app/utils/createContext'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNFT3 } from '@nft3sdk/did-manager'
import { blockchainMeta, evmNameToNetwork } from './constants'
import { Wallet } from './Wallet'
import { isBytesEqual } from './utils/isBytesEqual'
import { chainIdByFaucetType, publishKeyThroughFaucet, requestFaucetSignature } from './utils/publish-helpers'
import { useDialog } from 'app/hooks/useDialog'

export enum AuthState {
  NOT_AUTHORIZED = 'NOT_AUTHORIZED', // no account connected in wallet
  LOADING = 'LOADING', // loading
  NO_REMOTE_KEY = 'NO_REMOTE_KEY', // no key found for this wallet
  HAS_REMOTE_BUT_NO_LOCAL_KEY = 'HAS_REMOTE_BUT_NO_LOCAL_KEY', // remote key found, but no local key
  LOCAL_REMOTE_MISMATCH = 'LOCAL_REMOTE_MISMATCH', // local key found, but remote key is different
  AUTHORIZED = 'AUTHORIZED', // alles gut
}

const INDEXER_BLOCKCHAINS = [
  'ETHEREUM',
  'AVALANCHE',
  'ARBITRUM',
  'BNBCHAIN',
  'OPTIMISM',
  'POLYGON',
  'FANTOM',
  'KLAYTN',
  'GNOSIS',
  'AURORA',
  'CELO',
  'CRONOS',
  'MOONBEAM',
  'MOONRIVER',
  'METIS',
]

Ylide.registerBlockchainFactory(evmBlockchainFactories[EVMNetwork.ETHEREUM])
Ylide.registerBlockchainFactory(evmBlockchainFactories[EVMNetwork.AVALANCHE])
Ylide.registerBlockchainFactory(evmBlockchainFactories[EVMNetwork.ARBITRUM])
Ylide.registerBlockchainFactory(evmBlockchainFactories[EVMNetwork.BNBCHAIN])
Ylide.registerBlockchainFactory(evmBlockchainFactories[EVMNetwork.OPTIMISM])
Ylide.registerBlockchainFactory(evmBlockchainFactories[EVMNetwork.POLYGON])
Ylide.registerBlockchainFactory(evmBlockchainFactories[EVMNetwork.FANTOM])
Ylide.registerBlockchainFactory(evmBlockchainFactories[EVMNetwork.KLAYTN])
Ylide.registerBlockchainFactory(evmBlockchainFactories[EVMNetwork.GNOSIS])
Ylide.registerBlockchainFactory(evmBlockchainFactories[EVMNetwork.AURORA])
Ylide.registerBlockchainFactory(evmBlockchainFactories[EVMNetwork.CELO])
Ylide.registerBlockchainFactory(evmBlockchainFactories[EVMNetwork.CRONOS])
Ylide.registerBlockchainFactory(evmBlockchainFactories[EVMNetwork.MOONBEAM])
Ylide.registerBlockchainFactory(evmBlockchainFactories[EVMNetwork.MOONRIVER])
Ylide.registerBlockchainFactory(evmBlockchainFactories[EVMNetwork.METIS])

Ylide.registerWalletFactory(evmWalletFactories.generic)

export interface YlideDecodedMessage {
  msgId: string
  decodedSubject: string
  decodedTextData: string | YMF
}

export type BlockchainBalances = Record<string, { original: string; numeric: number; e18: string }>

const useYlideService = () => {
  const { account, identifier } = useNFT3()
  const storage = useMemo(() => new BrowserLocalStorage(), [])
  const keystore = useMemo(
    () =>
      new YlideKeyStore(storage, {
        onPasswordRequest: null, // handlePasswordRequest.bind(this),
        onDeriveRequest: null, // handleDeriveRequest.bind(this),
      }),
    [storage]
  )
  const ylide = useMemo(() => new Ylide(keystore, INDEXER_BLOCKCHAINS), [keystore])

  useEffect(() => {
    keystore.init()
  }, [keystore])

  const [wallet, setWallet] = useState<Wallet | null>(null)
  // blockchainControllers will be used in future
  const [blockchainControllers, setBlockchainControllers] = useState<BlockchainMap<EthereumBlockchainController>>({})
  const [walletAccount, setWalletAccount] = useState<null | IGenericAccount>(null)
  const [keys, setKeys] = useState<YlideKey[]>(keystore.keys)
  const [remoteKeys, setRemoteKeys] = useState<Record<string, ExternalYlidePublicKey | null>>({})
  const [remoteKey, setRemoteKey] = useState<ExternalYlidePublicKey | null>(null)
  const [initialized, setInitialized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log('Accounts changed, Ylide: ' + walletAccount?.address + ', NFT3: ' + account)
  }, [walletAccount, account])

  const switchEVMChain = useCallback(async (_walletController: EthereumWalletController, needNetwork: EVMNetwork) => {
    try {
      const bData = blockchainMeta[EVM_NAMES[needNetwork]]

      await _walletController.providerObject.request({
        method: 'wallet_addEthereumChain',
        params: [bData.ethNetwork!],
      })
    } catch (error) {
      console.log('error: ', error)
    }

    try {
      await _walletController.providerObject.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x' + Number(EVM_CHAINS[needNetwork]).toString(16) }], // chainId must be in hexadecimal numbers
      })
    } catch (err) {
      throw err
    }

    setActiveNetwork(needNetwork)
  }, [])

  useEffect(() => {
    ;(async () => {
      if (initialized) return
      const availableWallets = await Ylide.getAvailableWallets()

      const genericFactory = availableWallets.find((w) => w.wallet === 'generic')
      if (genericFactory && !wallet) {
        const newWalletController = await ylide.controllers.addWallet(
          genericFactory.blockchainGroup,
          genericFactory.wallet,
          {
            dev: false, //document.location.hostname === 'localhost',
            onSwitchAccountRequest: () => {},
            onNetworkSwitchRequest: async (
              reason: string,
              currentNetwork: EVMNetwork | undefined,
              needNetwork: EVMNetwork
            ) => {
              try {
                await switchEVMChain(newWalletController as EthereumWalletController, needNetwork)
              } catch (err) {
                alert(
                  'Wrong network (' +
                    (currentNetwork ? EVM_NAMES[currentNetwork] : 'undefined') +
                    '), switch to ' +
                    EVM_NAMES[needNetwork]
                )
              }
            },
            walletConnectProvider: null,
          }
        )
        const newWallet = new Wallet(ylide, keystore, genericFactory, newWalletController)
        const handleDeriveRequest = async (
          reason: string,
          blockchainGroup: string,
          walletName: string,
          address: string,
          magicString: string
        ) => {
          try {
            if (newWallet.factory.wallet !== walletName) {
              return null
            }
            return newWallet.controller.signMagicString(
              {
                address,
                blockchain: blockchainGroup,
                publicKey: null,
              },
              magicString
            )
          } catch (err) {
            return null
          }
        }
        keystore.options.onDeriveRequest = handleDeriveRequest
        setWallet(newWallet)
      }

      setInitialized(true)
    })()
  }, [initialized, ylide, wallet, keystore, switchEVMChain])

  const handleKeysUpdate = useCallback((newKeys: YlideKey[]) => {
    setKeys([...newKeys])
  }, [])

  useEffect(() => {
    ;(async () => {
      const registeredBlockchains = Ylide.blockchainsList.map((b) => b.factory)

      const controllers: Record<string, EthereumBlockchainController> = Object.assign({}, blockchainControllers)
      let changed = false
      for (const factory of registeredBlockchains) {
        if (!controllers[factory.blockchain]) {
          controllers[factory.blockchain] = (await ylide.controllers.addBlockchain(factory.blockchain, {
            dev: false, //document.location.hostname === 'localhost',
          })) as EthereumBlockchainController
          changed = true
        }
      }

      if (changed) {
        setBlockchainControllers((prev) => ({ ...prev, ...controllers }))
      }
    })()
  }, [blockchainControllers, ylide])

  useEffect(() => {
    keystore.on(YlideKeyStoreEvent.KEYS_UPDATED, handleKeysUpdate)
    return () => {
      keystore.off(YlideKeyStoreEvent.KEYS_UPDATED, handleKeysUpdate)
    }
  }, [handleKeysUpdate, keystore])

  useEffect(() => {
    ;(async () => {
      if (!wallet) return
      let lastWalletAccount: IGenericAccount | null = null
      wallet.on('accountUpdate', async (newWalletAccount) => {
        if (newWalletAccount !== lastWalletAccount) {
          lastWalletAccount = newWalletAccount
          if (newWalletAccount) {
            const { remoteKeys, remoteKey } = await wallet.readRemoteKeys(newWalletAccount)
            setWalletAccount(newWalletAccount)
            setRemoteKeys(remoteKeys)
            setRemoteKey(remoteKey)
          } else {
            setWalletAccount(null)
            setRemoteKeys({})
            setRemoteKey(null)
          }
        }
      })
      await wallet.init()
      lastWalletAccount = wallet.currentWalletAccount
      if (wallet.currentWalletAccount) {
        const { remoteKeys, remoteKey } = await wallet.readRemoteKeys(wallet.currentWalletAccount)
        setWalletAccount(wallet.currentWalletAccount)
        setRemoteKeys(remoteKeys)
        setRemoteKey(remoteKey)
        setIsLoading(false)
      } else {
        setWalletAccount(null)
        setRemoteKeys({})
        setRemoteKey(null)
        setIsLoading(false)
      }
    })()
  }, [wallet])

  const reloadRemoteKeys = useCallback(async () => {
    if (!wallet || !walletAccount) return
    const { remoteKeys, remoteKey } = await wallet.readRemoteKeys(walletAccount)
    setRemoteKeys(remoteKeys)
    setRemoteKey(remoteKey)
  }, [wallet, walletAccount])

  // okay, so:
  // 1. walletAccount - current wallet account
  // 2. keys - all available local keys
  // 3. remoteKeys - remote keys for the current account

  const [authState, setAuthState] = useState<AuthState>(AuthState.NOT_AUTHORIZED)

  useEffect(() => {
    if (isLoading) {
      setAuthState(AuthState.LOADING)
      return
    }
    if (!walletAccount || !account) {
      setAuthState(AuthState.NOT_AUTHORIZED)
      return
    }
    if (!remoteKey) {
      setAuthState(AuthState.NO_REMOTE_KEY)
      return
    }
    const localKey = keys.find((k) => k.address === walletAccount.address)
    if (!localKey) {
      setAuthState(AuthState.HAS_REMOTE_BUT_NO_LOCAL_KEY)
      return
    }
    if (!isBytesEqual(localKey.keypair.publicKey, remoteKey.publicKey.bytes)) {
      setAuthState(AuthState.LOCAL_REMOTE_MISMATCH)
      return
    }
    setAuthState(AuthState.AUTHORIZED)
  }, [account, isLoading, keys, remoteKey, walletAccount])

  const saveLocalKey = useCallback(
    async (key: YlideKeyPair, keyVersion: YlidePublicKeyVersion) => {
      await keystore.storeKey(key, keyVersion, 'evm', 'generic')
      await keystore.save()
    },
    [keystore]
  )

  const isPasswordNeeded = useMemo(() => {
    if (remoteKey?.keyVersion === 1) {
      return true
    } else if (remoteKey?.keyVersion === 2) {
      return true
    } else if (remoteKey?.keyVersion === 3) {
      return false
    } else {
      return false
    }
  }, [remoteKey])

  const createLocalKey = useCallback(
    async (password: string, forceNew?: boolean) => {
      let tempLocalKey: YlideKeyPair
      let keyVersion: YlidePublicKeyVersion
      try {
        if (forceNew) {
          tempLocalKey = await wallet.constructLocalKeyV2(walletAccount, password)
          keyVersion = YlidePublicKeyVersion.KEY_V2
        } else if (remoteKey?.keyVersion === YlidePublicKeyVersion.INSECURE_KEY_V1) {
          // strange... I'm not sure Qamon keys work here
          tempLocalKey = await wallet.constructLocalKeyV1(walletAccount, password) //wallet.constructLocalKeyV1(walletAccount, password);
          keyVersion = YlidePublicKeyVersion.INSECURE_KEY_V1
        } else if (remoteKey?.keyVersion === YlidePublicKeyVersion.KEY_V2) {
          // if user already using password - we should use it too
          tempLocalKey = await wallet.constructLocalKeyV2(walletAccount, password)
          keyVersion = YlidePublicKeyVersion.KEY_V2
        } else if (remoteKey?.keyVersion === YlidePublicKeyVersion.KEY_V3) {
          // if user is not using password - we should not use it too
          tempLocalKey = await wallet.constructLocalKeyV3(walletAccount)
          keyVersion = YlidePublicKeyVersion.KEY_V3
        } else {
          // user have no key at all - use passwordless version
          tempLocalKey = await wallet.constructLocalKeyV3(walletAccount)
          keyVersion = YlidePublicKeyVersion.KEY_V3
        }
        return { key: tempLocalKey, keyVersion }
      } catch (err) {
        console.log('createLocalKey error', err)
        return null
      }
    },
    [wallet, walletAccount, remoteKey]
  )

  const publishLocalKey = useCallback(
    async (
      faucetType: 'polygon' | 'gnosis' | 'fantom',
      key: YlideKeyPair,
      account: IGenericAccount,
      keyVersion: number
    ) => {
      // TODO: request signature, publish through faucet
      const chainId = chainIdByFaucetType(faucetType)
      const timestampLock = Math.floor(Date.now() / 1000) - 90
      const registrar = 4 // NFT3 const
      const signature = await requestFaucetSignature(
        wallet,
        key.keypair.publicKey,
        account,
        chainId,
        registrar,
        timestampLock
      )

      await publishKeyThroughFaucet(
        faucetType,
        key.keypair.publicKey,
        account,
        signature,
        registrar,
        timestampLock,
        keyVersion
      )
    },
    [wallet]
  )

  const getBalancesOf = useCallback(
    async (address: string): Promise<BlockchainBalances> => {
      const chains = Ylide.blockchainsList.map((b) => b.factory)
      const balances = await Promise.all(
        chains.map((chain) => blockchainControllers[chain.blockchain]!.getBalance(address))
      )

      return chains.reduce(
        (p, c, i) => ({
          ...p,
          [c.blockchain]: balances[i]!,
        }),
        {} as BlockchainBalances
      )
    },
    [blockchainControllers]
  )

  useEffect(() => {
    if (account && identifier) {
      ;(async () => {
        if (authState === AuthState.AUTHORIZED) {
          console.log('User authorized in Ylide')
          // do nothing, user already authorized
        } else if (authState === AuthState.NO_REMOTE_KEY) {
          const result = await createLocalKey('')
          if (!result) {
            // so sad :( wait for user to try to read some message
            return
          }
          const { key, keyVersion } = result
          await saveLocalKey(key, keyVersion)
          await publishLocalKey('gnosis', key, walletAccount, keyVersion)
          await new Promise((r) => setTimeout(r, 3000))
          const { remoteKeys, remoteKey } = await wallet.readRemoteKeys(walletAccount)
          setRemoteKeys(remoteKeys)
          setRemoteKey(remoteKey)
          toast.success('Ylide is authorized')
        } else if (authState === AuthState.HAS_REMOTE_BUT_NO_LOCAL_KEY) {
          if (isPasswordNeeded) {
            // do nothing, wait for user to try to read some message
          } else {
            const result = await createLocalKey('')
            if (!result) {
              // so sad :( weird case, wait for user to try to read some message
              return
            }
            const { key, keyVersion } = result
            await saveLocalKey(key, keyVersion)
            await publishLocalKey('gnosis', key, walletAccount, keyVersion)
            await new Promise((r) => setTimeout(r, 3000))
            const { remoteKeys, remoteKey } = await wallet.readRemoteKeys(walletAccount)
            setRemoteKeys(remoteKeys)
            setRemoteKey(remoteKey)
            toast.success('Ylide is authorized')
          }
        } else {
          console.log('no account', account, identifier)
          // no account, do nothing
        }
      })()
    }
  }, [
    account,
    identifier,
    authState,
    isPasswordNeeded,
    createLocalKey,
    saveLocalKey,
    publishLocalKey,
    walletAccount,
    wallet,
  ])

  const enterPasswordDialogRef = useRef<ReturnType<typeof useDialog>>()
  const enterPasswordCallbackRef = useRef<(result: boolean) => void>()
  const enterPasswordDialogParams = useMemo(
    () => ({
      onOpen: (callback?: () => boolean) => {
        enterPasswordCallbackRef.current = callback
      },
      onClose: async (e: any, password: string | null) => {
        if (!password) {
          return enterPasswordCallbackRef.current?.(false)
        }
        if (authState === AuthState.HAS_REMOTE_BUT_NO_LOCAL_KEY) {
          const result = await createLocalKey(password)
          if (!result) {
            // so sad :( weird case, wait for user to try to read some message
            return enterPasswordCallbackRef.current?.(false)
          }
          const { key, keyVersion } = result
          if (isBytesEqual(key.publicKey, remoteKey.publicKey.bytes)) {
            await saveLocalKey(key, keyVersion)
            toast.success('Ylide is authorized')
            enterPasswordCallbackRef.current?.(true)
          } else {
            toast.error('Wrong password, please, try again')
            enterPasswordDialogRef.current?.open(enterPasswordCallbackRef.current)
          }
        }
      },
    }),
    [authState, createLocalKey, enterPasswordDialogRef, remoteKey, saveLocalKey]
  )
  const enterPasswordDialog = useDialog(enterPasswordDialogParams)
  useEffect(() => {
    enterPasswordDialogRef.current = enterPasswordDialog
  }, [enterPasswordDialog])

  const forceAuth = useCallback(async () => {
    console.log('forceAuth', authState)
    if (authState === AuthState.AUTHORIZED) {
      return true
    } else if (authState === AuthState.NO_REMOTE_KEY || authState === AuthState.HAS_REMOTE_BUT_NO_LOCAL_KEY) {
      return await new Promise<boolean>(enterPasswordDialog.open)
    } else {
      return false
    }
  }, [authState, enterPasswordDialog.open])

  useEffect(() => {
    console.log('authState changed', authState)
  }, [authState])

  const decodeMessage = useCallback(
    async (msgId: string, msg: IMessage, recepient: IGenericAccount) => {
      const content = await ylide.core.getMessageContent(msg)
      if (!content || content.corrupted) {
        toast.error('Content is not available or corrupted')
        return
      }

      const result = msg.isBroadcast
        ? ylide.core.decryptBroadcastContent(msg, content as IMessageContent)
        : await ylide.core.decryptMessageContent(recepient, msg, content as IMessageContent)

      return {
        msgId,
        decodedSubject: result.content.subject,
        decodedTextData: result.content.content,
      } as YlideDecodedMessage
    },
    [ylide.core]
  )

  const [activeNetwork, setActiveNetwork] = useState<EVMNetwork>()

  useEffect(() => {
    if (wallet) {
      const handlerBlockchain = (chainNameOrId: string) => {
        console.log('BLOCKCHAIN_CHANGED', chainNameOrId)
        setActiveNetwork(evmNameToNetwork(chainNameOrId))
      }
      wallet.controller.on(WalletEvent.BLOCKCHAIN_CHANGED, handlerBlockchain)
      return () => {
        wallet.controller.off(WalletEvent.BLOCKCHAIN_CHANGED, handlerBlockchain)
      }
    }
  }, [wallet])

  useEffect(() => {
    let isCancelled = false

    wallet?.controller.getCurrentBlockchain().then((blockchain) => {
      if (isCancelled) return
      setActiveNetwork(evmNameToNetwork(blockchain))
    })

    return () => {
      isCancelled = true
    }
  }, [wallet])

  const evmNetworkCallbackRef = useRef<(network?: EVMNetwork) => void>()
  const chooseEvmNetworkDialog = useDialog({
    onOpen: (callback?: (network?: EVMNetwork) => void) => {
      evmNetworkCallbackRef.current = callback
    },
    onClose: async (network?: EVMNetwork) => {
      if (network != null && activeNetwork != network) {
        await switchEVMChain(wallet!.controller as EthereumWalletController, network)
      }

      evmNetworkCallbackRef.current?.(network)
    },
  })

  const mailingFeedId = '0000000000000000000000000000000000000000000000000000000000000002' as Uint256 // ISME const
  const uniqueFeedId = '0000000000000000000000000000000000000000000000000000000000000117' as Uint256 // ISME const

  const sendMessage = useCallback(
    async ({ recipients, content }: { recipients: string[]; content: MessageContentV4 }) => {
      if (!wallet || !walletAccount || activeNetwork == null) {
        throw new Error('No account')
      }

      return await ylide.core.sendMessage(
        {
          wallet: wallet.controller,
          sender: walletAccount,
          content,
          recipients,
          serviceCode: ServiceCode.MAIL,
          feedId: mailingFeedId,
        },
        {
          network: activeNetwork,
        }
      )
    },
    [activeNetwork, wallet, walletAccount, ylide.core]
  )

  const broadcastMessage = useCallback(
    async ({ content }: { content: MessageContentV4 }) => {
      if (!wallet || !walletAccount) {
        throw new Error('No account')
      }

      const network = await new Promise((resolve) => chooseEvmNetworkDialog.open(resolve))

      if (network == null) {
        throw new Error('Network not selected')
      }

      return await ylide.core.broadcastMessage(
        {
          wallet: wallet.controller,
          sender: walletAccount,
          content,
          serviceCode: 5, // ISME const
          feedId: uniqueFeedId,
        },
        {
          network,
          isPersonal: true,
        }
      )
    },
    [chooseEvmNetworkDialog, wallet, walletAccount, ylide.core]
  )

  return {
    enterPasswordDialog,

    isLoading,
    authState,
    walletAccount,

    remoteKey,
    remoteKeys,

    forceAuth,

    createLocalKey,
    saveLocalKey,
    reloadRemoteKeys,
    publishLocalKey,
    getBalancesOf,

    decodeMessage,

    broadcastMessage,
    chooseEvmNetworkDialog,
    activeNetwork,
    setActiveNetwork,
    sendMessage,
  }
}
const { Provider: YlideProvider, createUseContext } = createContext(useYlideService)
export const createYlideContext = createUseContext

export default YlideProvider
