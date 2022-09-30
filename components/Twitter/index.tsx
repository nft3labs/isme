import { Fragment } from 'react'

import { useDialog } from 'app/hooks/useDialog'

import TwitterButton from './TwitterButton'
import BindTwitter from './BindTwitter'

type TwitterProps = {
  buttonComponent: any
}
const Twitter: FC<TwitterProps> = ({ buttonComponent }) => {
  const { visible, open, close } = useDialog()
  return (
    <Fragment>
      <TwitterButton open={open} component={buttonComponent} />
      <BindTwitter visible={visible} close={close} />
    </Fragment>
  )
}

export default Twitter
