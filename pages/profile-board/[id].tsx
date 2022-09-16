import { useMount } from 'app/hooks/useMount'
import { useProfileBoard } from 'domains/data'
import type { GetStaticPaths, GetStaticProps } from 'next'
import React from 'react'
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
  const { setDidname } = useProfileBoard()
  useMount(() => {
    setDidname(props.id)
  })
  return <ProfileBoard />
}

export default IndexPage
