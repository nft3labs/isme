import type { FC } from 'react'
import { useCallback, Fragment } from 'react'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import type { WalletType } from '@nft3sdk/did-manager'
import { useTheme } from '@mui/material/styles'
import { useNFT3 } from '@nft3sdk/did-manager'

import { useUser } from 'domains/data'
import { createToastifyPromise } from 'app/utils/promise/toastify'
import Dialog from 'components/Dialog'

import IconMetamask from './MetaMask'
import IconPhantom from './Phantom'
import { useDialog } from 'app/hooks/useDialog'
import Claiming from './Claiming'

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
  const theme = useTheme()
  const { client } = useNFT3()
  const { selectDialog, selectWallet, login, registerDialog, logout, disconnect } = useUser()
  const onLogout = useCallback(() => {
    logout()
    disconnect()
  }, [disconnect, logout])

  const onLogin = useCallback(() => {
    setTimeout(() => {
      login().then(({ result, needRegister }) => {
        if (result) return
        if (needRegister === true) {
          registerDialog.open()
        } else {
          onLogout()
        }
      })
    }, 300)
  }, [login, onLogout, registerDialog])

  const claimingDialog = useDialog({
    beforeClose: (type) => {
      if (type === 'claiming') onLogin()
      else onLogout()
      return Promise.resolve(true)
    },
  })

  const onClick = useCallback(
    (wallet: WalletType) => {
      selectDialog.close()
      if (!wallet) return
      createToastifyPromise(
        selectWallet(wallet)
          .then((address) => {
            if (!address) return Promise.reject()
            return client.did.search({
              keyword: address,
              mode: 'address',
            })
          })
          .then((data) => {
            if (data && data[0] && !data[0].ctrlKeys) {
              claimingDialog.open()
            } else {
              onLogin()
            }
          })
      )
    },
    [claimingDialog, client.did, onLogin, selectDialog, selectWallet]
  )

  return (
    <Fragment>
      <Dialog visible={selectDialog.visible} onClose={selectDialog.close} title="Connect Wallet">
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {wallets.map((item, i) => (
            <ListItem
              key={i}
              onClick={() => {
                if (item.check()) {
                  onClick(item.wallet)
                } else window.open(item.link)
              }}
              sx={{
                border: 'solid 1px',
                borderColor: theme.palette.divider,
                borderRadius: 3,
                padding: theme.spacing(3),
                marginBottom: theme.spacing(1),
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: theme.palette.divider,
                },
              }}
            >
              <ListItemText
                primary={item.check() ? item.wallet : `Install ${item.wallet}`}
                sx={{ '& .MuiListItemText-primary': { fontWeight: 'medium' } }}
              />
              <ListItemIcon sx={{ minWidth: 24 }}>
                <item.icon width="24" height="24" />
              </ListItemIcon>
            </ListItem>
          ))}
        </List>
      </Dialog>
      <Claiming dialog={claimingDialog} />
    </Fragment>
  )
}

export default WalletSelect
