// src/types/events.ts
import { ChainConfig } from './chain';
import { NetworkHealth, NetworkEventData } from './network';
import { TransactionReceipt, TransactionStatus } from './transaction';

/**
 * 链切换事件数据
 * 当用户切换到不同区块链时触发
 */
export interface ChainChangedEvent {
  /** 之前的链ID */
  previousChainId: string;
  
  /** 当前的链ID */
  currentChainId: string;
  
  /** 当前链的配置信息 */
  chainConfig: ChainConfig;
  
  /** 切换时间戳 */
  timestamp: number;
  
  /** 切换原因（用户主动切换 vs 自动切换） */
  reason?: 'user' | 'auto' | 'error_recovery';
}

/**
 * 链添加事件数据
 * 当新的区块链被添加到支持列表时触发
 */
export interface ChainAddedEvent {
  /** 新添加的链配置 */
  chainConfig: ChainConfig;
  
  /** 添加时间戳 */
  timestamp: number;
  
  /** 添加方式（用户手动添加 vs 程序自动添加） */
  source?: 'user' | 'auto' | 'config';
}

/**
 * 链移除事件数据
 * 当区块链从支持列表中被移除时触发
 */
export interface ChainRemovedEvent {
  /** 被移除的链ID */
  chainId: string;
  
  /** 被移除的链名称 */
  chainName: string;
  
  /** 移除时间戳 */
  timestamp: number;
  
  /** 移除原因 */
  reason?: 'user' | 'auto' | 'maintenance';
}

/**
 * 网络错误事件数据
 * 当网络连接出现问题时触发
 */
export interface NetworkErrorEvent {
  /** 出错的链ID */
  chainId: string;
  
  /** 错误对象 */
  error: Error;
  
  /** 错误时间戳 */
  timestamp: number;
  
  /** 错误类型 */
  errorType: NetworkErrorType;
  
  /** 重试次数 */
  retryCount?: number;
  
  /** 是否为致命错误 */
  isFatal?: boolean;
}

/**
 * 网络错误类型枚举
 */
export enum NetworkErrorType {
  /** 连接超时 */
  CONNECTION_TIMEOUT = 'connection_timeout',
  
  /** 连接被拒绝 */
  CONNECTION_REFUSED = 'connection_refused',
  
  /** RPC调用失败 */
  RPC_ERROR = 'rpc_error',
  
  /** 网络不可达 */
  NETWORK_UNREACHABLE = 'network_unreachable',
  
  /** SSL/TLS错误 */
  SSL_ERROR = 'ssl_error',
  
  /** DNS解析失败 */
  DNS_ERROR = 'dns_error',
  
  /** 未知错误 */
  UNKNOWN = 'unknown',
}

/**
 * 账户变更事件数据
 * 当用户切换钱包账户时触发
 */
export interface AccountChangedEvent {
  /** 之前的账户地址 */
  previousAccount: string | null;
  
  /** 当前的账户地址 */
  currentAccount: string | null;
  
  /** 账户信息 */
  accountInfo?: {
    balance?: string;
    nonce?: number;
  };
  
  /** 变更时间戳 */
  timestamp: number;
}

/**
 * 交易状态变更事件数据
 * 当交易状态发生变化时触发
 */
export interface TransactionStatusChangedEvent {
  /** 交易哈希 */
  transactionHash: string;
  
  /** 之前的状态 */
  previousStatus: TransactionStatus;
  
  /** 当前状态 */
  currentStatus: TransactionStatus;
  
  /** 链ID */
  chainId: string;
  
  /** 确认数 */
  confirmations?: number;
  
  /** 交易回执（如果有） */
  receipt?: TransactionReceipt;
  
  /** 状态变更时间戳 */
  timestamp: number;
  
  /** 错误信息（如果失败） */
  error?: string;
}

/**
 * 余额变更事件数据
 * 当账户余额发生变化时触发
 */
export interface BalanceChangedEvent {
  /** 账户地址 */
  address: string;
  
  /** 链ID */
  chainId: string;
  
  /** 之前的余额 */
  previousBalance: string;
  
  /** 当前余额 */
  currentBalance: string;
  
  /** 余额变化量 */
  balanceChange: string;
  
  /** 变更时间戳 */
  timestamp: number;
  
  /** 引起余额变化的交易哈希（如果有） */
  transactionHash?: string;
}

/**
 * 连接状态变更事件数据
 * 当钱包连接状态发生变化时触发
 */
