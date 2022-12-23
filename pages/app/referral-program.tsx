import Header from 'components/Header'
import React, { Fragment } from 'react'
import UI from 'UI/referral-program'
import Container from '@mui/material/Container'

const Page = (): JSX.Element => {
  return (
    <Fragment>
      <Header title='ISME | Referral Program'/>
      <Container sx={{ width: { sm: 1, md: 0.7 }, padding: 0 }}>
        <UI />
      </Container>
    </Fragment>
  )
}

export default Page
