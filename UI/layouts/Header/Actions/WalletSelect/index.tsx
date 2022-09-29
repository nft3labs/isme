import { useUser } from 'domains/data'
import { WalletSelect as WalletSelectManager } from '@nft3sdk/did-manager'
import type { FC } from 'react'
import { createToastifyPromise } from 'app/utils/promise/toastify'
import * as sessionStorage from 'app/utils/cache/sessionStorage'

const WalletSelect: FC = () => {
  const { selectDialog, selectWallet, login, registerDialog } = useUser()
  return (
    <WalletSelectManager
      visible={selectDialog.visible}
      onClose={(wallet) => {
        selectDialog.close()
        if (!wallet) return
        createToastifyPromise(
          selectWallet(wallet).then((address) => {
            if (!address) return Promise.reject()
            setTimeout(() => {
              sessionStorage.setItem('sessionKey', address)
              login().then(({ result, needRegister }) => {
                if (result === false && needRegister === true) {
                  registerDialog.open()
                }
              })
            }, 300)
          })
        )
      }}
    />
  )
}

export default WalletSelect
