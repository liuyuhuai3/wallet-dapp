import { QueryClient,QueryClientProvider } from '@tanstack/react-query'
import { useAccount, WagmiProvider } from 'wagmi'
import { config } from './wagmi.config'
import { Account } from './account'
import { WalletOptions } from './wallet-option'
import { SendTransaction } from './send-transaction'

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
      <QueryClientProvider client={queryClient}> 
        {/* 没有子内容的自闭和标签 */}
        <SendTransaction/> 
        <ConnectWallet />
      </QueryClientProvider> 
    </WagmiProvider>
  )
}