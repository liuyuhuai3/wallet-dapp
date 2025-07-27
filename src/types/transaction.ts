// src/types/transaction.ts

/**
 * 基础交易请求接口
 * 发送交易时需要的基本参数
 */
export interface TransactionRequest {
  /** 接收方地址 */
  to?: string;
  
  /** 发送方地址（通常由钱包自动填入） */
  from?: string;
  
  /** 发送的以太币数量（wei单位，十六进制字符串） */
  value?: string;
  
  /** 交易数据（合约调用的编码数据） */
  data?: string;
  
  /** Gas限制 */
  gas?: string;
  
  /** Gas价格（wei单位） */
  gasPrice?: string;
  
  /** 交易随机数（防重放攻击） */
  nonce?: number;
  
  /** EIP-1559: 最大费用每gas */
  maxFeePerGas?: string;
  
  /** EIP-1559: 最大优先费用每gas */
  maxPriorityFeePerGas?: string;
  
  /** 交易类型（0=传统, 1=EIP-2930, 2=EIP-1559） */
  type?: number;
  
  /** EIP-2930: 访问列表 */
  accessList?: AccessListEntry[];
}

/**
 * EIP-2930 访问列表条目
 * 预声明要访问的地址和存储槽，可以节省gas
 */
export interface AccessListEntry {
  /** 合约地址 */
  address: string;
  
  /** 存储槽键列表 */
  storageKeys: string[];
}

/**
 * 交易回执接口
 * 交易被打包后返回的详细信息
 */
export interface TransactionReceipt {
  /** 交易哈希 */
  transactionHash: string;
  
  /** 交易在区块中的索引 */
  transactionIndex: number;
  
  /** 区块哈希 */
  blockHash: string;
  
  /** 区块号 */
  blockNumber: number;
  
  /** 发送方地址 */
  from: string;
  
  /** 接收方地址 */
  to: string | null;
  
  /** 累计gas使用量 */
  cumulativeGasUsed: string;
  
  /** 此交易使用的gas */
  gasUsed: string;
  
  /** 合约地址（如果是合约创建交易） */
  contractAddress?: string | null;
  
  /** 事件日志 */
  logs: TransactionLog[];
  
  /** 日志布隆过滤器 */
  logsBloom: string;
  
  /** 交易状态（1=成功, 0=失败） */
  status: boolean | number;
  
  /** 实际支付的gas价格 */
  effectiveGasPrice?: string;
  
  /** 交易类型 */
  type?: string;
}

/**
 * 交易详情接口
 * 从区块链查询到的完整交易信息
 */
export interface TransactionDetails {
  /** 交易哈希 */
  hash: string;
  
  /** 交易随机数 */
  nonce: number;
  
  /** 区块哈希（未确认时为null） */
  blockHash: string | null;
  
  /** 区块号（未确认时为null） */
  blockNumber: number | null;
  
  /** 交易在区块中的索引 */
  transactionIndex: number | null;
  
  /** 发送方地址 */
  from: string;
  
  /** 接收方地址 */
  to: string | null;
  
  /** 发送的以太币数量 */
  value: string;
  
  /** Gas价格 */
  gasPrice: string;
  
  /** Gas限制 */
  gas: string;
  
  /** 交易数据 */
  input: string;
  
  /** 签名参数 v */
  v?: string;
  
  /** 签名参数 r */
  r?: string;
  
  /** 签名参数 s */
  s?: string;
  
  /** EIP-1559字段 */
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
  
  /** 交易类型 */
  type?: number;
  
  /** 访问列表 */
  accessList?: AccessListEntry[];
}

/**
 * 交易日志接口
 * 智能合约事件产生的日志
 */
export interface TransactionLog {
  /** 日志索引 */
  logIndex: number;
  
  /** 交易索引 */
  transactionIndex: number;
  
  /** 交易哈希 */
  transactionHash: string;
  
  /** 区块哈希 */
  blockHash: string;
  
  /** 区块号 */
  blockNumber: number;
  
  /** 产生日志的合约地址 */
  address: string;
  
  /** 日志数据 */
  data: string;
  
  /** 主题数组（用于事件过滤） */
  topics: string[];
  
  /** 是否被移除（重组时） */
  removed?: boolean;
}

/**
 * Gas价格信息
 * 用于估算交易费用
 */
export interface GasPriceInfo {
  /** 标准gas价格 */
  standard: string;
  
  /** 快速确认gas价格 */
  fast: string;
  
  /** 最快确认gas价格 */
  fastest: string;
  
  /** 安全低价格（可能较慢） */
  safeLow: string;
  
  /** 基础费用（EIP-1559） */
  baseFee?: string;
  
  /** 建议的优先费用 */
  priorityFee?: string;
  
  /** 更新时间戳 */
  timestamp: number;
}

/**
 * 交易状态枚举
 * 表示交易的各种状态
 */
export enum TransactionStatus {
  /** 交易已创建但未发送 */
  CREATED = 'created',
  
  /** 交易已发送到内存池 */
  PENDING = 'pending',
  
  /** 交易已被矿工打包 */
  MINED = 'mined',
  
  /** 交易执行成功 */
  SUCCESS = 'success',
  
  /** 交易执行失败 */
  FAILED = 'failed',
  
