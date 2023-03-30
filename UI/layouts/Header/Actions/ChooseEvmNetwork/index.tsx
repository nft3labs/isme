import type { FC } from 'react'
import { useEffect, useState } from 'react'

import { useUser, useYlide } from 'domains/data'
import Dialog from 'components/Dialog'
import List from '@mui/material/List'
import { useTheme } from '@mui/material/styles'
import type { BlockchainBalances } from '../../../../../domains/data/ylide'
import { chainToNetworkMeta } from '../../../../../domains/data/ylide'
import Box from '@mui/material/Box'
import { ListItemButton } from '@mui/material'
import Stack from '@mui/material/Stack'

const ChooseEvmNetwork: FC = () => {
  const theme = useTheme()
  const { account } = useUser()
  const { chooseEvmNetworkDialog, getBalancesOf } = useYlide()

  const [isLoading, setLoading] = useState(true)
  const [balances, setBalances] = useState<BlockchainBalances>({})
  useEffect(() => {
    ;(async () => {
      if (chooseEvmNetworkDialog.visible && account) {
        setBalances(await getBalancesOf(account))
        setLoading(false)
      } else {
        setBalances({})
        setLoading(true)
      }
    })()
  }, [account, chooseEvmNetworkDialog.visible, getBalancesOf])

  return (
    <Dialog
      visible={chooseEvmNetworkDialog.visible}
      onClose={() => chooseEvmNetworkDialog.close()}
      title="Choose Network"
    >
      <List>
        {isLoading ? (
          <Box display="flex" justifyContent="center" paddingY={3}>
            Loading ...
          </Box>
        ) : (
          Object.keys(balances)
            .sort((a, b) => {
              const balanceA = balances[a]!.numeric
              const balanceB = balances[b]!.numeric
              return balanceA > balanceB ? -1 : balanceA < balanceB ? 1 : 0
            })
            .map((chain) => {
              const balance = balances[chain]!

              return (
                <ListItemButton
                  key={chain}
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
                  disabled={balance.numeric <= 0}
                  onClick={() => chooseEvmNetworkDialog.close(chainToNetworkMeta[chain]!.network)}
                >
                  <Stack direction="row" justifyContent="space-between" spacing={2} width="100%">
                    <Box>{chainToNetworkMeta[chain]!.name}</Box>
                    <Box>{Number(balance.numeric.toFixed(12))}</Box>
                  </Stack>
                </ListItemButton>
              )
            })
        )}
      </List>
    </Dialog>
  )
}

export default ChooseEvmNetwork
