// wagmi.config.ts
import { createConfig,http,createStorage } from 'wagmi';
import { mainnet,sepolia } from 'wagmi/chains';
import { createClient } from 'viem'
import { metaMask,injected,walletConnect,safe } from 'wagmi/connectors';

const projectId = 'WALLETCONNECT_PROJECT_ID'

export const config=createConfig({
  chains:[mainnet,sepolia],
  connectors:[
    injected(),
    walletConnect({projectId}),
    metaMask(),
    safe(),
  ],
  transports:{
    [mainnet.id]:http(),
    [sepolia.id]:http(),
  },
})