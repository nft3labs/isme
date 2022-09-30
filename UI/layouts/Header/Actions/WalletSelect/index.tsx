import type { FC } from 'react'
import { useCallback } from 'react'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import type { WalletType } from '@nft3sdk/did-manager'

import { useUser } from 'domains/data'
import { createToastifyPromise } from 'app/utils/promise/toastify'
import Dialog from 'components/Dialog'

import IconMetamask from './MetaMask'
import IconPhantom from './Phantom'
interface IWalletItem {
  wallet: WalletType
  icon: any
  link: string
  check: () => boolean
}
const wallets: IWalletItem[] = [
  {
    wallet: 'MetaMask',
    icon: IconMetamask,
    link: 'https://metamask.io/download/',
    check: () => {
      return 'ethereum' in window
    },
  },
  {
    wallet: 'Phantom',
    icon: IconPhantom,
    link: 'https://phantom.app/download',
    check: () => {
      return 'phantom' in window
    },
  },
]

const WalletSelect: FC = () => {
  const { selectDialog, selectWallet, login, registerDialog, logout, disconnect } = useUser()
  const onClick = useCallback(
    (wallet: WalletType) => {
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
    },
    [disconnect, login, logout, registerDialog, selectDialog, selectWallet]
  )

  return (
    <Dialog visible={selectDialog.visible} onClose={selectDialog.close} title="Connect Wallet">
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {wallets.map((item, i) => (
          <ListItem
            key={i}
            onClick={() => {
              if (item.check()) {
                onClick(item.wallet)
              } else window.open(item.link)
            }}
          >
            <ListItemText primary={item.check() ? item.wallet : `Install ${item.wallet}`} />
            <ListItemIcon>
              <item.icon width="24" height="24" />
            </ListItemIcon>
          </ListItem>
        ))}
      </List>
    </Dialog>
  )
}

export default WalletSelect
