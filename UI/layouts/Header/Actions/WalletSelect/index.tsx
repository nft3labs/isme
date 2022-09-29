import { useUser } from 'domains/data'
import { WalletSelect as WalletSelectManager } from '@nft3sdk/did-manager'
import type { FC } from 'react'
import { createToastifyPromise } from 'app/utils/promise/toastify'

const WalletSelect: FC = () => {
  const { selectDialog, selectWallet, login, registerDialog, logout, disconnect } = useUser()
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
              login().then(({ result, needRegister }) => {
                if (result) return
                if (needRegister === true) {
                  registerDialog.open()
                } else {
                  logout()
                  disconnect()
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
