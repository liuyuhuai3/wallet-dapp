// wagmi.config.ts
import { createConfig,http,createStorage } from 'wagmi';
import { mainnet,sepolia } from 'wagmi/chains';
import { metaMask,injected,walletConnect,safe } from 'wagmi/connectors';

const projectId = 'e71e64ce8ced874204ca9b702555b146'

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