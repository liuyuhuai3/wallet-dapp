// constants/chains.ts
import { ChainConfig } from '../types/chain';

export const ETHEREUM_MAINNET: ChainConfig = {
  chainId: '0x1',
  chainName: 'Ethereum Mainnet',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: [
    'https://mainnet.infura.io/v3/YOUR_INFURA_KEY',
    'https://eth-mainnet.public.blastapi.io',
    'https://rpc.ankr.com/eth'
  ],
  blockExplorerUrls: ['https://etherscan.io'],
  iconUrls: ['https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png']
};

export const POLYGON_MAINNET: ChainConfig = {
  chainId: '0x89',
  chainName: 'Polygon Mainnet',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18,
  },
  rpcUrls: [
    'https://polygon-rpc.com/',
    'https://rpc.ankr.com/polygon',
    'https://polygon-mainnet.public.blastapi.io'
  ],
  blockExplorerUrls: ['https://polygonscan.com'],
  iconUrls: ['https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png']
};

export const BSC_MAINNET: ChainConfig = {
  chainId: '0x38',
  chainName: 'BNB Smart Chain',
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
  rpcUrls: [
    'https://bsc-dataseed.binance.org/',
    'https://rpc.ankr.com/bsc',
    'https://bsc-mainnet.public.blastapi.io'
  ],
  blockExplorerUrls: ['https://bscscan.com'],
  iconUrls: ['https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/info/logo.png']
};

export const ARBITRUM_ONE: ChainConfig = {
  chainId: '0xa4b1',
  chainName: 'Arbitrum One',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: [
    'https://arb1.arbitrum.io/rpc',
    'https://rpc.ankr.com/arbitrum'
  ],
  blockExplorerUrls: ['https://arbiscan.io'],
  iconUrls: ['https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/info/logo.png']
};

export const OPTIMISM_MAINNET: ChainConfig = {
  chainId: '0xa',
  chainName: 'Optimism',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: [
    'https://mainnet.optimism.io',
    'https://rpc.ankr.com/optimism'
  ],
  blockExplorerUrls: ['https://optimistic.etherscan.io'],
  iconUrls: ['https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/optimism/info/logo.png']
};

export const SUPPORTED_CHAINS: Record<string, ChainConfig> = {
  [ETHEREUM_MAINNET.chainId]: ETHEREUM_MAINNET,
  [POLYGON_MAINNET.chainId]: POLYGON_MAINNET,
  [BSC_MAINNET.chainId]: BSC_MAINNET,
  [ARBITRUM_ONE.chainId]: ARBITRUM_ONE,
  [OPTIMISM_MAINNET.chainId]: OPTIMISM_MAINNET,
};

export const DEFAULT_CHAIN_ID = ETHEREUM_MAINNET.chainId;