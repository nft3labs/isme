import Head from 'next/head'
import { Provider as StoreProvider } from 'react-redux'
import type { MyAppProps } from 'app'
import App from 'app'
import store from 'store'
import DomainsProvider from 'domains'
import { NFT3Provider } from '@nft3sdk/did-manager'

import 'lib/toastify/styles.css'
import 'simplebar-react/dist/simplebar.min.css'

const endpoint = 'https://t0.onebitdev.com/nft3-gateway/'

function MainApp(props: MyAppProps): JSX.Element {
  return (
    <NFT3Provider endpoint={endpoint} silent>
      <StoreProvider store={store}>
        <DomainsProvider>
          <Head>
            <title>NFT3 Pass | Your Decentralized Identity for Web 3.0</title>
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
            <link rel="icon" href="/favicon.ico" />
            <meta name="description" content="NFT3 Pass is your decentralized identity (DID) for Web 3.0" />

            <meta property="og:type" content="website" />
            <meta property="og:site_name" content="NFT3 Pass | Your Decentralized Identity for Web 3.0" />
            <meta property="og:image" content="https://pass.nft3.com/logo.svg" />
            <meta property="og:description" content="Connect everything in the first unified social idendity network" />
            <meta property="og:title" content="NFT3 Pass" />
            <meta property="og:url" content="https://pass.nft3.com/" />

            <meta name="twitter:card" content="summary" />
            <meta name="twitter:title" content="NFT3 Pass | Your Decentralized Identity for Web 3.0" />
            <meta name="twitter:site" content="@nft3com" />
          </Head>
          <App {...props} />
        </DomainsProvider>
      </StoreProvider>
    </NFT3Provider>
  )
}

export default MainApp
