// wagmi.config.ts
import { createConfig,http,createStorage } from 'wagmi';
import { mainnet,sepolia } from 'wagmi/chains';
import { metaMask,injected,walletConnect,safe } from 'wagmi/connectors';
import {getDefaultConfig}from '@rainbow-me/rainbowkit';

const projectId = 'e71e64ce8ced874204ca9b702555b146'

export const chains = [mainnet, sepolia] as const

export const config = getDefaultConfig({
  appName: 'Wallet DApp',
  projectId,
  chains: [mainnet, sepolia],
  ssr: false, // 如果你使用的是 React 而不是 Next.js，可以保持 false
});