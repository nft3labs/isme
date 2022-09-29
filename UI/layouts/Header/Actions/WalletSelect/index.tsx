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
          setTimeout(() => {
            login().then(({ result, needRegister }) => {
              if (result === false && needRegister === true) {
                registerDialog.open()
              }
            })
          }, 300)
        }
        selectDialog.close()
      }}
    />
  )
}

export default WalletSelect
