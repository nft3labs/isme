import type {
  AbstractWalletController,
  IGenericAccount,
  WalletControllerFactory,
  Ylide,
  YlideKeyStore,
} from '@ylide/sdk'
import { WalletEvent } from '@ylide/sdk'
import EventEmitter from 'eventemitter3'

export class Wallet extends EventEmitter {
  wallet: string
  factory: WalletControllerFactory
  controller: AbstractWalletController

  private _isAvailable = false

  currentWalletAccount: IGenericAccount | null = null
  currentBlockchain = 'unknown'

  constructor(
    private readonly ylide: Ylide,
    private readonly keystore: YlideKeyStore,
    factory: WalletControllerFactory,
    controller: AbstractWalletController
  ) {
    super()

    this.wallet = factory.wallet
    this.factory = factory
    this.controller = controller
  }

  async init() {
    await this.checkAvailability()

    try {
      this.currentBlockchain = await this.controller.getCurrentBlockchain()
    } catch (err) {
      this.currentBlockchain = 'unknown'
    }
    this.currentWalletAccount = await this.controller.getAuthenticatedAccount()

    this.controller.on(WalletEvent.ACCOUNT_CHANGED, this.handleAccountChanged)
    this.controller.on(WalletEvent.LOGIN, this.handleAccountLogin)
    this.controller.on(WalletEvent.LOGOUT, this.handleAccountLogout)

    this.controller.on(WalletEvent.BLOCKCHAIN_CHANGED, this.handleBlockchainChanged)
  }

  destroy() {
    this.controller.off(WalletEvent.ACCOUNT_CHANGED, this.handleAccountChanged)
    this.controller.off(WalletEvent.LOGIN, this.handleAccountLogin)
    this.controller.off(WalletEvent.LOGOUT, this.handleAccountLogout)

    this.controller.off(WalletEvent.BLOCKCHAIN_CHANGED, this.handleBlockchainChanged)
  }

  handleAccountChanged(newAccount: IGenericAccount) {
    this.currentWalletAccount = newAccount
    this.emit('accountUpdate', this.currentWalletAccount)
  }

  handleAccountLogin(newAccount: IGenericAccount) {
    this.currentWalletAccount = newAccount
    this.emit('accountUpdate', this.currentWalletAccount)
  }

  handleAccountLogout() {
    this.currentWalletAccount = null
    this.emit('accountUpdate', this.currentWalletAccount)
  }

  handleBlockchainChanged(newBlockchain: string) {
    this.currentBlockchain = newBlockchain
  }

  async checkAvailability() {
    this._isAvailable = await this.factory.isWalletAvailable()
  }

  get isAvailable() {
    return this._isAvailable
  }

  async constructLocalKeyV3(account: IGenericAccount) {
    return await this.keystore.constructKeypairV3(
      'New account connection',
      this.factory.blockchainGroup,
      this.factory.wallet,
      account.address
    )
  }

  async constructLocalKeyV2(account: IGenericAccount, password: string) {
    return await this.keystore.constructKeypairV2(
      'New account connection',
      this.factory.blockchainGroup,
      this.factory.wallet,
      account.address,
      password
    )
  }

  async constructLocalKeyV1(account: IGenericAccount, password: string) {
    return await this.keystore.constructKeypairV1(
      'New account connection',
      this.factory.blockchainGroup,
      this.factory.wallet,
      account.address,
      password
    )
  }

  async readRemoteKeys(account: IGenericAccount) {
    const result = await this.ylide.core.getAddressKeys(account.address)

    return {
      remoteKey: result.freshestKey,
      remoteKeys: result.remoteKeys,
    }
  }

  async getCurrentAccount(): Promise<IGenericAccount | null> {
    return this.controller.getAuthenticatedAccount()
  }

  async disconnectAccount(account: IGenericAccount) {
    await this.controller.disconnectAccount(account)
  }

  async connectAccount() {
    let acc = await this.getCurrentAccount()
    if (!acc) {
      acc = await this.controller.requestAuthentication()
    }
    return acc
  }

  //   async instantiateNewAccount(account: IGenericAccount, keypair: YlideKeyPair) {
  //     return new Promise<DomainAccount>(async (resolve) => {
  //       this.domain.accounts.onceNewAccount(account, (acc) => {
  //         resolve(acc)
  //       })
  //       await this.domain.keystore.storeKey(keypair, this.factory.blockchainGroup, this.factory.wallet)
  //     })
  //   }

  //   async getBalancesOf(address: string): Promise<Record<string, { original: string; numeric: number; e18: string }>> {
  //     const chains = this.domain.registeredBlockchains.filter((bc) => bc.blockchainGroup === this.factory.blockchainGroup)
  //     const balances = await Promise.all(
  //       chains.map(async (chain) => {
  //         return this.domain.blockchains[chain.blockchain].getBalance(address)
  //       })
  //     )
  //     return chains.reduce(
  //       (p, c, i) => ({
  //         ...p,
  //         [c.blockchain]: balances[i],
  //       }),
  //       {} as Record<string, { original: string; numeric: number; e18: string }>
  //     )
  //   }

  // async connectNonCurrentAccount() {
  // 	if (this.controller.isMultipleAccountsSupported()) {
  // 		return 'SUGGEST_CHANGE';
  // 	}
  // 	const acc = await this.getCurrentAccount();
  // 	if (acc) {
  // 		await this.controller.disconnectAccount(acc);
  // 	}
  // 	return await this.connectCurrentAccount();
  // }
}
