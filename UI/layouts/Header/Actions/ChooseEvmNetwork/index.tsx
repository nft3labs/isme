import type { FC } from 'react'

import { useYlide } from 'domains/data'
import Dialog from 'components/Dialog'
import { EVMNetwork } from '@ylide/ethereum'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import { useTheme } from '@mui/material/styles'

const networkMeta = [
  { network: EVMNetwork.ETHEREUM, name: 'Ethereum' },
  { network: EVMNetwork.BNBCHAIN, name: 'BNB Chain' },
  { network: EVMNetwork.POLYGON, name: 'Polygon' },
  { network: EVMNetwork.ARBITRUM, name: 'Arbitrum' },
  { network: EVMNetwork.OPTIMISM, name: 'Optimism' },
  { network: EVMNetwork.AVALANCHE, name: 'Avalanche' },
  { network: EVMNetwork.CRONOS, name: 'Cronos' },
  { network: EVMNetwork.FANTOM, name: 'Fantom' },
  { network: EVMNetwork.KLAYTN, name: 'Klaytn' },
  { network: EVMNetwork.GNOSIS, name: 'Gnosis' },
  { network: EVMNetwork.AURORA, name: 'Aurora' },
  { network: EVMNetwork.CELO, name: 'Celo' },
  { network: EVMNetwork.MOONBEAM, name: 'Moonbeam' },
  { network: EVMNetwork.MOONRIVER, name: 'Moonriver' },
  { network: EVMNetwork.METIS, name: 'Metis' },
  { network: EVMNetwork.ASTAR, name: 'Astar' },
]

const ChooseEvmNetwork: FC = () => {
  const theme = useTheme()
  const { chooseEvmNetworkDialog } = useYlide()

  return (
    <Dialog
      visible={chooseEvmNetworkDialog.visible}
      onClose={() => chooseEvmNetworkDialog.close()}
      title="Choose Network"
    >
      <List>
        {networkMeta.map((meta) => (
          <ListItem
            key={meta.network}
            sx={{
              border: 'solid 1px',
              borderColor: theme.palette.divider,
              borderRadius: 3,
              paddingY: theme.spacing(1),
              paddingX: theme.spacing(2),
              marginBottom: theme.spacing(1),
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: theme.palette.divider,
              },
            }}
            onClick={() => chooseEvmNetworkDialog.close(meta.network)}
          >
            {meta.name}
          </ListItem>
        ))}
      </List>
    </Dialog>
  )
}

export default ChooseEvmNetwork
