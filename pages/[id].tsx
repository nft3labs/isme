import { NFT3Client } from '@nft3sdk/client'
import type { ProfileModel, WithMeta } from '@nft3sdk/client'
import { useNFT3, useNFT3Profile } from 'domains/data'
import type { GetServerSideProps } from 'next'
import { useEffect, Fragment } from 'react'
import ProfileBoard from 'UI/profile-board'
import { NFT3Endpoint } from './_app'
import type { HeaderProps } from 'components/Header'
import Header from 'components/Header'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params
  const didname = typeof id === 'string' ? id : id[0]
  const client = new NFT3Client(NFT3Endpoint)
  const did = client.did.convertName(didname)
  const promises = []
  const data: any = {
    profile: undefined,
  }
  promises.push(client.profile.info(did).then((profile) => (data.profile = profile)))

  await Promise.all(promises)

  return {
    props: {
      id: didname,
      ...data,
    },
  }
}

const IndexPage: FC<{ id: string; profile: WithMeta<ProfileModel> }> = (props) => {
  const { id, profile } = props
  const { format } = useNFT3()
  const { setDidname, setProfileInternal } = useNFT3Profile()

  useEffect(() => {
    setDidname(id)
    setProfileInternal(profile)
  }, [id, profile, setDidname, setProfileInternal])

  const headerProps: HeaderProps = {}

  if (profile) {
    headerProps.title = `${id}.isme | NFT3 Pass`
    headerProps.description = profile.bio
    headerProps.ogDescription = headerProps.description
    headerProps.image = format(profile.avatar)
  }

  return (
    <Fragment>
      <Header {...headerProps} />
      <ProfileBoard />
    </Fragment>
  )
}

export default IndexPage
