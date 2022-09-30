import arbitrum from './images/arbitrum.svg'
import avax from './images/avax.svg'
import bsc from './images/bsc.svg'
import eth from './images/eth.svg'
import fantom from './images/fantom.svg'
import harmony from './images/harmony.svg'
import moonbeam from './images/moonbeam.svg'
import optimism from './images/optimism.svg'
import solana from './images/solana.svg'
import polygon from './images/polygon.svg'

export const NETWORK_MAP: Record<string, { explorerUrl: string; icon: any; name: string }> = {
  ethereum: {
    explorerUrl: 'https://etherscan.io/',
    icon: eth,
    name: 'ETH',
  },
  'binance-smart-chain': {
    explorerUrl: 'https://bscscan.com/',
    icon: bsc,
    name: 'BSC',
  },
  polygon: {
    explorerUrl: 'https://polygonscan.com/',
    icon: polygon,
    name: 'Polygon',
  },
  arbitrum: {
    explorerUrl: 'https://arbiscan.io/',
    icon: arbitrum,
    name: 'Arbitrum',
  },
  avalanche: {
    explorerUrl: 'https://snowtrace.io/',
    icon: avax,
    name: 'AVAX',
  },
  fantom: {
    explorerUrl: 'https://ftmscan.com/',
    icon: fantom,
    name: 'Fantom',
  },
  harmony: {
    explorerUrl: 'https://explorer.harmony.one/',
    icon: harmony,
    name: 'Harmony',
  },
  optimism: {
    explorerUrl: 'https://optimistic.etherscan.io/',
    icon: optimism,
    name: 'Optimism',
  },
  moonbeam: {
    explorerUrl: 'https://moonscan.io/',
    icon: moonbeam,
    name: 'Moonbeam',
  },
  solana: {
    explorerUrl: 'https://explorer.solana.com/',
    icon: solana,
    name: 'Solana',
  },
}
