// hooks/useChainManager.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { ChainManager } from '../services/ChainManager';
import { ChainConfig } from '../types/chain';
import { NetworkHealth } from '../types/network';
import { TransactionRequest, TransactionReceipt } from '../types/transaction';

// 全局单例实例
let chainManagerInstance: ChainManager | null = null;

interface UseChainManagerReturn {
  // 状态
  currentChainId: string;
  currentChainConfig: ChainConfig | undefined;
  supportedChains: ChainConfig[];
  isLoading: boolean;
  error: string | null;
  networkHealth: NetworkHealth | undefined;

  // 方法
  switchChain: (chainId: string) => Promise<void>;
  addChain: (chainConfig: ChainConfig) => Promise<void>;
  removeChain: (chainId: string) => Promise<void>;
  checkNetworkHealth: (chainId?: string) => Promise<NetworkHealth>;
  getBalance: (address: string, chainId?: string) => Promise<string>;
  getGasPrice: (chainId?: string) => Promise<string>;
  estimateGas: (transaction: TransactionRequest, chainId?: string) => Promise<string>;
  sendTransaction: (transaction: TransactionRequest, chainId?: string) => Promise<TransactionReceipt>;
  getTransactionReceipt: (txHash: string, chainId?: string) => Promise<TransactionReceipt | null>;
  refreshNetworkHealth: () => Promise<void>;
  clearError: () => void;

  // 实例访问（高级用法）
  chainManager: ChainManager;
}

