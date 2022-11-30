import Head from 'next/head'
import { Provider as StoreProvider } from 'react-redux'
import type { MyAppProps } from 'app'
import App from 'app'
import store from 'store'
import DomainsProvider from 'domains'
import { NFT3Provider } from '@nft3sdk/did-manager'

import 'lib/toastify/styles.css'
import 'simplebar-react/dist/simplebar.min.css'

export const NFT3Endpoint = 'https://t0.onebitdev.com/nft3-gateway/'

function MainApp(props: MyAppProps): JSX.Element {
  return (
    <NFT3Provider endpoint={NFT3Endpoint} silent>
      <StoreProvider store={store}>
        <DomainsProvider>
          <Head>
          </Head>
          <App {...props} />
        </DomainsProvider>
      </StoreProvider>
    </NFT3Provider>
  )
}

export default MainApp
