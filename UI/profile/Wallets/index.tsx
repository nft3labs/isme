import { useMemo, useState, useCallback } from 'react'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import Image from 'next/image'

import { useNFT3Wallet, useUser } from 'domains/data'
import { createToastifyPromise } from 'app/utils/promise/toastify'
import { Paragraph, Tiny } from 'components/Typography'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import Alert from '@mui/material/Alert'
import { textCenterEllipsis } from 'app/utils/string/text-center-ellipsis'

const ROOT = styled(Stack)``

const Wallets: FC = () => {
  const { account, chainId } = useUser()
  const { accounts, add, remove } = useNFT3Wallet()
  const [loading, setLoading] = useState(false)

  const getChainId = useCallback((name: string) => {
    switch (name.toLowerCase()) {
      case 'polygon':
        return 137
      case 'bnb':
        return 56
      case 'arb':
        return 42161
      case 'op':
        return 10
      default:
        return 1
    }
  }, [])

  const added = useMemo(() => {
    if (!account) return false
    const index = accounts.findIndex(
      (item) => item.account.toLowerCase() === account?.toLowerCase() && getChainId(item.network) === chainId
    )
    return index > -1
  }, [accounts, account, chainId, getChainId])

  const onAdd = async () => {
    setLoading(true)
    createToastifyPromise(add()).finally(() => {
      setLoading(false)
    })
  }

  const onRemove = async () => {
    setLoading(true)
    createToastifyPromise(remove()).finally(() => {
      setLoading(false)
    })
  }

  return (
    <ROOT spacing={2}>
      {accounts.map(({ account: wallet, icon, network }) => {
        return (
          <Stack key={wallet} spacing={1} direction="row">
            <Image src={icon} alt={wallet} width={16} height={16} />
            <Paragraph>{textCenterEllipsis(wallet)}</Paragraph>
            <Tiny lineHeight="24px">{wallet === account && getChainId(network) === chainId && '(Current)'}</Tiny>
          </Stack>
        )
      })}
      <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
        <Button
          variant="outlined"
          disabled={loading || added || !account}
          onClick={onAdd}
          startIcon={<AddRoundedIcon />}
        >
          Add current wallet
        </Button>
        <Button variant="outlined" disabled={loading || accounts.length <= 1 || !added} onClick={onRemove}>
          Remove current wallet
        </Button>
      </Stack>
      <Alert severity="info">
        Before adding a new one, switch to another address first, or disconnect the current wallet, and then login
        through another wallet.
      </Alert>
    </ROOT>
  )
}

export default Wallets