  /** 交易被替换 */
  REPLACED = 'replaced',
  
  /** 交易被丢弃 */
  DROPPED = 'dropped',
  
  /** 交易超时 */
  TIMEOUT = 'timeout',
}

/**
 * 交易类型枚举
 * 以太坊支持的交易类型
 */
export enum TransactionType {
  /** 传统交易（EIP-155之前） */
  LEGACY = 0,
  
  /** EIP-2930: 可选访问列表 */
  EIP2930 = 1,
  
  /** EIP-1559: 费用市场 */
  EIP1559 = 2,
}

/**
 * 交易优先级
 * 用户选择的交易确认速度
 */
export enum TransactionPriority {
  /** 经济模式（低gas，慢确认） */
  ECONOMY = 'economy',
  
  /** 标准模式（中等gas，正常确认） */
  STANDARD = 'standard',
  
  /** 快速模式（高gas，快确认） */
  FAST = 'fast',
  
  /** 自定义gas设置 */
  CUSTOM = 'custom',
}

/**
 * 交易配置接口
 * 发送交易时的额外配置
 */
export interface TransactionConfig {
  /** 交易优先级 */
  priority?: TransactionPriority;
  
  /** 自定义gas价格 */
  customGasPrice?: string;
  
  /** 自定义gas限制 */
  customGasLimit?: string;
  
  /** 是否等待确认 */
  waitForConfirmation?: boolean;
  
  /** 需要的确认数 */
  confirmations?: number;
  
  /** 交易超时时间（毫秒） */
  timeout?: number;
  
  /** 是否允许替换交易 */
  allowReplacement?: boolean;
}

/**
 * 批量交易接口
 * 用于批量发送多个交易
 */
export interface BatchTransaction {
  /** 交易列表 */
  transactions: TransactionRequest[];
  
  /** 批量交易配置 */
  config?: {
    /** 是否按顺序执行 */
    sequential?: boolean;
    
    /** 单个交易失败时是否继续 */
    continueOnError?: boolean;
    
    /** 批量交易超时时间 */
    batchTimeout?: number;
  };
}

/**
 * 交易模拟结果
 * 预执行交易得到的结果
 */
export interface TransactionSimulation {
  /** 是否会成功 */
  success: boolean;
  
  /** 预估gas使用量 */
  gasUsed: string;
  
  /** 返回数据 */
  returnData?: string;
  
  /** 错误信息（如果失败） */
  error?: string;
  
  /** 状态变化 */
  stateChanges?: StateChange[];
  
  /** 事件日志 */
  logs?: TransactionLog[];
}

/**
 * 状态变化接口
 * 交易会导致的账户状态变化
 */
export interface StateChange {
  /** 账户地址 */
  address: string;
  
  /** 余额变化 */
  balanceChange?: string;
  
  /** 存储变化 */
  storageChanges?: {
    [key: string]: {
      from: string;
      to: string;
    };
  };
  
  /** 代码变化（合约创建） */
  codeChange?: {
    from: string;
    to: string;
  };
}

/**
 * 交易错误类型
 * 常见的交易错误
 */
export enum TransactionError {
  /** Gas不足 */
  OUT_OF_GAS = 'out_of_gas',
  
  /** 余额不足 */
  INSUFFICIENT_FUNDS = 'insufficient_funds',
  
  /** Nonce太低 */
  NONCE_TOO_LOW = 'nonce_too_low',
  
  /** Nonce太高 */
  NONCE_TOO_HIGH = 'nonce_too_high',
  
  /** Gas价格太低 */
  GAS_PRICE_TOO_LOW = 'gas_price_too_low',
  
  /** 交易被替换 */
  TRANSACTION_REPLACED = 'transaction_replaced',
  
  /** 网络错误 */
  NETWORK_ERROR = 'network_error',
  
  /** 用户拒绝 */
  USER_REJECTED = 'user_rejected',
  
  /** 合约执行失败 */
  EXECUTION_REVERTED = 'execution_reverted',
}

/**
 * 交易监控接口
 * 用于跟踪交易状态
 */
export interface TransactionMonitor {
  /** 交易哈希 */
  hash: string;
  
  /** 当前状态 */
  status: TransactionStatus;
  
  /** 确认数 */
  confirmations: number;
  
  /** 创建时间 */
  createdAt: number;
  
  /** 最后更新时间 */
  updatedAt: number;
  
  /** 交易详情 */
  transaction?: TransactionDetails;
  
  /** 交易回执 */
  receipt?: TransactionReceipt;
  
  /** 错误信息 */
  error?: string;
}

/**
 * 费用估算结果
 * Gas费用的详细估算
 */
export interface FeeEstimate {
  /** 预估的gas使用量 */
  gasLimit: string;
  
  /** 建议的gas价格 */
  gasPrice: string;
  
  /** 预估的交易费用（wei） */
  estimatedFee: string;
  
  /** EIP-1559费用估算 */
  eip1559?: {
    maxFeePerGas: string;
    maxPriorityFeePerGas: string;
    baseFee: string;
  };
  
  /** 不同优先级的费用选项 */
  options?: {
    [key in TransactionPriority]?: {
      gasPrice: string;
      estimatedFee: string;
      estimatedTime: number; // 预估确认时间（秒）
    };
  };
}