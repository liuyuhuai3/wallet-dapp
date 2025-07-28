# 🔗 Multi-Chain Wallet DApp

一个基于 Next.js + Wagmi + RainbowKit 构建的现代化多链钱包去中心化应用(DApp)，支持多种区块链网络的钱包连接、链切换、合约交互和交易功能。

## ✨ 主要功能

### 🎯 核心功能
- **多钱包连接支持** - 支持 MetaMask、WalletConnect 等主流钱包
- **多链网络支持** - 支持 6 条主流区块链网络
- **实时链切换** - 一键切换不同区块链网络
- **交易发送** - 支持原生代币转账功能
- **合约读取** - 智能合约数据查询功能
- **NFT 铸造** - NFT 创建和铸造功能

### 🌐 支持的区块链网络
- **Ethereum Mainnet** - 以太坊主网
- **Polygon Mainnet** - Polygon 主网
- **BNB Smart Chain** - 币安智能链
- **Arbitrum One** - Arbitrum Layer 2
- **Optimism** - Optimism Layer 2
- **Sepolia Testnet** - 以太坊测试网 (推荐测试使用)

### 🎨 链选择器组件
提供三种不同风格的链选择器：

1. **基础版本** - 简洁的链选择器，显示基本信息
2. **紧凑版本** - 紧凑设计，适合小空间使用
3. **健康监控版本** - 显示网络健康状态和延迟信息

## 🚀 快速开始

### 环境要求
- Node.js 18.0+
- npm 或 yarn
- MetaMask 浏览器插件

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本
```bash
npm run build
npm start
```

## 🏗️ 项目结构

```
src/
├── app/                          # Next.js App Router
│   ├── components/              # React 组件
│   │   ├── SimpleChainSelector.tsx  # 链选择器组件
│   │   ├── send-transaction.tsx     # 交易发送组件
│   │   ├── Connect.tsx             # 钱包连接组件
│   │   └── account.tsx             # 账户信息组件
│   ├── page.tsx                 # 主页面
│   ├── layout.tsx               # 页面布局
│   └── globals.css              # 全局样式
├── content/
│   └── chain.ts                 # 区块链配置
├── services/                    # 业务逻辑服务
│   ├── ChainManager.ts          # 链管理服务
│   └── NetworkClientManager.ts  # 网络客户端管理
├── hooks/                       # 自定义 React Hooks
│   └── useChainManager.ts       # 链管理 Hook
├── types/                       # TypeScript 类型定义
│   ├── chain.ts
│   ├── network.ts
│   └── transaction.ts
├── utils/                       # 工具函数
│   ├── ChainValidator.ts        # 链验证工具
│   └── EventManager.ts          # 事件管理工具
└── wagmi.config.ts              # Wagmi 配置
```

## 🔧 技术栈

### 前端框架
- **Next.js 15** - React 全栈框架
- **React 19** - 用户界面库
- **TypeScript** - 类型安全的 JavaScript

### Web3 工具
- **Wagmi** - React Hooks for Ethereum
- **RainbowKit** - 钱包连接 UI 组件库
- **Viem** - 轻量级以太坊交互库
- **Ethers.js** - 以太坊 JavaScript 库

### 样式和 UI
- **Tailwind CSS** - 实用优先的 CSS 框架
- **CSS Modules** - 局部作用域 CSS

## 📖 使用指南

### 1. 连接钱包
1. 访问应用主页
2. 点击右上角的 **"Connect Wallet"** 按钮
3. 选择您的钱包 (推荐使用 MetaMask)
4. 授权连接

### 2. 切换区块链网络
- 使用页面右上角的链选择器切换网络
- 或在演示区域体验不同版本的链选择器

### 3. 发送交易 (Sepolia 测试网)
1. 确保已连接到 Sepolia 测试网
2. 在 **"💸 发送交易"** 卡片中输入：
   - 接收地址 (0x...)
   - 转账金额 (ETH)
3. 点击 **"发送交易"** 按钮
4. 在 MetaMask 中确认交易

### 4. 获取测试币
访问以下测试币水龙头获取免费的 Sepolia ETH：
- [sepoliafaucet.com](https://sepoliafaucet.com)
- [sepolia-faucet.pk910.de](https://sepolia-faucet.pk910.de)
- [faucets.chain.link](https://faucets.chain.link) (选择 Sepolia)

### 5. 合约交互
- **合约读取** - 在相应卡片中查询智能合约数据
- **NFT 铸造** - 使用 NFT 铸造功能创建数字资产

## ⚙️ 配置说明

### 环境变量
创建 `.env.local` 文件并添加以下变量：
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_INFURA_KEY=your_infura_key
```

### 自定义链配置
在 `src/content/chain.ts` 中可以添加新的区块链网络：
```typescript
export const YOUR_CHAIN: ChainConfig = {
  chainId: '0x...',
  chainName: 'Your Chain Name',
  nativeCurrency: {
    name: 'Token Name',
    symbol: 'SYMBOL',
    decimals: 18,
  },
  rpcUrls: ['https://your-rpc-url'],
  blockExplorerUrls: ['https://your-explorer-url'],
  iconUrls: ['https://your-icon-url']
};
```

## 🛠️ 开发说明

### 本地开发
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 代码检查
npm run lint

# 构建项目
npm run build
```

### 添加新功能
1. 在 `src/app/components/` 下创建新组件
2. 在 `src/types/` 下定义相关类型
3. 在 `src/services/` 下实现业务逻辑
4. 在主页面中集成新功能

## 🔒 安全注意事项

- ⚠️ 请勿在主网环境中使用未经充分测试的代码
- 🧪 建议首先在测试网 (Sepolia) 上进行功能测试
- 🔐 永远不要在代码中硬编码私钥或助记词
- 💰 进行主网交易前请仔细确认所有参数

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🔗 相关链接

- [Next.js 文档](https://nextjs.org/docs)
- [Wagmi 文档](https://wagmi.sh)
- [RainbowKit 文档](https://www.rainbowkit.com)
- [Ethers.js 文档](https://docs.ethers.org)

## 📞 联系方式

如有问题或建议，请提交 [Issue](../../issues)。

---

**⚡ 体验现代化的 Web3 用户界面和无缝的跨链交互！**