import { styled } from '@mui/material/styles'
import Stack from '@mui/material/Stack'

import { useNFT3Wallet, useUser } from 'domains/data'
import { useMemo, useState } from 'react'
import Button from '@mui/material/Button'
import { createToastifyPromise } from 'app/utils/promise/toastify'

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
          <div key={wallet}>
            {wallet}
            {wallet === account && '(Current)'}
          </div>
        )
      })}
      {added ? (
        <Button size="large" disabled={loading} onClick={onRemove}>
          Remove this wallet
        </Button>
      ) : (
        <Button size="large" disabled={loading} onClick={onAdd}>
          Add this wallet
        </Button>
      )}
    </ROOT>
  )
}

export default Wallets
