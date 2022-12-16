import Head from 'next/head'

export type HeaderProps = {
  title?: string
  description?: string
  ogDescription?: string
  image?: string
  twitter?: string
}
const Header: FC<HeaderProps> = (props) => {
  const title = props.title || 'ISME | Your Decentralized Identity for Web 3.0'
  const description = props.description || 'ISME is your decentralized identity (DID) for Web 3.0'
  const ogDescription = props.ogDescription || 'Connect everything in the first unified social identity network'
  const image = props.image || 'https://isme.is/logo.svg'
  const twitter = props.twitter || '@nft3com'
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <link rel="icon" href="/favicon.ico" />

      <meta property="og:type" content="website" />
      <meta key="og:site_name" property="og:site_name" content={title} />
      <meta key="og:image" property="og:image" content={image} />
      <meta key="og:description" property="og:description" content={ogDescription} />
      <meta key="og:title" property="og:title" content={title} />
      <meta key="og:url" property="og:url" content="https://isme.is/" />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:site" content={twitter} />
    </Head>
  )
}

export default Header
