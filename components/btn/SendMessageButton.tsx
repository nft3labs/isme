import Button from '@mui/material/Button'
import type { PropsWithChildren } from 'react'
import { useYlide } from '../../domains/data'
import Stack from '@mui/material/Stack'
import { RoundButton } from './IconButton'
import { blockchainMeta } from '../../domains/data/ylide/constants'
import type { EVMNetwork } from '@ylide/ethereum'
import { EVM_NAMES } from '@ylide/ethereum'

interface SendMessageButtonProps extends PropsWithChildren {
  disabled?: boolean
  onClick?: () => void
}

export const SendMessageButton: FC<SendMessageButtonProps> = ({ children, disabled, onClick }) => {
  const { activeNetwork, setActiveNetwork, chooseEvmNetworkDialog } = useYlide()
  const activeChainMeta = activeNetwork != null ? blockchainMeta[EVM_NAMES[activeNetwork]]! : undefined

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      {!disabled && activeChainMeta && (
        <RoundButton
          title={`Send via ${activeChainMeta.title} (click to change)`}
          onClick={async () => {
            const network = await new Promise<EVMNetwork | undefined>(chooseEvmNetworkDialog.open)
            if (network != null) {
              setActiveNetwork(network)
            }
          }}
        >
          {activeChainMeta.logo(28)}
        </RoundButton>
      )}

      <Button variant="gradient" size="large" disabled={disabled} onClick={() => onClick?.()}>
        {children}
      </Button>
    </Stack>
  )
}
