// src/types/network.ts
import Web3 from 'web3';

/**
 * 网络客户端接口
 * 封装了与特定区块链网络的连接信息
 */
export interface NetworkClient {
  /** 链ID（十六进制格式，如 '0x1' 表示以太坊主网） */
  chainId: string;
  
  /** RPC 端点URL */
  rpcUrl: string;
  
  /** Web3 提供者实例 */
  provider: Web3;
  
  /** 客户端创建时间戳 */
  createdAt?: number;
  
  /** 最后活跃时间 */
  lastActiveAt?: number;
}

/**
 * 网络健康状态
 * 用于监控网络连接质量和可用性
 */
export interface NetworkHealth {
  /** 网络是否健康可用 */
  isHealthy: boolean;
  
  /** 网络延迟（毫秒） */
  latency?: number;
  
  /** 当前区块高度 */
  blockNumber?: number;
  
  /** 最后检查时间戳 */
  lastChecked: number;
  
  /** 错误信息（如果网络不健康） */
  error?: string;
  
  /** 连续失败次数 */
  failureCount?: number;
}

/**
 * 网络连接配置
 * 用于配置网络连接的各种参数
 */
export interface NetworkConnectionConfig {
  /** 连接超时时间（毫秒，默认10000） */
  timeout?: number;
  
  /** 重试次数（默认3次） */
  retryCount?: number;
  
  /** 重试间隔（毫秒，默认1000） */
  retryDelay?: number;
  
  /** 是否启用自动重连 */
  autoReconnect?: boolean;
  
  /** 心跳检查间隔（毫秒，默认30000） */
  heartbeatInterval?: number;
}

/**
 * RPC 请求参数
 * 标准的JSON-RPC请求格式
 */
export interface RpcRequest {
  /** JSON-RPC 版本，通常是 '2.0' */
  jsonrpc: '2.0';
  
  /** 请求方法名 */
  method: string;
  
  /** 请求参数数组 */
  params?: any[];
  
  /** 请求ID，用于匹配响应 */
  id: number | string;
}

/**
 * RPC 响应结果
 * 标准的JSON-RPC响应格式
 */
export interface RpcResponse<T = any> {
  /** JSON-RPC 版本 */
  jsonrpc: '2.0';
  
  /** 响应结果（成功时） */
  result?: T;
  
  /** 错误信息（失败时） */
  error?: RpcError;
  
  /** 请求ID */
  id: number | string;
}

/**
 * RPC 错误信息
 * 标准的JSON-RPC错误格式
 */
export interface RpcError {
  /** 错误代码 */
  code: number;
  
  /** 错误消息 */
  message: string;
  
  /** 额外的错误数据 */
  data?: any;
}

/**
 * 网络统计信息
 * 用于监控网络使用情况和性能
 */
export interface NetworkStats {
  /** 总请求次数 */
  totalRequests: number;
  
  /** 成功请求次数 */
  successfulRequests: number;
  
  /** 失败请求次数 */
  failedRequests: number;
  
  /** 平均响应时间（毫秒） */
  averageLatency: number;
  
  /** 最后请求时间 */
  lastRequestTime: number;
  
  /** 连接建立时间 */
  connectionTime: number;
}

/**
 * 支持的网络方法枚举
 * 常用的以太坊RPC方法
 */
export enum NetworkMethod {
  // 基础查询方法
  GET_BALANCE = 'eth_getBalance',
  GET_BLOCK_NUMBER = 'eth_blockNumber',
  GET_GAS_PRICE = 'eth_gasPrice',
  GET_TRANSACTION_COUNT = 'eth_getTransactionCount',
  
  // 交易相关方法
  SEND_TRANSACTION = 'eth_sendTransaction',
  SEND_RAW_TRANSACTION = 'eth_sendRawTransaction',
  ESTIMATE_GAS = 'eth_estimateGas',
  GET_TRANSACTION = 'eth_getTransactionByHash',
  GET_TRANSACTION_RECEIPT = 'eth_getTransactionReceipt',
  
  // 合约相关方法
  CALL = 'eth_call',
  GET_CODE = 'eth_getCode',
  GET_STORAGE_AT = 'eth_getStorageAt',
  
  // 网络信息方法
  CHAIN_ID = 'eth_chainId',
  NET_VERSION = 'net_version',
  
  // 订阅方法（WebSocket）
  SUBSCRIBE = 'eth_subscribe',
  UNSUBSCRIBE = 'eth_unsubscribe',
}

/**
 * 网络提供者类型
 * 不同类型的网络连接提供者
 */
export enum NetworkProviderType {
  /** HTTP/HTTPS 连接 */
  HTTP = 'http',
  
  /** WebSocket 连接 */
  WEBSOCKET = 'websocket',
  
  /** IPC 连接（本地节点） */
  IPC = 'ipc',
  
  /** 浏览器内置提供者（如MetaMask） */
  INJECTED = 'injected',
}

/**
 * 网络事件类型
 * 网络层可能触发的各种事件
 */
export enum NetworkEventType {
  /** 连接建立 */
  CONNECTED = 'connected',
  
  /** 连接断开 */
  DISCONNECTED = 'disconnected',
  
  /** 连接错误 */
  ERROR = 'error',
  
  /** 数据接收 */
  DATA = 'data',
  
  /** 心跳检查 */
  HEARTBEAT = 'heartbeat',
  
  /** 重连尝试 */
  RECONNECTING = 'reconnecting',
}

/**
 * 网络事件数据
 * 网络事件携带的数据信息
 */
export interface NetworkEventData {
  /** 事件类型 */
  type: NetworkEventType;
  
  /** 链ID */
  chainId: string;
  
  /** 时间戳 */
  timestamp: number;
  
  /** 事件数据 */
  data?: any;
  
  /** 错误信息（如果有） */
  error?: Error;
}

/**
 * 连接池配置
 * 管理多个网络连接的配置
 */
export interface ConnectionPoolConfig {
  /** 最大连接数 */
  maxConnections?: number;
  
  /** 连接空闲超时时间（毫秒） */
  idleTimeout?: number;
  
  /** 是否启用连接复用 */
  enableReuse?: boolean;
  
  /** 连接预热（预先建立连接） */
  enableWarmup?: boolean;
}

/**
 * 网络监控配置
 * 用于配置网络监控和告警
 */
export interface NetworkMonitorConfig {
  /** 是否启用监控 */
  enabled: boolean;
  
  /** 健康检查间隔（毫秒） */
  healthCheckInterval: number;
  
  /** 延迟告警阈值（毫秒） */
  latencyThreshold: number;
  
  /** 失败率告警阈值（0-1） */
  failureRateThreshold: number;
  
  /** 监控历史数据保留时间（毫秒） */
  historyRetention: number;
}