export interface ConnectionStatusChangedEvent {
  /** 之前的连接状态 */
  previousStatus: ConnectionStatus;
  
  /** 当前连接状态 */
  currentStatus: ConnectionStatus;
  
  /** 连接的提供者类型 */
  providerType?: string;
  
  /** 状态变更时间戳 */
  timestamp: number;
  
  /** 错误信息（如果是错误导致的状态变更） */
  error?: string;
}

/**
 * 连接状态枚举
 */
export enum ConnectionStatus {
  /** 未连接 */
  DISCONNECTED = 'disconnected',
  
  /** 连接中 */
  CONNECTING = 'connecting',
  
  /** 已连接 */
  CONNECTED = 'connected',
  
  /** 连接错误 */
  ERROR = 'error',
  
  /** 重连中 */
  RECONNECTING = 'reconnecting',
}

/**
 * 权限变更事件数据
 * 当DApp权限发生变化时触发
 */
export interface PermissionChangedEvent {
  /** 权限类型 */
  permission: PermissionType;
  
  /** 是否被授予权限 */
  granted: boolean;
  
  /** 相关的账户（如果适用） */
  accounts?: string[];
  
  /** 相关的链ID（如果适用） */
  chainIds?: string[];
  
  /** 权限变更时间戳 */
  timestamp: number;
}

/**
 * 权限类型枚举
 */
export enum PermissionType {
  /** 账户访问权限 */
  ACCOUNTS = 'accounts',
  
  /** 链切换权限 */
  CHAIN_SWITCH = 'chain_switch',
  
  /** 交易签名权限 */
  TRANSACTION_SIGNING = 'transaction_signing',
  
  /** 消息签名权限 */
  MESSAGE_SIGNING = 'message_signing',
  
  /** 合约交互权限 */
  CONTRACT_INTERACTION = 'contract_interaction',
}

/**
 * 区块事件数据
 * 当新区块被挖出时触发
 */
export interface BlockEvent {
  /** 区块号 */
  blockNumber: number;
  
  /** 区块哈希 */
  blockHash: string;
  
  /** 链ID */
  chainId: string;
  
  /** 区块时间戳 */
  blockTimestamp: number;
  
  /** 区块中的交易数量 */
  transactionCount: number;
  
  /** 事件触发时间戳 */
  timestamp: number;
}

/**
 * Gas价格更新事件数据
 * 当Gas价格发生显著变化时触发
 */
export interface GasPriceUpdatedEvent {
  /** 链ID */
  chainId: string;
  
  /** 之前的Gas价格 */
  previousGasPrice: string;
  
  /** 当前Gas价格 */
  currentGasPrice: string;
  
  /** 价格变化百分比 */
  changePercentage: number;
  
  /** 更新时间戳 */
  timestamp: number;
  
  /** EIP-1559相关信息 */
  eip1559?: {
    baseFee: string;
    priorityFee: string;
  };
}

/**
 * 钱包锁定状态变更事件
 * 当钱包被锁定或解锁时触发
 */
export interface WalletLockStatusChangedEvent {
  /** 是否被锁定 */
  isLocked: boolean;
  
  /** 状态变更时间戳 */
  timestamp: number;
  
  /** 锁定原因（如果被锁定） */
  lockReason?: 'user_action' | 'timeout' | 'security';
}

/**
 * DApp事件数据
 * DApp内部状态变化事件
 */
export interface DAppEvent {
  /** 事件类型 */
  type: DAppEventType;
  
  /** 事件数据 */
  data: any;
  
  /** 事件时间戳 */
  timestamp: number;
  
  /** 事件来源 */
  source?: string;
}

/**
 * DApp事件类型枚举
 */
export enum DAppEventType {
  /** 应用初始化完成 */
  APP_INITIALIZED = 'app_initialized',
  
  /** 用户登录 */
  USER_LOGIN = 'user_login',
  
  /** 用户登出 */
  USER_LOGOUT = 'user_logout',
  
  /** 设置更新 */
  SETTINGS_UPDATED = 'settings_updated',
  
  /** 主题切换 */
  THEME_CHANGED = 'theme_changed',
  
  /** 语言切换 */
  LANGUAGE_CHANGED = 'language_changed',
}

/**
 * 网络健康状态变更事件
 * 当网络健康状态发生变化时触发
 */
export interface NetworkHealthChangedEvent {
  /** 链ID */
  chainId: string;
  