export const useChainManager = (initialChainId?: string): UseChainManagerReturn => {
  // 状态管理
  const [currentChainId, setCurrentChainId] = useState<string>('0x1');
  const [currentChainConfig, setCurrentChainConfig] = useState<ChainConfig | undefined>();
  const [supportedChains, setSupportedChains] = useState<ChainConfig[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [networkHealth, setNetworkHealth] = useState<NetworkHealth | undefined>();

  // 防止重复初始化
  const isInitialized = useRef(false);

  // 初始化ChainManager实例
  useEffect(() => {
    if (!chainManagerInstance && !isInitialized.current) {
      chainManagerInstance = new ChainManager(initialChainId);
      isInitialized.current = true;
    }

    if (chainManagerInstance) {
      // 初始化状态
      setCurrentChainId(chainManagerInstance.getCurrentChainId());
      setCurrentChainConfig(chainManagerInstance.getCurrentChainConfig());
      setSupportedChains(chainManagerInstance.getSupportedChains());

      // 事件监听器
      const handleChainChanged = (data: any) => {
        setCurrentChainId(data.currentChainId);
        setCurrentChainConfig(data.chainConfig);
        setError(null);
        
        // 检查新链的网络健康状态
        chainManagerInstance?.checkNetworkHealth(data.currentChainId)
          .then(setNetworkHealth)
          .catch(console.error);
      };

      const handleChainAdded = (data: any) => {
        setSupportedChains(prev => [...prev, data.chainConfig]);
        setError(null);
      };

      const handleNetworkError = (data: any) => {
        setError(`Network error on chain ${data.chainId}: ${data.error.message}`);
        setIsLoading(false);
      };

      // 注册事件监听器
      chainManagerInstance.on('chainChanged', handleChainChanged);
      chainManagerInstance.on('chainAdded', handleChainAdded);
      chainManagerInstance.on('networkError', handleNetworkError);

      // 初始健康检查
      chainManagerInstance.checkNetworkHealth()
        .then(setNetworkHealth)
        .catch(console.error);

      // 清理函数
      return () => {
        chainManagerInstance?.off('chainChanged', handleChainChanged);
        chainManagerInstance?.off('chainAdded', handleChainAdded);
        chainManagerInstance?.off('networkError', handleNetworkError);
      };
    }
  }, [initialChainId]);

  // 包装异步操作的通用函数
  const wrapAsyncOperation = useCallback(async <T>(
    operation: () => Promise<T>,
    errorMessage: string = 'Operation failed'
  ): Promise<T> => {
    if (!chainManagerInstance) {
      throw new Error('ChainManager not initialized');
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await operation();
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : errorMessage;
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 切换链
  const switchChain = useCallback(async (chainId: string) => {
    return wrapAsyncOperation(
      () => chainManagerInstance!.switchChain(chainId),
      `Failed to switch to chain ${chainId}`
    );
  }, [wrapAsyncOperation]);

  // 添加链
  const addChain = useCallback(async (chainConfig: ChainConfig) => {
    return wrapAsyncOperation(
      () => chainManagerInstance!.addChain(chainConfig),
      `Failed to add chain ${chainConfig.chainName}`
    );
  }, [wrapAsyncOperation]);

  // 移除链
  const removeChain = useCallback(async (chainId: string) => {
    return wrapAsyncOperation(
      async () => {
        chainManagerInstance!.removeChain(chainId);
        setSupportedChains(prev => prev.filter(chain => chain.chainId !== chainId));
      },
      `Failed to remove chain ${chainId}`
    );
  }, [wrapAsyncOperation]);

  // 检查网络健康状态
  const checkNetworkHealth = useCallback(async (chainId?: string) => {
    return wrapAsyncOperation(
      () => chainManagerInstance!.checkNetworkHealth(chainId),
      'Failed to check network health'
    );
  }, [wrapAsyncOperation]);

  // 刷新网络健康状态
  const refreshNetworkHealth = useCallback(async () => {
    try {
      const health = await checkNetworkHealth();
      setNetworkHealth(health);
    } catch (error) {
      console.error('Failed to refresh network health:', error);
    }
  }, [checkNetworkHealth]);

  // 获取余额
  const getBalance = useCallback(async (address: string, chainId?: string) => {
    return wrapAsyncOperation(
      () => chainManagerInstance!.getBalance(address, chainId),
      'Failed to get balance'
    );
  }, [wrapAsyncOperation]);

  // 获取Gas价格
  const getGasPrice = useCallback(async (chainId?: string) => {
    return wrapAsyncOperation(
      () => chainManagerInstance!.getGasPrice(chainId),
      'Failed to get gas price'
    );
  }, [wrapAsyncOperation]);

  // 估算Gas
  const estimateGas = useCallback(async (transaction: TransactionRequest, chainId?: string) => {
    return wrapAsyncOperation(
      () => chainManagerInstance!.estimateGas(transaction, chainId),
      'Failed to estimate gas'
    );
  }, [wrapAsyncOperation]);

  // 发送交易
  const sendTransaction = useCallback(async (transaction: TransactionRequest, chainId?: string) => {
    return wrapAsyncOperation(
      () => chainManagerInstance!.sendTransaction(transaction, chainId),
      'Failed to send transaction'
    );
  }, [wrapAsyncOperation]);

  // 获取交易回执
  const getTransactionReceipt = useCallback(async (txHash: string, chainId?: string) => {
    return wrapAsyncOperation(
      () => chainManagerInstance!.getTransactionReceipt(txHash, chainId),
      'Failed to get transaction receipt'
    );
  }, [wrapAsyncOperation]);

  // 清除错误
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // 状态
    currentChainId,
    currentChainConfig,
    supportedChains,
    isLoading,
    error,
    networkHealth,

    // 方法
    switchChain,
    addChain,
    removeChain,
    checkNetworkHealth,
    getBalance,
    getGasPrice,
    estimateGas,
    sendTransaction,
    getTransactionReceipt,
    refreshNetworkHealth,
    clearError,

    // 实例访问
    chainManager: chainManagerInstance!
  };
};

// 获取ChainManager实例的工具函数
export const getChainManagerInstance = (): ChainManager | null => {
  return chainManagerInstance;
};

// 销毁ChainManager实例（用于测试或应用关闭时）
export const destroyChainManagerInstance = (): void => {
  if (chainManagerInstance) {
    chainManagerInstance.destroy();
    chainManagerInstance = null;
  }
};