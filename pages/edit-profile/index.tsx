import { Fragment } from 'react'
import UI from 'UI/profile'
import Container from '@mui/material/Container'
import Head from 'next/head'

const IndexPage = (): JSX.Element => {
  return (
    <Fragment>
      <Head>
        <title>NFT3 Pass | Edit Profile</title>
      </Head>
      <Container sx={{ width: { sm: 1, md: 0.6 }, padding: 0 }}>
        <UI />
      </Container>
    </Fragment>
  )
}

export default IndexPage
