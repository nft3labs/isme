import { useUser } from 'domains/data'
import { WalletSelect as WalletSelectManager } from '@nft3sdk/did-manager'
import type { FC } from 'react'

const WalletSelect: FC = () => {
  const { selectDialog, selectWallet } = useUser()
  return (
    <WalletSelectManager
      visible={selectDialog.visible}
      onClose={(wallet) => {
        if (wallet) selectWallet(wallet)
        selectDialog.close()
      }}
    />
  )
}

export default WalletSelect
