import { useUser } from 'domains/data'
import { WalletSelect as WalletSelectManager } from '@nft3sdk/did-manager'
import type { FC } from 'react'

const WalletSelect: FC = () => {
  const { selectDialog, selectWallet, login, registerDialog } = useUser()
  return (
    <WalletSelectManager
      visible={selectDialog.visible}
      onClose={(wallet) => {
        if (wallet) {
          selectWallet(wallet)
          login()
            .then(({ result, needRegister }) => {
              if (result === false && needRegister === true) {
                registerDialog.open()
              }
            })
            .catch((e) => {
              console.log('login', e)
            })
        }
        selectDialog.close()
      }}
    />
  )
}

export default WalletSelect
