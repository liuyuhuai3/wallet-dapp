// services/ChainManager.ts
import { ChainConfig } from '../types/chain';
import { ChainManagerEvents } from '../types/events';
import { TransactionRequest, TransactionReceipt } from '../types/transaction';
import { NetworkHealth } from '../types/network';
import { SUPPORTED_CHAINS, DEFAULT_CHAIN_ID } from '../constants/chains';
import { EventManager } from '../utils/EventManager';
import { ChainValidator } from '../utils/ChainValidator';
import { NetworkClientManager } from './NetworkClientManager';

export class ChainManager {
  private currentChainId: string;
  private supportedChains: Map<string, ChainConfig>;
  private eventManager: EventManager<ChainManagerEvents>;
  private networkManager: NetworkClientManager;

  constructor(initialChainId: string = DEFAULT_CHAIN_ID) {
    this.currentChainId = initialChainId;
    this.supportedChains = new Map();
    this.eventManager = new EventManager<ChainManagerEvents>();
    this.networkManager = new NetworkClientManager();

    this.initializeSupportedChains();
  }

  /**
   * 初始化支持的链
   */
  private initializeSupportedChains(): void {
    Object.values(SUPPORTED_CHAINS).forEach(chain => {
      const chainConfig = chain as ChainConfig;
      this.supportedChains.set(chainConfig.chainId, chainConfig);
      this.networkManager.createClient(chainConfig);
    });
  }

  /**
   * 获取当前链ID
   */
  getCurrentChainId(): string {
    return this.currentChainId;
  }

  /**
   * 获取当前链配置
   */
  getCurrentChainConfig(): ChainConfig | undefined {
    return this.supportedChains.get(this.currentChainId);
  }

  /**
   * 获取所有支持的链
   */
  getSupportedChains(): ChainConfig[] {
    return Array.from(this.supportedChains.values());
  }

  /**
   * 获取特定链的配置
   */
  getChainConfig(chainId: string): ChainConfig | undefined {
    return this.supportedChains.get(ChainValidator.normalizeChainId(chainId));
  }

  /**
   * 检查是否支持特定链
   */
  isChainSupported(chainId: string): boolean {
    return this.supportedChains.has(ChainValidator.normalizeChainId(chainId));
  }

  /**
   * 切换链
   */
  async switchChain(chainId: string): Promise<void> {
    const normalizedChainId = ChainValidator.normalizeChainId(chainId);
    
    if (!this.isChainSupported(normalizedChainId)) {
      throw new Error(`Unsupported chain ID: ${chainId}`);
    }

    if (this.currentChainId === normalizedChainId) {
      return; // 已经是当前链
    }

    // 检查网络健康状态
    const health = await this.networkManager.checkNetworkHealth(normalizedChainId);
    if (!health.isHealthy) {
      throw new Error(`Target network ${chainId} is not healthy`);
    }

    const previousChainId = this.currentChainId;
    this.currentChainId = normalizedChainId;

    // 触发链切换事件
    this.eventManager.emit('chainChanged', {
      previousChainId,
      currentChainId: normalizedChainId,
      chainConfig: this.supportedChains.get(normalizedChainId)!,
      timestamp: Date.now()
    });
  }

  /**
   * 添加新链
   */
  async addChain(chainConfig: ChainConfig): Promise<void> {
    // 验证链配置
    const validation = ChainValidator.validateChainConfig(chainConfig);
    if (!validation.isValid) {
      throw new Error(`Invalid chain configuration: ${validation.errors.join(', ')}`);
    }

    // 清理配置
    const sanitizedConfig = ChainValidator.sanitizeChainConfig(chainConfig);
    const chainId = sanitizedConfig.chainId;

    // 检查是否已存在
    if (this.isChainSupported(chainId)) {
      throw new Error(`Chain ${chainId} is already supported`);
    }

    // 添加到支持的链列表
    this.supportedChains.set(chainId, sanitizedConfig);

    // 创建网络客户端
    this.networkManager.createClient(sanitizedConfig);

    // 触发链添加事件
    this.eventManager.emit('chainAdded', { 
      chainConfig: sanitizedConfig, 
      timestamp: Date.now() 
    });
  }

  /**
   * 移除链
   */
  removeChain(chainId: string): void {
    const normalizedChainId = ChainValidator.normalizeChainId(chainId);
    
    if (normalizedChainId === DEFAULT_CHAIN_ID) {
      throw new Error('Cannot remove default chain');
    }

    if (normalizedChainId === this.currentChainId) {
      throw new Error('Cannot remove currently active chain');
    }

    this.supportedChains.delete(normalizedChainId);
    this.networkManager.removeClient(normalizedChainId);
  }

  /**
   * 检查网络健康状态
   */
  async checkNetworkHealth(chainId?: string): Promise<NetworkHealth> {
    const targetChainId = chainId || this.currentChainId;
    return await this.networkManager.checkNetworkHealth(targetChainId);
  }

  /**
   * 获取缓存的网络健康状态
   */
  getCachedNetworkHealth(chainId?: string): NetworkHealth | undefined {
    const targetChainId = chainId || this.currentChainId;
    return this.networkManager.getCachedHealth(targetChainId);
  }

  /**
   * 获取账户余额
   */
  async getBalance(address: string, chainId?: string): Promise<string> {
    const targetChainId = chainId || this.currentChainId;
    return await this.networkManager.getBalance(targetChainId, address);
  }

  /**
   * 获取Gas价格
   */
  async getGasPrice(chainId?: string): Promise<string> {
    const targetChainId = chainId || this.currentChainId;
    return await this.networkManager.getGasPrice(targetChainId);
  }

  /**
   * 估算Gas
   */
  async estimateGas(transaction: TransactionRequest, chainId?: string): Promise<string> {
    const targetChainId = chainId || this.currentChainId;
    return await this.networkManager.estimateGas(targetChainId, transaction);
  }

  /**
   * 发送交易
   */
  async sendTransaction(transaction: TransactionRequest, chainId?: string): Promise<TransactionReceipt> {
    const targetChainId = chainId || this.currentChainId;
    try {
      return await this.networkManager.sendTransaction(targetChainId, transaction);
    } catch (error) {
      this.eventManager.emit('networkError', {
        chainId: targetChainId,
        error: error as Error,
        timestamp: Date.now(),
        errorType: (error instanceof Error && (error as any).name) ? (error as any).name : 'UnknownError'
      });
      throw error;
    }
  }

  /**
   * 获取交易回执
   */
  async getTransactionReceipt(txHash: string, chainId?: string): Promise<TransactionReceipt | null> {
    const targetChainId = chainId || this.currentChainId;
    return await this.networkManager.getTransactionReceipt(targetChainId, txHash);
  }

  /**
   * 事件监听器管理
   */
  on<K extends keyof ChainManagerEvents>(
    event: K, 
    callback: (data: ChainManagerEvents[K]) => void
  ): void {
    this.eventManager.on(event, callback);
  }

  off<K extends keyof ChainManagerEvents>(
    event: K, 
    callback: (data: ChainManagerEvents[K]) => void
  ): void {
    this.eventManager.off(event, callback);
  }

  once<K extends keyof ChainManagerEvents>(
    event: K, 
    callback: (data: ChainManagerEvents[K]) => void
  ): void {
    this.eventManager.once(event, callback);
  }

  /**
   * 销毁实例
   */
  destroy(): void {
    this.eventManager.removeAllListeners();
    this.networkManager.clearAll();
    this.supportedChains.clear();
  }
}