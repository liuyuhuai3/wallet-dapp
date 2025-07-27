// components/ChainSelector.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useChainManager } from '../hooks/useChainManager';
import { ChainConfig } from '../types/chain';

interface ChainSelectorProps {
  className?: string;
  showNetworkHealth?: boolean;
  onChainChanged?: (chainConfig: ChainConfig) => void;
  disabled?: boolean;
}

export const ChainSelector: React.FC<ChainSelectorProps> = ({ 
  className = '',
  showNetworkHealth = false,
  onChainChanged,
  disabled = false
}) => {
  const {
    currentChainId,
    currentChainConfig,
    supportedChains,
    isLoading,
    error,
    networkHealth,
    switchChain,
    refreshNetworkHealth,
    clearError
  } = useChainManager();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // 处理链选择
  const handleChainSelect = async (chainId: string) => {
    try {
      await switchChain(chainId);
      setIsOpen(false);
      
      const selectedChain = supportedChains.find(chain => chain.chainId === chainId);
      if (selectedChain && onChainChanged) {
        onChainChanged(selectedChain);
      }
    } catch (err) {
      console.error('Chain switch failed:', err);
      // 错误已经在hook中处理了
    }
  };

  // 处理网络健康检查
  const handleHealthCheck = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await refreshNetworkHealth();
    } catch (err) {
      console.error('Health check failed:', err);
    }
  };

  // 渲染网络健康指示器
  const renderHealthIndicator = (isCurrentChain: boolean = false) => {
    if (!showNetworkHealth) return null;

    const health = isCurrentChain ? networkHealth : undefined;
    const healthColor = health?.isHealthy === true ? '#10b981' : 
                       health?.isHealthy === false ? '#ef4444' : '#6b7280';
    
    return (
      <div 
        className="health-indicator"
        style={{ 
          width: '8px', 
          height: '8px', 
          backgroundColor: healthColor,
          borderRadius: '50%',
          marginLeft: 'auto'
        }}
        title={health?.isHealthy === true ? 
          `Healthy (${health.latency}ms)` : 
          health?.isHealthy === false ? 'Unhealthy' : 'Checking...'}
      />
    );
  };

  // 如果没有当前链配置，显示加载状态
  if (!currentChainConfig) {
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
      {/* 错误提示 */}
      {error && (
        <div className="error-toast" onClick={clearError}>
          <span>⚠️ {error}</span>
          <button onClick={clearError}>×</button>
        </div>
      )}

      {/* 主按钮 */}
      <button
        className={`chain-selector-button ${isOpen ? 'open' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled || isLoading}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {/* 链图标 */}
        {currentChainConfig.iconUrls?.[0] && (
          <img
            src={currentChainConfig.iconUrls[0]}
            alt={currentChainConfig.chainName}
            className="chain-icon"
          />
        )}
        
        {/* 链信息 */}
        <div className="chain-info">
          <span className="chain-name">{currentChainConfig.chainName}</span>
          {showNetworkHealth && networkHealth && (
            <span className="network-status">
              {networkHealth.isHealthy ? 
                `${networkHealth.latency}ms` : 
                'Offline'
              }
            </span>
          )}
        </div>

        {/* 健康指示器 */}
        {renderHealthIndicator(true)}

        {/* 加载指示器或下拉箭头 */}
        <span className="dropdown-indicator">
          {isLoading ? '⏳' : '▼'}
        </span>
      </button>

      {/* 下拉菜单 */}
      {isOpen && (
        <div className="chain-dropdown" role="listbox">
          {/* 网络健康刷新按钮 */}
          {showNetworkHealth && (
            <div className="dropdown-header">
              <span>Select Network</span>
              <button 
                className="refresh-button"
                onClick={handleHealthCheck}
                title="Refresh network health"
              >
                🔄
              </button>
            </div>
          )}

          {/* 链选项列表 */}
          {supportedChains.map((chain) => (
            <button
              key={chain.chainId}
              className={`chain-option ${
                chain.chainId === currentChainId ? 'active' : ''
              }`}
              onClick={() => handleChainSelect(chain.chainId)}
              role="option"
              aria-selected={chain.chainId === currentChainId}
            >
              {/* 链图标 */}
              {chain.iconUrls?.[0] && (
                <img
                  src={chain.iconUrls[0]}
                  alt={chain.chainName}
                  className="chain-icon"
                />
              )}
              
              {/* 链信息 */}
              <div className="chain-details">
                <span className="chain-name">{chain.chainName}</span>
                <span className="chain-currency">
                  {chain.nativeCurrency.symbol}
                </span>
              </div>

              {/* 健康指示器 */}
              {renderHealthIndicator(chain.chainId === currentChainId)}

              {/* 当前链标记 */}
              {chain.chainId === currentChainId && (
                <span className="current-indicator">✓</span>
              )}
            </button>
          ))}

          {/* 空状态 */}
          {supportedChains.length === 0 && (
            <div className="empty-state">
              No networks available
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// 紧凑版本的链选择器
export const CompactChainSelector: React.FC<Omit<ChainSelectorProps, 'showNetworkHealth'>> = (props) => {
  return <ChainSelector {...props} showNetworkHealth={false} />;
};

// 带健康监控的链选择器
export const HealthMonitorChainSelector: React.FC<ChainSelectorProps> = (props) => {
  return <ChainSelector {...props} showNetworkHealth={true} />;
};