import { useNFT3Profile } from 'domains/data'
import type { GetStaticPaths, GetStaticProps } from 'next'
import React, { useEffect } from 'react'
import ProfileBoard from 'UI/profile-board'

export const getStaticProps: GetStaticProps = (props) => {
  const { id } = props.params
  return {
    props: {
      id: typeof id === 'string' ? id : id[0],
    },
  }
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

const IndexPage: FC<{ id: string }> = (props) => {
  const { setDidname } = useNFT3Profile()

  useEffect(() => {
    setDidname(props.id)
  }, [props.id, setDidname])

  return <ProfileBoard />
}

export default IndexPage
