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

export const NETWORK_MAP: Record<string, { exploreUrl: string; icon: any; name: string }> = {
  ethereum: {
    exploreUrl: 'https://etherscan.io/',
    icon: eth,
    name: 'ETH',
  },
  'binance-smart-chain': {
    exploreUrl: 'https://bscscan.com/',
    icon: bsc,
    name: 'BSC',
  },
  polygon: {
    exploreUrl: 'https://polygonscan.com/',
    icon: polygon,
    name: 'Polygon',
  },
  arbitrum: {
    exploreUrl: 'https://arbiscan.io/',
    icon: arbitrum,
    name: 'Arbitrum',
  },
  avalanche: {
    exploreUrl: 'https://snowtrace.io/',
    icon: avax,
    name: 'AVAX',
  },
  fantom: {
    exploreUrl: 'https://ftmscan.com/',
    icon: fantom,
    name: 'Fantom',
  },
  harmony: {
    exploreUrl: 'https://explorer.harmony.one/',
    icon: harmony,
    name: 'Harmony',
  },
  optimism: {
    exploreUrl: 'https://optimistic.etherscan.io/',
    icon: optimism,
    name: 'Optimism',
  },
  moonbeam: {
    exploreUrl: 'https://moonscan.io/',
    icon: moonbeam,
    name: 'Moonbeam',
  },
  solana: {
    exploreUrl: 'https://explorer.solana.com/',
    icon: solana,
    name: 'Solana',
  },
}
