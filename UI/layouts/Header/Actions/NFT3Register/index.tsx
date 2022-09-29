import NFT3Modal from '@nft3sdk/did-manager/dist/es/components/NFT3Modal'
import { useUser } from 'domains/data'

import Form from './form'

const NFT3Register: FC = () => {
  const { registerDialog, disconnect } = useUser()

  return (
    <NFT3Modal
      visible={registerDialog.visible}
      onClose={() => {
        registerDialog.close()
        disconnect()
      }}
      title="Create your DID account"
    >
      <Form />
    </NFT3Modal>
  )
}

export default NFT3Register
