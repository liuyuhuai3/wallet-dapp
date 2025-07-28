import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAccount, WagmiProvider } from 'wagmi'
import { config, chains } from './wagmi.config'
import { Account } from './app/components/account'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { SendTransaction } from './app/components/send-transaction'
import { ChainSelector, HealthMonitorChainSelector } from './components/ChainSelector'
import './components/ChainSelector.css' // 导入样式

const queryClient = new QueryClient()

function ConnectWallet() {
    const { isConnected } = useAccount()
    if (isConnected) return <Account />
    return <div>Please connect your wallet</div>
}

function DAppContent() {
    const { isConnected } = useAccount()
    
    return (
        <div style={{ 
            maxWidth: '1200px', 
            margin: '0 auto', 
            padding: '20px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
            {/* 头部区域 */}
            <header style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '40px',
                padding: '20px 0',
                borderBottom: '1px solid #e5e7eb'
            }}>
                <h1 style={{ 
                    fontSize: '28px', 
                    fontWeight: 'bold', 
                    color: '#111827',
                    margin: 0
                }}>
                    Multi-Chain DApp
                </h1>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {/* 链选择器 - 带网络健康监控 */}
                    <HealthMonitorChainSelector 
                        onChainChanged={(chainConfig) => {
                            console.log('Chain changed to:', chainConfig.chainName)
                        }}
                    />
                    
                    {/* 钱包连接按钮 */}
                    <ConnectButton />
                </div>
            </header>

            {/* 主要内容区域 */}
            <main>
                {isConnected ? (
                    <div style={{ display: 'grid', gap: '24px' }}>
                        {/* 账户信息卡片 */}
                        <div style={{
                            background: '#ffffff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '12px',
                            padding: '24px',
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                        }}>
                            <h2 style={{ 
                                fontSize: '20px', 
                                fontWeight: '600', 
                                marginBottom: '16px',
                                color: '#111827'
                            }}>
                                Account Information
                            </h2>
                            <Account />
                        </div>

                        {/* 交易功能卡片 */}
                        <div style={{
                            background: '#ffffff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '12px',
                            padding: '24px',
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                        }}>
                            <h2 style={{ 
                                fontSize: '20px', 
                                fontWeight: '600', 
                                marginBottom: '16px',
                                color: '#111827'
                            }}>
                                Send Transaction
                            </h2>
                            <SendTransaction />
                        </div>

                        {/* 链管理演示卡片 */}
                        <div style={{
                            background: '#ffffff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '12px',
                            padding: '24px',
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                        }}>
                            <h2 style={{ 
                                fontSize: '20px', 
                                fontWeight: '600', 
                                marginBottom: '16px',
                                color: '#111827'
                            }}>
                                Chain Management Demo
                            </h2>
                            
                            <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                                {/* 紧凑版链选择器 */}
                                <div>
                                    <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>
                                        Compact Chain Selector
                                    </h3>
                                    <ChainSelector 
                                        showNetworkHealth={false}
                                        onChainChanged={(chainConfig) => {
                                            console.log('Compact selector changed to:', chainConfig.chainName)
                                        }}
                                    />
                                </div>

                                {/* 带健康监控的链选择器 */}
                                <div>
                                    <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>
                                        Health Monitor Chain Selector
                                    </h3>
                                    <HealthMonitorChainSelector 
                                        onChainChanged={(chainConfig) => {
                                            console.log('Health monitor selector changed to:', chainConfig.chainName)
                                        }}
                                    />
                                </div>
                            </div>

                            <div style={{ 
                                marginTop: '20px', 
                                padding: '16px', 
                                background: '#f3f4f6', 
                                borderRadius: '8px',
                                fontSize: '14px',
                                color: '#6b7280'
                            }}>
                                <p style={{ margin: '0 0 8px 0' }}>
                                    <strong>功能说明:</strong>
                                </p>
                                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                                    <li>支持多链切换 (Ethereum, Polygon, BSC, Arbitrum, Optimism)</li>
                                    <li>实时网络健康监控</li>
                                    <li>自动RPC故障转移</li>
                                    <li>交易状态跟踪</li>
                                    <li>Gas价格优化</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* 未连接钱包时的欢迎界面 */
                    <div style={{
                        textAlign: 'center',
                        padding: '80px 20px',
                        background: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                    }}>
                        <h2 style={{ 
                            fontSize: '24px', 
                            fontWeight: '600', 
                            marginBottom: '16px',
                            color: '#111827'
                        }}>
                            Welcome to Multi-Chain DApp
                        </h2>
                        <p style={{ 
                            fontSize: '16px', 
                            color: '#6b7280',
                            marginBottom: '32px',
                            maxWidth: '500px',
                            margin: '0 auto 32px auto'
                        }}>
                            Connect your wallet to start using our multi-chain features. 
                            Switch between different networks and manage your assets seamlessly.
                        </p>
                        
                        {/* 未连接时也显示链选择器作为演示 */}
                        <div style={{ marginBottom: '32px' }}>
                            <p style={{ 
                                fontSize: '14px', 
                                color: '#6b7280',
                                marginBottom: '12px'
                            }}>
                                Preview: Network Selection
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <ChainSelector 
                                    disabled={!isConnected}
                                    showNetworkHealth={true}
                                />
                            </div>
                        </div>

                        <ConnectButton />
                    </div>
                )}
            </main>

            {/* 页脚 */}
            <footer style={{ 
                marginTop: '60px', 
                padding: '20px 0',
                borderTop: '1px solid #e5e7eb',
                textAlign: 'center',
                color: '#6b7280',
                fontSize: '14px'
            }}>
                <p style={{ margin: 0 }}>
                    Multi-Chain DApp - Powered by Wagmi & RainbowKit
                </p>
            </footer>
        </div>
    )
}

function App() {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>
                    <DAppContent />
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
}

export default App;