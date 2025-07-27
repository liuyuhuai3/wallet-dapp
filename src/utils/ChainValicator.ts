// utils/ChainValidator.ts
import { ChainConfig } from '../types/chain';

export class ChainValidator {
  /**
   * 验证链ID格式
   */
  static isValidChainId(chainId: string): boolean {
    // 检查是否为有效的十六进制格式
    return /^0x[a-fA-F0-9]+$/.test(chainId) && chainId.length > 2;
  }

  /**
   * 验证RPC URL格式
   */
  static isValidRpcUrl(url: string): boolean {
    try {
      const parsed = new URL(url);
      return ['http:', 'https:', 'ws:', 'wss:'].includes(parsed.protocol);
    } catch {
      return false;
    }
  }

  /**
   * 验证区块浏览器URL格式
   */
  static isValidExplorerUrl(url: string): boolean {
    try {
      const parsed = new URL(url);
      return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
      return false;
    }
  }

  /**
   * 验证图标URL格式
   */
  static isValidIconUrl(url: string): boolean {
    try {
      const parsed = new URL(url);
      return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
      return false;
    }
  }

  /**
   * 验证原生代币配置
   */
  static validateNativeCurrency(currency: ChainConfig['nativeCurrency']): string[] {
    const errors: string[] = [];

    if (!currency.name || currency.name.trim().length === 0) {
      errors.push('Native currency name is required');
    }

    if (!currency.symbol || currency.symbol.trim().length === 0) {
      errors.push('Native currency symbol is required');
    }

    if (currency.decimals < 0 || currency.decimals > 18) {
      errors.push('Native currency decimals must be between 0 and 18');
    }

    return errors;
  }

  /**
   * 验证完整的链配置
   */
  static validateChainConfig(config: ChainConfig): { 
    isValid: boolean; 
    errors: string[] 
  } {
    const errors: string[] = [];

    // 验证链ID
    if (!config.chainId) {
      errors.push('Chain ID is required');
    } else if (!this.isValidChainId(config.chainId)) {
      errors.push('Invalid chain ID format (must be hex string starting with 0x)');
    }

    // 验证链名称
    if (!config.chainName || config.chainName.trim().length === 0) {
      errors.push('Chain name is required');
    }

    // 验证RPC URLs
    if (!config.rpcUrls || config.rpcUrls.length === 0) {
      errors.push('At least one RPC URL is required');
    } else {
      config.rpcUrls.forEach((url, index) => {
        if (!this.isValidRpcUrl(url)) {
          errors.push(`Invalid RPC URL at index ${index}: ${url}`);
        }
      });
    }

    // 验证原生代币
    const currencyErrors = this.validateNativeCurrency(config.nativeCurrency);
    errors.push(...currencyErrors);

    // 验证区块浏览器URLs（可选）
    if (config.blockExplorerUrls) {
      config.blockExplorerUrls.forEach((url, index) => {
        if (!this.isValidExplorerUrl(url)) {
          errors.push(`Invalid block explorer URL at index ${index}: ${url}`);
        }
      });
    }

    // 验证图标URLs（可选）
    if (config.iconUrls) {
      config.iconUrls.forEach((url, index) => {
        if (!this.isValidIconUrl(url)) {
          errors.push(`Invalid icon URL at index ${index}: ${url}`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * 规范化链ID（确保小写）
   */
  static normalizeChainId(chainId: string): string {
    return chainId.toLowerCase();
  }

  /**
   * 将十进制链ID转换为十六进制
   */
  static decimalToHexChainId(decimal: number): string {
    return `0x${decimal.toString(16)}`;
  }

  /**
   * 将十六进制链ID转换为十进制
   */
  static hexToDecimalChainId(hex: string): number {
    return parseInt(hex, 16);
  }

  /**
   * 检查两个链配置是否相同
   */
  static isSameChain(config1: ChainConfig, config2: ChainConfig): boolean {
    return this.normalizeChainId(config1.chainId) === this.normalizeChainId(config2.chainId);
  }

  /**
   * 清理和规范化链配置
   */
  static sanitizeChainConfig(config: ChainConfig): ChainConfig {
    return {
      ...config,
      chainId: this.normalizeChainId(config.chainId),
      chainName: config.chainName.trim(),
      nativeCurrency: {
        ...config.nativeCurrency,
        name: config.nativeCurrency.name.trim(),
        symbol: config.nativeCurrency.symbol.trim().toUpperCase(),
      },
      rpcUrls: config.rpcUrls.map(url => url.trim()),
      blockExplorerUrls: config.blockExplorerUrls?.map(url => url.trim()),
      iconUrls: config.iconUrls?.map(url => url.trim()),
    };
  }
}