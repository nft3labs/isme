import type { FC, PropsWithChildren } from 'react'
import { styled } from '@mui/material/styles'
import Container from '@mui/material/Container'
import Header from './Header'
import Footer from './Footer'

const Content = styled(Container)(() => ({
  minHeight: 'calc(100vh - 256px)',
}))

const ActiveLayout: FC<PropsWithChildren<unknown>> = ({ children }) => {
  return (
    <>
      <Header />
      <Content>{children}</Content>
      <Footer />
    </>
  )
}

export default ActiveLayout
