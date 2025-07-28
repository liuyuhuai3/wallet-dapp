'use client'

import { WagmiProvider } from 'wagmi'
import { config } from '../../wagmi.config'
import { WalletOptions } from '../../../wallet-option'
import ReadContract from '../../../read-contract'  
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { darkTheme } from '@rainbow-me/rainbowkit'
import { MintNFT } from '../../../mint-nft'
// 修复导入路径 - 从 app/page 到 components
import { 
  SimpleChainSelector, 
  HealthMonitorChainSelector, 
  CompactChainSelector,
  type ChainConfig 
} from '../components/SimpleChainSelector'

export default function Home() {
  // 定义链变更处理函数，明确指定参数类型
  const handleChainChange = (chain: ChainConfig) => {
    console.log('Chain changed to:', chain.chainName);
  };

  const handleHeaderChainChange = (chain: ChainConfig) => {
    console.log('Header chain changed to:', chain.chainName);
  };

  const handleBasicChainChange = (chain: ChainConfig) => {
    console.log('Basic selector changed to:', chain.chainName);
  };

  const handleCompactChainChange = (chain: ChainConfig) => {
    console.log('Compact selector changed to:', chain.chainName);
  };

  const handleHealthMonitorChainChange = (chain: ChainConfig) => {
    console.log('Health monitor selector changed to:', chain.chainName);
  };

  return (
    <WagmiProvider config={config}>
      <RainbowKitProvider
        theme={darkTheme({
          accentColor: '#ff0000',
          borderRadius: 'small',
        })}
      >
        <div className="min-h-screen bg-gray-100">
          {/* 顶部导航栏 */}
          <nav className="bg-white shadow-sm border-b border-gray-200 px-4 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                🔗 Multi-Chain Wallet DApp
              </h1>
              
              {/* 右侧工具栏 */}
              <div className="flex items-center space-x-4">
                {/* 链选择器 */}
                <HealthMonitorChainSelector 
                  onChainChanged={handleHeaderChainChange}
                />
                
                {/* 钱包连接按钮 */}
                <ConnectButton />
              </div>
            </div>
          </nav>

          {/* 主要内容区域 */}
          <main className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid gap-8">
              
              {/* 欢迎卡片 */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  欢迎使用多链钱包DApp
                </h2>
                <p className="text-gray-600 mb-4">
                  连接你的钱包，体验跨链功能。支持以太坊、Polygon、BSC、Arbitrum、Optimism等主流区块链。
                </p>
                <div className="flex items-center space-x-4">
                  <WalletOptions />
                </div>
              </div>

              {/* 链管理演示卡片 */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6 text-gray-800">
                  🔗 链选择器演示
                </h2>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* 基础版链选择器 */}
                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-700">基础版本</h3>
                    <SimpleChainSelector 
                      onChainChanged={handleBasicChainChange}
                    />
                    <p className="text-sm text-gray-500">
                      简洁的链选择器，只显示基本信息
                    </p>
                  </div>

                  {/* 紧凑版链选择器 */}
                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-700">紧凑版本</h3>
                    <CompactChainSelector 
                      onChainChanged={handleCompactChainChange}
                    />
                    <p className="text-sm text-gray-500">
                      紧凑设计，适合小空间使用
                    </p>
                  </div>

                  {/* 健康监控版链选择器 */}
                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-700">健康监控版本</h3>
                    <HealthMonitorChainSelector 
                      onChainChanged={handleHealthMonitorChainChange}
                    />
                    <p className="text-sm text-gray-500">
                      显示网络健康状态和延迟信息
                    </p>
                  </div>
                </div>

                {/* 功能说明 */}
                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">🚀 链选择器功能特性</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• 支持 5 条主流区块链网络</li>
                    <li>• 实时网络健康状态监控</li>
                    <li>• 响应式设计，支持移动端</li>
                    <li>• 优雅的下拉菜单交互</li>
                    <li>• 深色模式自动适配</li>
                    <li>• 链图标和状态指示器</li>
                  </ul>
                </div>
              </div>

              {/* 现有功能卡片 */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* 合约读取 */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    📖 合约读取
                  </h2>
                  <ReadContract />
                </div>

                {/* NFT铸造 */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    🎨 NFT铸造
                  </h2>
                  <MintNFT />
                </div>
              </div>

              {/* 使用说明卡片 */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                📋 使用说明
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">链选择器位置</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• <strong>页面右上角</strong> - 主链选择器（带健康监控）</li>
                    <li>• <strong>演示区域</strong> - 不同版本的链选择器</li>
                    <li>• <strong>响应式适配</strong> - 自动适应屏幕尺寸</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">支持的网络</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Ethereum Mainnet (ETH)</li>
                    <li>• Polygon Mainnet (MATIC)</li>
                    <li>• BNB Smart Chain (BNB)</li>
                    <li>• Arbitrum One (ETH)</li>
                    <li>• Optimism (ETH)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          </main>

          {/* 页脚 */}
          <footer className="bg-white border-t border-gray-200 py-8 mt-16">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <p className="text-gray-600">
                🚀 多链钱包DApp - 由 Next.js + Wagmi + RainbowKit 驱动
              </p>
              <p className="text-sm text-gray-500 mt-2">
                体验无缝的跨链交互和现代化的Web3用户界面
              </p>
            </div>
          </footer>
        </div>
      </RainbowKitProvider>
    </WagmiProvider>
  )
}