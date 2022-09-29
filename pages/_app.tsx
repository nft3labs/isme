import Head from 'next/head'
import { Provider as StoreProvider } from 'react-redux'
import type { MyAppProps } from 'app'
import App from 'app'
import store from 'store'
import DomainsProvider from 'domains'
import { NFT3Provider } from '@nft3sdk/did-manager'

import 'lib/toastify/styles.css'
import 'simplebar-react/dist/simplebar.min.css'
import '@nft3sdk/did-manager/dist/styles/style.css'

const endpoint = 'https://t0.onebitdev.com/nft3-gateway/'

function MainApp(props: MyAppProps): JSX.Element {
  return (
    <NFT3Provider endpoint={endpoint} silent>
      <StoreProvider store={store}>
        <DomainsProvider>
          <Head>
            <title>NFT3 Pass</title>
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <App {...props} />
        </DomainsProvider>
      </StoreProvider>
    </NFT3Provider>
  )
}

export default MainApp
