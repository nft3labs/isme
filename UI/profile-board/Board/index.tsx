import { useMemo } from 'react'
import { styled } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import { Paragraph } from 'components/Typography'
import { useNFT3Assets } from 'domains/data'
import BasicTable from 'components/table/BasicTable'
import NFTCard from 'components/nft/NFTCard'

import { useTable } from './useTable'

const ROOT = styled(Stack)``

const Board: FC = () => {
  const { nfts, tokens } = useNFT3Assets()
  const table = useTable()
  const cards = useMemo(() => {
    if (!nfts) return []
    const t: any[][] = [[]]
    nfts.forEach((d, i) => {
      const index = Math.floor(i / 3)
      if (!t[index]) t[index] = []
      const { id, image_preview_url, name, description } = d
      t[index].push({
        name,
        id,
        description,
        image: image_preview_url,
      })
    })
    return t
  }, [nfts])

  return (
    <ROOT spacing={2}>
      <Paragraph>NFTs</Paragraph>
      {cards.map((card, index) => (
        <Stack spacing={2} direction="row" key={index}>
          {card.map((nft) => (
            <NFTCard key={nft.id} {...nft} />
          ))}
        </Stack>
      ))}
      <Paragraph>Tokens</Paragraph>
      <BasicTable {...{ ...table, data: tokens }} />
    </ROOT>
  )
}

export default Board
