import { useMemo, useState } from 'react'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import Image from 'next/image'

import { useNFT3Wallet, useUser } from 'domains/data'
import { createToastifyPromise } from 'app/utils/promise/toastify'
import { Paragraph, Tiny } from 'components/Typography'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import ETHImg from 'public/eth.svg'
import Alert from '@mui/material/Alert'
import { textCenterEllipsis } from 'app/utils/string/text-center-ellipsis'

const ROOT = styled(Stack)``

const Wallets: FC = () => {
  const { account } = useUser()
  const { accounts, add, remove } = useNFT3Wallet()
  const [loading, setLoading] = useState(false)

  const added = useMemo(() => {
    const index = accounts.findIndex((item) => item.account.toLowerCase() === account?.toLowerCase() && account)
    return index > -1
  }, [accounts, account])

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
      {accounts.map(({ account: wallet }) => {
        return (
          <Stack key={wallet} spacing={1} direction="row">
            <Image src={ETHImg} alt="ETH" />
            <Paragraph>{textCenterEllipsis(wallet)}</Paragraph>
            <Tiny lineHeight="24px">{wallet === account && '(Current)'}</Tiny>
          </Stack>
        )
      })}
      <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
        <Button variant="outlined" disabled={loading || added} onClick={onAdd} startIcon={<AddRoundedIcon />}>
          Add current wallet
        </Button>
        <Button variant="outlined" disabled={loading || accounts.length <= 1} onClick={onRemove}>
          Remove current wallet
        </Button>
      </Stack>
      <Alert severity="info">Switch to another wallet before adding a new one.</Alert>
    </ROOT>
  )
}

export default Wallets
