import Dialog from 'components/Dialog'
import { useUser } from 'domains/data'

import Form from './form'

const NFT3Register: FC = () => {
  const { registerDialog, disconnect, logout } = useUser()

  return (
    <Dialog
      visible={registerDialog.visible}
      onClose={() => {
        registerDialog.close()
        logout()
        disconnect()
      }}
      title="Create your DID account"
    >
      <Form />
    </Dialog>
  )
}

export default NFT3Register
