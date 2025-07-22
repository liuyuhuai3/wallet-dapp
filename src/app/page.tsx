'use client'

import { WagmiProvider } from 'wagmi'
import { config } from '../../wagmi.config'
import { WalletOptions } from '../../wallet-option'
import ReadContract from '../../read-contract'  
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { darkTheme } from '@rainbow-me/rainbowkit'

export default function Home() {
  return (
    <WagmiProvider config={config}>
      <RainbowKitProvider
        theme={darkTheme({
          accentColor: '#ff0000',
          borderRadius: 'small',
        })}
      >
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
          <h1 className="text-2xl font-bold mb-4">Wallet DApp</h1>
          <ConnectButton />
          <WalletOptions />
          <ReadContract />
        </div>
      </RainbowKitProvider>
    </WagmiProvider>
  )
}