  /** 之前的健康状态 */
  previousHealth: NetworkHealth;
  
  /** 当前健康状态 */
  currentHealth: NetworkHealth;
  
  /** 状态变更时间戳 */
  timestamp: number;
}

/**
 * 智能合约事件数据
 * 智能合约触发的自定义事件
 */
export interface ContractEvent {
  /** 合约地址 */
  contractAddress: string;
  
  /** 事件名称 */
  eventName: string;
  
  /** 事件参数 */
  args: { [key: string]: any };
  
  /** 交易哈希 */
  transactionHash: string;
  
  /** 区块号 */
  blockNumber: number;
  
  /** 日志索引 */
  logIndex: number;
  
  /** 链ID */
  chainId: string;
  
  /** 事件时间戳 */
  timestamp: number;
}

/**
 * 令牌余额变更事件
 * 当ERC-20代币余额发生变化时触发
 */
export interface TokenBalanceChangedEvent {
  /** 代币合约地址 */
  tokenAddress: string;
  
  /** 代币符号 */
  tokenSymbol: string;
  
  /** 账户地址 */
  accountAddress: string;
  
  /** 链ID */
  chainId: string;
  
  /** 之前的余额 */
  previousBalance: string;
  
  /** 当前余额 */
  currentBalance: string;
  
  /** 余额变化量 */
  balanceChange: string;
  
  /** 变更时间戳 */
  timestamp: number;
  
  /** 引起变更的交易哈希 */
  transactionHash?: string;
}

/**
 * 链管理器所有事件的联合类型
 * 用于类型安全的事件处理
 */
export type ChainManagerEvents = {
  chainChanged: ChainChangedEvent;
  chainAdded: ChainAddedEvent;
  chainRemoved: ChainRemovedEvent;
  networkError: NetworkErrorEvent;
  networkHealthChanged: NetworkHealthChangedEvent;
  accountChanged: AccountChangedEvent;
  transactionStatusChanged: TransactionStatusChangedEvent;
  balanceChanged: BalanceChangedEvent;
  connectionStatusChanged: ConnectionStatusChangedEvent;
  permissionChanged: PermissionChangedEvent;
  blockEvent: BlockEvent;
  gasPriceUpdated: GasPriceUpdatedEvent;
  walletLockStatusChanged: WalletLockStatusChangedEvent;
  dappEvent: DAppEvent;
  contractEvent: ContractEvent;
  tokenBalanceChanged: TokenBalanceChangedEvent;
  networkEvent: NetworkEventData;
};

/**
 * 事件监听器接口
 * 定义事件监听器的标准接口
 */
export interface EventListener<T = any> {
  /** 事件名称 */
  event: keyof ChainManagerEvents;
  
  /** 回调函数 */
  callback: (data: T) => void;
  
  /** 是否只执行一次 */
  once?: boolean;
  
  /** 监听器优先级 */
  priority?: number;
  
  /** 监听器标识符 */
  id?: string;
}

/**
 * 事件过滤器接口
 * 用于过滤特定条件的事件
 */
export interface EventFilter {
  /** 事件类型 */
  eventType?: keyof ChainManagerEvents;
  
  /** 链ID过滤 */
  chainId?: string;
  
  /** 账户地址过滤 */
  address?: string;
  
  /** 时间范围过滤 */
  timeRange?: {
    from: number;
    to: number;
  };
  
  /** 自定义过滤函数 */
  customFilter?: (event: any) => boolean;
}

/**
 * 事件处理器配置
 * 配置事件处理的各种选项
 */
export interface EventHandlerConfig {
  /** 是否启用事件处理 */
  enabled: boolean;
  
  /** 最大监听器数量 */
  maxListeners: number;
  
  /** 事件队列大小 */
  queueSize: number;
  
  /** 是否启用事件持久化 */
  enablePersistence: boolean;
  
  /** 事件历史保留时间（毫秒） */
  historyRetention: number;
  
  /** 是否启用调试模式 */
  debug: boolean;
}

/**
 * 批量事件数据
 * 用于批量处理多个事件
 */
export interface BatchEventData {
  /** 事件列表 */
  events: Array<{
    type: keyof ChainManagerEvents;
    data: any;
    timestamp: number;
  }>;
  
  /** 批次ID */
  batchId: string;
  
  /** 批次创建时间 */
  batchTimestamp: number;
  
  /** 批次大小 */
  batchSize: number;
}