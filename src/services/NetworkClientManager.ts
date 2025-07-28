// services/NetworkClientManager.ts - 完全修复版本
import { NetworkClient, NetworkHealth } from '../types/network';
import { ChainConfig } from '../types/chain';
import { TransactionRequest, TransactionReceipt } from '../types/transaction';

// 标准的 JSON-RPC 请求接口
interface JsonRpcRequest {
  jsonrpc: '2.0';
  method: string;
  params: any[];
  id: number;
}

interface JsonRpcResponse {
  jsonrpc: '2.0';
  result?: any;
  error?: { code: number; message: string; data?: any };
  id: number;
}

// 简单的以太坊 RPC 客户端
class EthereumRpcClient {
  private requestId = 0;

  constructor(private rpcUrl: string) {}

  async request(method: string, params: any[] = []): Promise<any> {
    const requestId = ++this.requestId;
    
    const requestBody: JsonRpcRequest = {
      jsonrpc: '2.0',
      method,
      params,
      id: requestId,
    };

    try {
      const response = await fetch(this.rpcUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result: JsonRpcResponse = await response.json();

      if (result.error) {
        throw new Error(`RPC Error ${result.error.code}: ${result.error.message}`);
      }

      return result.result;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`RPC request failed: ${error.message}`);
      }
      throw new Error('Unknown RPC error');
    }
  }

  // 以太坊特定方法的封装
  async getBlockNumber(): Promise<number> {
    const blockNumberHex = await this.request('eth_blockNumber');
    return parseInt(blockNumberHex, 16);
  }

  async getBalance(address: string, block: string = 'latest'): Promise<string> {
    return await this.request('eth_getBalance', [address, block]);
  }

  async getGasPrice(): Promise<string> {
    return await this.request('eth_gasPrice');
  }

  async estimateGas(transaction: any): Promise<string> {
    return await this.request('eth_estimateGas', [transaction]);
  }

  async sendTransaction(transaction: any): Promise<string> {
    return await this.request('eth_sendTransaction', [transaction]);
  }

  async getTransactionReceipt(txHash: string): Promise<any> {
    return await this.request('eth_getTransactionReceipt', [txHash]);
  }

  async getChainId(): Promise<string> {
    return await this.request('eth_chainId');
  }
}

export class NetworkClientManager {
  private clients: Map<string, NetworkClient> = new Map();
  private healthCache: Map<string, NetworkHealth> = new Map();
  private readonly HEALTH_CHECK_INTERVAL = 30000; // 30 seconds

  /**
   * 创建网络客户端
   */
  createClient(chainConfig: ChainConfig): NetworkClient {
    const rpcUrl = chainConfig.rpcUrls[0];
    const rpcClient = new EthereumRpcClient(rpcUrl);

    const client: NetworkClient = {
      chainId: chainConfig.chainId,
      rpcUrl,
      provider: rpcClient, // 这里直接赋值我们的客户端
      createdAt: Date.now(),
      lastActiveAt: Date.now()
    };

    this.clients.set(chainConfig.chainId, client);
    console.log(`Created network client for chain ${chainConfig.chainName} (${chainConfig.chainId})`);
    
    return client;
  }

  /**
   * 获取网络客户端
   */
  getClient(chainId: string): NetworkClient | undefined {
    const client = this.clients.get(chainId);
    if (client && client.lastActiveAt !== undefined) {
      client.lastActiveAt = Date.now();
    }
    return client;
  }

  /**
   * 移除网络客户端
   */
  removeClient(chainId: string): void {
    this.clients.delete(chainId);
    this.healthCache.delete(chainId);
    console.log(`Removed network client for chain ${chainId}`);
  }

  /**
   * 检查网络健康状态
   */
  async checkNetworkHealth(chainId: string): Promise<NetworkHealth> {
    const client = this.getClient(chainId);
    if (!client) {
      return {
        isHealthy: false,
        lastChecked: Date.now(),
        error: 'Client not found'
      };
    }

    const startTime = Date.now();
    
    try {
      // 使用类型断言来访问我们的自定义方法
      const rpcClient = client.provider as EthereumRpcClient;
      const blockNumber = await rpcClient.getBlockNumber();
      
      const latency = Date.now() - startTime;

      const health: NetworkHealth = {
        isHealthy: true,
        latency,
        blockNumber,
        lastChecked: Date.now(),
        failureCount: 0
      };

      this.healthCache.set(chainId, health);
      console.log(`Network health check passed for ${chainId}: ${latency}ms`);
      
      return health;
    } catch (error) {
      const previousHealth = this.healthCache.get(chainId);
      const failureCount = (previousHealth?.failureCount || 0) + 1;
      
      const health: NetworkHealth = {
        isHealthy: false,
        lastChecked: Date.now(),
        error: error instanceof Error ? error.message : 'Unknown error',
        failureCount
      };

      this.healthCache.set(chainId, health);
      console.error(`Network health check failed for ${chainId}:`, error);
      
      return health;
    }
  }

