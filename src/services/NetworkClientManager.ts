// services/NetworkClientManager.ts
import Web3 from 'web3';
import { NetworkClient, NetworkHealth } from '../types/network';
import { ChainConfig } from '../types/chain';
import { TransactionRequest, TransactionReceipt } from '../types/transaction';

export class NetworkClientManager {
  private clients: Map<string, NetworkClient> = new Map();
  private healthCache: Map<string, NetworkHealth> = new Map();
  private readonly HEALTH_CHECK_INTERVAL = 30000; // 30 seconds

  /**
   * 创建网络客户端
   */
  createClient(chainConfig: ChainConfig): NetworkClient {
    // 优先使用第一个RPC URL
    const rpcUrl = chainConfig.rpcUrls[0];
    const provider = new Web3(new Web3.providers.HttpProvider(rpcUrl));

    const client: NetworkClient = {
      chainId: chainConfig.chainId,
      rpcUrl,
      provider
    };

    this.clients.set(chainConfig.chainId, client);
    return client;
  }

  /**
   * 获取网络客户端
   */
  getClient(chainId: string): NetworkClient | undefined {
    return this.clients.get(chainId);
  }

  /**
   * 移除网络客户端
   */
  removeClient(chainId: string): void {
    this.clients.delete(chainId);
    this.healthCache.delete(chainId);
  }

  /**
   * 检查网络健康状态
   */
  async checkNetworkHealth(chainId: string): Promise<NetworkHealth> {
    const client = this.getClient(chainId);
    if (!client) {
      return {
        isHealthy: false,
        lastChecked: Date.now()
      };
    }

    const startTime = Date.now();
    
    try {
      const blockNumber = await client.provider.eth.getBlockNumber();
      const latency = Date.now() - startTime;

      const health: NetworkHealth = {
        isHealthy: true,
        latency,
        blockNumber: Number(blockNumber),
        lastChecked: Date.now()
      };

      this.healthCache.set(chainId, health);
      return health;
    } catch (error) {
      const health: NetworkHealth = {
        isHealthy: false,
        lastChecked: Date.now()
      };

      this.healthCache.set(chainId, health);
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
      return await client.provider.eth.getBalance(address);
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
      return await client.provider.eth.getGasPrice();
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
      return await client.provider.eth.estimateGas(transaction);
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
      const receipt = await client.provider.eth.sendTransaction(transaction);
      return {
        transactionHash: receipt.transactionHash,
        blockNumber: Number(receipt.blockNumber),
        gasUsed: receipt.gasUsed.toString(),
        status: receipt.status === 1n || receipt.status === true
      };
    } catch (error) {
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
      const receipt = await client.provider.eth.getTransactionReceipt(txHash);
      if (!receipt) return null;

      return {
        transactionHash: receipt.transactionHash,
        blockNumber: Number(receipt.blockNumber),
        gasUsed: receipt.gasUsed.toString(),
        status: receipt.status === 1n || receipt.status === true
      };
    } catch (error) {
      throw new Error(`Failed to get transaction receipt: ${error}`);
    }
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
    this.clients.clear();
    this.healthCache.clear();
  }
}