import { Fragment } from 'react'

import { useDialog } from 'app/hooks/useDialog'

import TwitterButton from './TwitterButton'
import BindTwitter from './BindTwitter'
import { useNFT3Profile, useNFT3Social } from 'domains/data'

const useDefaultData = () => {
  const { isUser } = useNFT3Profile()
  const {
    twitter: {
      account: { account: twitterAccount },
    },
  } = useNFT3Social()

  return {
    isUser,
    twitterAccount,
  }
}

type TwitterProps = {
  buttonComponent: any
  useData?: () => {
    isUser: boolean
    twitterAccount: string
  }
}
const Twitter: FC<TwitterProps> = ({ buttonComponent, useData }) => {
  const { visible, open, close } = useDialog()
  useData = useData || useDefaultData
  return (
    <Fragment>
      <TwitterButton open={open} component={buttonComponent} useData={useData} />
      <BindTwitter visible={visible} close={close} />
    </Fragment>
  )
}

export default Twitter
