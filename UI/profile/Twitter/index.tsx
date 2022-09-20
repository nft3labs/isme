import { styled } from '@mui/material/styles'
import Stack from '@mui/material/Stack'

import BindTwitter from './BindTwitter'
import { useNFT3Social } from 'domains/data'
import TwitterButton from 'components/btn/TwitterButton'

const ROOT = styled(Stack)``

const Twitter: FC = () => {
  const {
    twitter: { account },
  } = useNFT3Social()
  return <ROOT spacing={2}>{account ? <TwitterButton account={account.account} /> : <BindTwitter />}</ROOT>
}

export default Twitter
