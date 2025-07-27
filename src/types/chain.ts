// types/chain.ts
export interface ChainConfig {
  chainId: string;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
  iconUrls?: string[];
}

// types/network.ts
export interface NetworkClient {
  chainId: string;
  rpcUrl: string;
  provider: any;
}

export interface NetworkHealth {
  isHealthy: boolean;
  latency?: number;
  blockNumber?: number;
  lastChecked: number;
}

// types/events.ts
export interface ChainChangedEvent {
  previousChainId: string;
  currentChainId: string;
  chainConfig: ChainConfig;
}

export interface ChainAddedEvent {
  chainConfig: ChainConfig;
}

export type ChainManagerEvents = {
  chainChanged: ChainChangedEvent;
  chainAdded: ChainAddedEvent;
  networkError: { chainId: string; error: Error };
};

// types/transaction.ts
export interface TransactionRequest {
  to?: string;
  value?: string;
  data?: string;
  gas?: string;
  gasPrice?: string;
  nonce?: number;
}

export interface TransactionReceipt {
  transactionHash: string;
  blockNumber: number;
  gasUsed: string;
  status: boolean;
}