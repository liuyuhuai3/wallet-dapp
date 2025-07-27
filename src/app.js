import { QueryClient,QueryClientProvider } from '@tanstack/react-query'
import { useAccount, WagmiProvider } from 'wagmi'
import { config } from './wagmi.config'
import { Account } from './app/components/account'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { SendTransaction } from './app/components/send-transaction'

const queryClient = new QueryClient()

function ConnectWallet(){
    const {isConnected} = useAccount()
    if (isConnected) return <Account />
    return <WalletOptions />
}

function App() {
  // 3. Wrap app with Wagmi and React Query context.
  return (
    <WagmiProvider config={config}>
      <RainbowKitProvider chains={chains}>
        <ConnectButton />
      </RainbowKitProvider>
    </WagmiProvider>
  )
}

export default App;