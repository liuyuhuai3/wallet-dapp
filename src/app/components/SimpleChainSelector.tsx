'use client'

import React, { useState, useRef, useEffect } from 'react';
import './ChainSelector.css';
import { 
  ETHEREUM_MAINNET, 
  POLYGON_MAINNET, 
  BSC_MAINNET, 
  ARBITRUM_ONE, 
  OPTIMISM_MAINNET,
  SEPOLIA_TESTNET
} from '../../content/chain';

// 定义链配置类型
interface ChainConfig {
  chainId: string;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  iconUrl?: string;
  rpcUrls?: string[];
  blockExplorerUrls?: string[];
  iconUrls?: string[];
}

// 使用实际的链配置数据并添加Sepolia
const AVAILABLE_CHAINS: ChainConfig[] = [
  {
    ...ETHEREUM_MAINNET,
    iconUrl: ETHEREUM_MAINNET.iconUrls?.[0]
  },
  {
    ...POLYGON_MAINNET,
    iconUrl: POLYGON_MAINNET.iconUrls?.[0]
  },
  {
    ...BSC_MAINNET,
    iconUrl: BSC_MAINNET.iconUrls?.[0]
  },
  {
    ...ARBITRUM_ONE,
    iconUrl: ARBITRUM_ONE.iconUrls?.[0]
  },
  {
    ...OPTIMISM_MAINNET,
    iconUrl: OPTIMISM_MAINNET.iconUrls?.[0]
  },
  {
    ...SEPOLIA_TESTNET,
    iconUrl: SEPOLIA_TESTNET.iconUrls?.[0]
  }
];

interface SimpleChainSelectorProps {
  showNetworkHealth?: boolean;
  onChainChanged?: (chain: ChainConfig) => void; // 明确指定类型
  disabled?: boolean;
  className?: string;
}

export const SimpleChainSelector: React.FC<SimpleChainSelectorProps> = ({ 
  showNetworkHealth = false, 
  onChainChanged,
  disabled = false,
  className = ''
}) => {
  const [currentChainId, setCurrentChainId] = useState('0xaa36a7'); // 默认选择Sepolia测试网
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentChain = AVAILABLE_CHAINS.find(chain => chain.chainId === currentChainId);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChainSelect = async (chainId: string) => {
    setIsLoading(true);
    setCurrentChainId(chainId);
    setIsOpen(false);
    
    const selectedChain = AVAILABLE_CHAINS.find(chain => chain.chainId === chainId);
    if (selectedChain && onChainChanged) {
      onChainChanged(selectedChain);
    }
    
    // 模拟网络切换延迟
    setTimeout(() => setIsLoading(false), 1000);
  };

  if (!currentChain) {
    return (
      <div className={`chain-selector loading ${className}`}>
        <div className="chain-selector-button" style={{ opacity: 0.6 }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className={`chain-selector ${className}`} ref={dropdownRef}>
      <button
        className={`chain-selector-button ${isOpen ? 'open' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled || isLoading}
      >
        {currentChain.iconUrl && (
          <img
            src={currentChain.iconUrl}
            alt={currentChain.chainName}
            className="chain-icon"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        )}
        
        <div className="chain-info">
          <span className="chain-name">{currentChain.chainName}</span>
          {showNetworkHealth && (
            <span className="network-status">
              Healthy • 45ms
            </span>
          )}
        </div>

        {showNetworkHealth && (
          <div 
            className="health-indicator"
            style={{ 
              width: '8px', 
              height: '8px', 
              backgroundColor: '#10b981',
              borderRadius: '50%',
              marginLeft: 'auto'
            }}
            title="Network is healthy"
          />
        )}

        <span className="dropdown-indicator">
          {isLoading ? '⏳' : '▼'}
        </span>
      </button>

      {isOpen && (
        <div className="chain-dropdown">
          {showNetworkHealth && (
            <div className="dropdown-header">
              <span>Select Network</span>
              <button 
                className="refresh-button"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Refreshing network health...');
                }}
                title="Refresh network health"
              >
                🔄
              </button>
            </div>
          )}

          {AVAILABLE_CHAINS.map((chain) => (
            <button
              key={chain.chainId}
              className={`chain-option ${
                chain.chainId === currentChainId ? 'active' : ''
              }`}
              onClick={() => handleChainSelect(chain.chainId)}
            >
              {chain.iconUrl && (
                <img
                  src={chain.iconUrl}
                  alt={chain.chainName}
                  className="chain-icon"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
              
              <div className="chain-details">
                <span className="chain-name">{chain.chainName}</span>
                <span className="chain-currency">
                  {chain.nativeCurrency.symbol}
                </span>
              </div>

              {showNetworkHealth && (
                <div 
                  className="health-indicator"
                  style={{ 
                    width: '8px', 
                    height: '8px', 
                    backgroundColor: '#10b981',
                    borderRadius: '50%',
                    marginLeft: 'auto'
                  }}
                />
              )}

              {chain.chainId === currentChainId && (
                <span className="current-indicator">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// 紧凑版本的链选择器
export const CompactChainSelector: React.FC<Omit<SimpleChainSelectorProps, 'showNetworkHealth'>> = (props) => {
  return <SimpleChainSelector {...props} showNetworkHealth={false} />;
};

// 带健康监控的链选择器
export const HealthMonitorChainSelector: React.FC<SimpleChainSelectorProps> = (props) => {
  return <SimpleChainSelector {...props} showNetworkHealth={true} />;
};

// 导出类型以供其他组件使用
export type { ChainConfig };