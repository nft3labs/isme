import Header from 'components/Header'
import React, { Fragment } from 'react'
import Home from 'UI/home'

const IndexPage = (): JSX.Element => {
  return (
    <Fragment>
      <Header />
      <Home />
    </Fragment>
  )
}

export default IndexPage
