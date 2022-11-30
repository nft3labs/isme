import { Fragment } from 'react'
import UI from 'UI/profile'
import Container from '@mui/material/Container'
import Header from 'components/Header'

const IndexPage = (): JSX.Element => {
  return (
    <Fragment>
      <Header title="NFT3 Pass | Edit Profile" />
      <Container sx={{ width: { sm: 1, md: 0.6 }, padding: 0 }}>
        <UI />
      </Container>
    </Fragment>
  )
}

export default IndexPage
