import type { EthereumWalletController, EthereumBlockchainController } from '@ylide/ethereum'
import { EVM_CHAINS, EVM_NAMES, evmBlockchainFactories, EVMNetwork, evmWalletFactories } from '@ylide/ethereum'
import type { BlockchainMap, ExternalYlidePublicKey, IGenericAccount, YlideKey, YlideKeyPair } from '@ylide/sdk'
import { BrowserLocalStorage, Ylide, YlideKeyStore, YlideKeyStoreEvent } from '@ylide/sdk'

import { createContext } from 'app/utils/createContext'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNFT3 } from '@nft3sdk/did-manager'
import { blockchainMeta } from './constants'
import { Wallet } from './Wallet'
import { isBytesEqual } from './utils/isBytesEqual'
import { chainIdByFaucetType, publishKeyThroughFaucet, requestFaucetSignature } from './utils/publish-helpers'

export enum AuthState {
  NOT_AUTHORIZED, // no account connected in wallet
  NO_REMOTE_KEY, // no key found for this wallet
  NO_LOCAL_KEY, // remote key found, but no local key
  LOCAL_REMOTE_MISMATCH, // local key found, but remote key is different
  AUTHORIZED, // alles gut
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

const useYlideService = () => {
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

  const [wallet, setWallet] = useState<Wallet>(null)
  // blockchainControllers will be used in future
  const [, setBlockchainControllers] = useState<BlockchainMap<EthereumBlockchainController>>({})
  const [walletAccount, setWalletAccount] = useState<null | IGenericAccount>(null)
  const [keys, setKeys] = useState<YlideKey[]>([])
  const [remoteKeys, setRemoteKeys] = useState<Record<string, ExternalYlidePublicKey | null>>({})
  const [remoteKey, setRemoteKey] = useState<ExternalYlidePublicKey | null>(null)
  const [initialized, setInitialized] = useState(false)

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
  }, [])

  useEffect(() => {
    ;(async () => {
      if (initialized) return
      const availableWallets = await Ylide.getAvailableWallets()
      const registeredBlockchains = Ylide.blockchainsList.map((b) => b.factory)

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
        setWallet(new Wallet(ylide, keystore, genericFactory, newWalletController))
      }

      const controllers: Record<string, EthereumBlockchainController> = {}

      for (const factory of registeredBlockchains) {
        controllers[factory.blockchain] = (await ylide.controllers.addBlockchain(factory.blockchain, {
          dev: false, //document.location.hostname === 'localhost',
        })) as EthereumBlockchainController
      }

      setBlockchainControllers(controllers)
      setInitialized(true)
    })()
  }, [initialized, ylide, wallet, keystore, switchEVMChain])

  const handleKeysUpdate = useCallback((newKeys: YlideKey[]) => {
    setKeys(newKeys)
  }, [])

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
      wallet.on('accountUpdate', (newWalletAccount) => {
        if (newWalletAccount !== lastWalletAccount) {
          lastWalletAccount = newWalletAccount
          setWalletAccount(newWalletAccount)
          setRemoteKey(null)
          setRemoteKeys({})
        }
      })
      await wallet.init()
      lastWalletAccount = wallet.currentWalletAccount
      setWalletAccount(wallet.currentWalletAccount)
    })()
  }, [wallet])

  const reloadRemoteKeys = useCallback(async () => {
    if (!wallet || !walletAccount) return
    const { remoteKeys, remoteKey } = await wallet.readRemoteKeys(walletAccount)
    setRemoteKeys(remoteKeys)
    setRemoteKey(remoteKey)
  }, [wallet, walletAccount])

  useEffect(() => {
    reloadRemoteKeys()
  }, [reloadRemoteKeys])

  // okay, so:
  // 1. walletAccount - current wallet account
  // 2. keys - all available local keys
  // 3. remoteKeys - remote keys for the current account

  const [authState, setAuthState] = useState<AuthState>(AuthState.NOT_AUTHORIZED)

  useEffect(() => {
    if (!walletAccount) {
      setAuthState(AuthState.NOT_AUTHORIZED)
      return
    }
    if (!remoteKey) {
      setAuthState(AuthState.NO_REMOTE_KEY)
      return
    }
    const localKey = keys.find((k) => k.address === walletAccount.address)
    if (!localKey) {
      setAuthState(AuthState.NO_LOCAL_KEY)
      return
    }
    if (!isBytesEqual(localKey.keypair.publicKey, remoteKey.publicKey.bytes)) {
      setAuthState(AuthState.LOCAL_REMOTE_MISMATCH)
      return
    }
    setAuthState(AuthState.AUTHORIZED)
  }, [keys, remoteKey, walletAccount])

  const createLocalKey = useCallback(
    async (password: string, forceNew?: boolean) => {
      let tempLocalKey: YlideKeyPair
      let keyVersion
      try {
        if (forceNew) {
          tempLocalKey = await wallet.constructLocalKeyV2(walletAccount, password)
          keyVersion = 2
        } else if (remoteKey?.keyVersion === 1) {
          // strange... I'm not sure Qamon keys work here
          tempLocalKey = await wallet.constructLocalKeyV1(walletAccount, password) //wallet.constructLocalKeyV1(walletAccount, password);
          keyVersion = 1
        } else if (remoteKey?.keyVersion === 2) {
          // if user already using password - we should use it too
          tempLocalKey = await wallet.constructLocalKeyV2(walletAccount, password)
          keyVersion = 2
        } else if (remoteKey?.keyVersion === 3) {
          // if user is not using password - we should not use it too
          tempLocalKey = await wallet.constructLocalKeyV3(walletAccount)
          keyVersion = 3
        } else {
          // user have no key at all - use passwordless version
          tempLocalKey = await wallet.constructLocalKeyV3(walletAccount)
          keyVersion = 3
        }
        return { key: tempLocalKey, keyVersion }
      } catch (err) {
        console.log('createLocalKey error', err)
        return
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

  const { account, identifier } = useNFT3()

  useEffect(() => {
    if (account && identifier) {
      // TODO
    }
  }, [account, identifier])

  return {
    authState,
    walletAccount,

    remoteKey,
    remoteKeys,

    createLocalKey,
    reloadRemoteKeys,
    publishLocalKey,
  }
}
const { Provider: YlideProvider, createUseContext } = createContext(useYlideService)
export const createYlideContext = createUseContext

export default YlideProvider
