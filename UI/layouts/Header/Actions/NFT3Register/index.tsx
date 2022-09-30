import Dialog from 'components/Dialog'
import { useUser } from 'domains/data'

import Form from './form'

const NFT3Register: FC = () => {
  const { registerDialog, disconnect } = useUser()

  return (
    <Dialog
      visible={registerDialog.visible}
      onClose={() => {
        registerDialog.close()
        disconnect()
      }}
      title="Create your DID account"
    >
      <Form />
    </Dialog>
  )
}

export default NFT3Register