  /**
   * 获取缓存的健康状态
   */
  getCachedHealth(chainId: string): NetworkHealth | undefined {
    const cached = this.healthCache.get(chainId);
    if (!cached) return undefined;

    // 如果缓存超过5分钟，认为过期
    const isExpired = Date.now() - cached.lastChecked > 300000;
    return isExpired ? undefined : cached;
  }

  /**
   * 获取账户余额
   */
  async getBalance(chainId: string, address: string): Promise<string> {
    const client = this.getClient(chainId);
    if (!client) {
      throw new Error(`Network client not found for chain ${chainId}`);
    }

    try {
      const rpcClient = client.provider as EthereumRpcClient;
      return await rpcClient.getBalance(address);
    } catch (error) {
      throw new Error(`Failed to get balance: ${error}`);
    }
  }

  /**
   * 获取当前gas价格
   */
  async getGasPrice(chainId: string): Promise<string> {
    const client = this.getClient(chainId);
    if (!client) {
      throw new Error(`Network client not found for chain ${chainId}`);
    }

    try {
      const rpcClient = client.provider as EthereumRpcClient;
      return await rpcClient.getGasPrice();
    } catch (error) {
      throw new Error(`Failed to get gas price: ${error}`);
    }
  }

  /**
   * 估算gas用量
   */
  async estimateGas(chainId: string, transaction: TransactionRequest): Promise<string> {
    const client = this.getClient(chainId);
    if (!client) {
      throw new Error(`Network client not found for chain ${chainId}`);
    }

    try {
      const rpcClient = client.provider as EthereumRpcClient;
      return await rpcClient.estimateGas(transaction);
    } catch (error) {
      throw new Error(`Failed to estimate gas: ${error}`);
    }
  }

  /**
   * 发送交易
   */
  async sendTransaction(chainId: string, transaction: TransactionRequest): Promise<TransactionReceipt> {
    const client = this.getClient(chainId);
    if (!client) {
      throw new Error(`Network client not found for chain ${chainId}`);
    }

    try {
      const rpcClient = client.provider as EthereumRpcClient;
      const txHash = await rpcClient.sendTransaction(transaction);

      console.log(`Transaction sent: ${txHash}`);

      // 等待交易被打包
      let receipt = null;
      let attempts = 0;
      const maxAttempts = 60; // 最多等待60秒

      while (!receipt && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        receipt = await this.getTransactionReceipt(chainId, txHash);
        attempts++;
        
        if (attempts % 10 === 0) {
          console.log(`Waiting for transaction confirmation... (${attempts}s)`);
        }
      }

      if (!receipt) {
        throw new Error('Transaction timeout: receipt not found after 60 seconds');
      }

      console.log(`Transaction confirmed: ${txHash}`);
      return receipt;
    } catch (error) {
      console.error('Send transaction failed:', error);
      throw new Error(`Failed to send transaction: ${error}`);
    }
  }

  /**
   * 获取交易回执
   */
  async getTransactionReceipt(chainId: string, txHash: string): Promise<TransactionReceipt | null> {
    const client = this.getClient(chainId);
    if (!client) {
      throw new Error(`Network client not found for chain ${chainId}`);
    }

    try {
      const rpcClient = client.provider as EthereumRpcClient;
      const receipt = await rpcClient.getTransactionReceipt(txHash);

      if (!receipt) return null;

      return {
        transactionHash: receipt.transactionHash,
        transactionIndex: receipt.transactionIndex,
        blockHash: receipt.blockHash,
        blockNumber: parseInt(receipt.blockNumber, 16),
        from: receipt.from,
        to: receipt.to,
        cumulativeGasUsed: receipt.cumulativeGasUsed,
        gasUsed: receipt.gasUsed,
        contractAddress: receipt.contractAddress,
        logs: receipt.logs,
        logsBloom: receipt.logsBloom,
        status: receipt.status === '0x1',
        effectiveGasPrice: receipt.effectiveGasPrice,
        type: receipt.type
      };
    } catch (error) {
      // 如果交易还未被打包，这里会抛出错误，我们返回 null
      return null;
    }
  }

  /**
   * 获取所有客户端的统计信息
   */
  getStats(): { [chainId: string]: { healthy: boolean; lastActive: number } } {
    const stats: { [chainId: string]: { healthy: boolean; lastActive: number } } = {};
    
    for (const [chainId, client] of this.clients) {
      const health = this.getCachedHealth(chainId);
      stats[chainId] = {
        healthy: health?.isHealthy ?? false,
        lastActive: client.lastActiveAt || 0
      };
    }
    
    return stats;
  }

  /**
   * 获取所有客户端
   */
  getAllClients(): Map<string, NetworkClient> {
    return new Map(this.clients);
  }

  /**
   * 清除所有客户端
   */
  clearAll(): void {
    console.log('Clearing all network clients');
    this.clients.clear();
    this.healthCache.clear();
  }
}