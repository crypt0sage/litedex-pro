export const MOCK_TOKENS = [
  { id: '1', symbol: 'LTC', name: 'Litecoin', price: 87.43, change24h: 3.21, volume24h: 412000000, logoUrl: 'https://cryptologos.cc/logos/litecoin-ltc-logo.png', address: '0x0000000000000000000000000000000000000001', chainId: 1 },
  { id: '2', symbol: 'wLTC', name: 'Wrapped Litecoin', price: 87.41, change24h: 3.19, volume24h: 98000000, logoUrl: 'https://cryptologos.cc/logos/litecoin-ltc-logo.png', address: '0x1234567890123456789012345678901234567890', chainId: 1 },
  { id: '3', symbol: 'USDT', name: 'Tether USD', price: 1.00, change24h: 0.01, volume24h: 2100000000, logoUrl: 'https://cryptologos.cc/logos/tether-usdt-logo.png', address: '0xdac17f958d2ee523a2206206994597c13d831ec7', chainId: 1 },
  { id: '4', symbol: 'USDC', name: 'USD Coin', price: 1.00, change24h: -0.02, volume24h: 1800000000, logoUrl: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png', address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', chainId: 1 },
  { id: '5', symbol: 'ETH', name: 'Ethereum', price: 3241.50, change24h: 1.87, volume24h: 890000000, logoUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', address: '0x0000000000000000000000000000000000000002', chainId: 1 },
  { id: '6', symbol: 'LDEX', name: 'LiteDEX Token', price: 2.14, change24h: 12.34, volume24h: 24000000, logoUrl: null, address: '0xabcdef1234567890abcdef1234567890abcdef12', chainId: 1 },
  { id: '7', symbol: 'BTC', name: 'Bitcoin', price: 67842.00, change24h: 2.14, volume24h: 1240000000, logoUrl: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png', address: '0x0000000000000000000000000000000000000003', chainId: 1 },
  { id: '8', symbol: 'DAI', name: 'Dai Stablecoin', price: 1.00, change24h: 0.00, volume24h: 320000000, logoUrl: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png', address: '0x6b175474e89094c44da98b954eedeac495271d0f', chainId: 1 },
]

export const MOCK_POOLS = [
  { id: '1', token0: { symbol: 'LTC', name: 'Litecoin' }, token1: { symbol: 'USDT', name: 'Tether' }, tvl: 42800000, apr: 24.7, volume24h: 8900000, userLiquidity: 12400 },
  { id: '2', token0: { symbol: 'LTC', name: 'Litecoin' }, token1: { symbol: 'ETH', name: 'Ethereum' }, tvl: 18200000, apr: 31.2, volume24h: 4200000, userLiquidity: 0 },
  { id: '3', token0: { symbol: 'wLTC', name: 'Wrapped LTC' }, token1: { symbol: 'USDC', name: 'USD Coin' }, tvl: 9700000, apr: 18.9, volume24h: 2100000, userLiquidity: 5600 },
  { id: '4', token0: { symbol: 'LDEX', name: 'LiteDEX Token' }, token1: { symbol: 'LTC', name: 'Litecoin' }, tvl: 5400000, apr: 87.3, volume24h: 1800000, userLiquidity: 0 },
  { id: '5', token0: { symbol: 'LTC', name: 'Litecoin' }, token1: { symbol: 'DAI', name: 'Dai' }, tvl: 7200000, apr: 22.1, volume24h: 1400000, userLiquidity: 0 },
  { id: '6', token0: { symbol: 'BTC', name: 'Bitcoin' }, token1: { symbol: 'LTC', name: 'Litecoin' }, tvl: 31500000, apr: 15.8, volume24h: 6700000, userLiquidity: 0 },
]

export const MOCK_FARMS = [
  { id: '1', name: 'LTC-USDT', stakedToken: 'LTC-USDT LP', rewardToken: 'LDEX', apr: 124.5, tvl: 8200000, userStaked: 2400, userRewards: 48.7 },
  { id: '2', name: 'LTC-ETH', stakedToken: 'LTC-ETH LP', rewardToken: 'LDEX', apr: 89.2, tvl: 4100000, userStaked: 0, userRewards: 0 },
  { id: '3', name: 'LDEX-LTC', stakedToken: 'LDEX-LTC LP', rewardToken: 'LDEX', apr: 312.7, tvl: 1900000, userStaked: 1200, userRewards: 124.3 },
  { id: '4', name: 'wLTC-USDC', stakedToken: 'wLTC-USDC LP', rewardToken: 'LDEX', apr: 67.8, tvl: 3400000, userStaked: 0, userRewards: 0 },
  { id: '5', name: 'BTC-LTC', stakedToken: 'BTC-LTC LP', rewardToken: 'LDEX', apr: 45.1, tvl: 11200000, userStaked: 0, userRewards: 0 },
]

export const MOCK_PROPOSALS = [
  { id: '1', title: 'LIP-12: Reduce swap fees to 0.25%', description: 'Proposal to reduce the base swap fee from 0.3% to 0.25% to improve competitiveness with other DEXes and increase trading volume.', status: 'active', votesFor: 2847000, votesAgainst: 812000, endTime: Date.now() + 86400000 * 3, proposer: '0xAbCd...EfGh' },
  { id: '2', title: 'LIP-11: Add BTC-LTC perpetual market', description: 'Enable perpetual futures trading for the BTC/LTC pair with up to 20x leverage. This expands LiteDEX trading capabilities significantly.', status: 'active', votesFor: 3241000, votesAgainst: 421000, endTime: Date.now() + 86400000 * 5, proposer: '0x1234...5678' },
  { id: '3', title: 'LIP-10: Treasury diversification into stablecoins', description: 'Move 30% of DAO treasury funds into USDC to reduce volatility exposure and ensure protocol runway.', status: 'passed', votesFor: 4100000, votesAgainst: 890000, endTime: Date.now() - 86400000 * 2, proposer: '0x9ABC...DEF0' },
  { id: '4', title: 'LIP-9: LDEX token buyback program', description: 'Allocate 15% of protocol revenue to buy back and burn LDEX tokens quarterly to support token value.', status: 'passed', votesFor: 5200000, votesAgainst: 340000, endTime: Date.now() - 86400000 * 10, proposer: '0x4567...89AB' },
  { id: '5', title: 'LIP-8: Emergency pause mechanism', description: 'Introduce a multisig-controlled emergency pause mechanism for security incidents.', status: 'failed', votesFor: 1200000, votesAgainst: 2800000, endTime: Date.now() - 86400000 * 20, proposer: '0xCDEF...0123' },
]

export const MOCK_BRIDGE_ROUTES = [
  { id: '1', fromChain: 'Litecoin', toChain: 'Ethereum', token: 'LTC', estimatedTime: '15-20 min', fee: 0.001, minAmount: 0.5, maxAmount: 10000 },
  { id: '2', fromChain: 'Litecoin', toChain: 'BSC', token: 'LTC', estimatedTime: '5-10 min', fee: 0.0008, minAmount: 0.1, maxAmount: 50000 },
  { id: '3', fromChain: 'Ethereum', toChain: 'Litecoin', token: 'wLTC', estimatedTime: '20-30 min', fee: 0.0015, minAmount: 0.5, maxAmount: 5000 },
  { id: '4', fromChain: 'BSC', toChain: 'Litecoin', token: 'bLTC', estimatedTime: '8-15 min', fee: 0.001, minAmount: 0.1, maxAmount: 20000 },
]

export const MOCK_TRANSACTIONS = [
  { hash: '0xabc123...def456', type: 'Swap', pair: 'LTC → USDT', amountIn: '10 LTC', amountOut: '$874.30', time: Date.now() - 30000, wallet: '0x742d...ace0' },
  { hash: '0x123abc...456def', type: 'Add Liquidity', pair: 'LTC/ETH', amountIn: '5 LTC', amountOut: '0.135 ETH', time: Date.now() - 120000, wallet: '0x8B4f...9c21' },
  { hash: '0xdeadbeef...cafe', type: 'Swap', pair: 'ETH → LTC', amountIn: '1 ETH', amountOut: '37.08 LTC', time: Date.now() - 240000, wallet: '0x1234...5678' },
  { hash: '0xcafe...babe', type: 'Remove Liquidity', pair: 'LTC/USDT', amountIn: '1000 LP', amountOut: '$12,400', time: Date.now() - 480000, wallet: '0xAbCd...EfGh' },
  { hash: '0x9876...5432', type: 'Swap', pair: 'USDC → LTC', amountIn: '$5,000', amountOut: '57.19 LTC', time: Date.now() - 720000, wallet: '0x5678...9ABC' },
  { hash: '0xface...cafe', type: 'Farm', pair: 'LTC-USDT LP', amountIn: '500 LP', amountOut: '12.4 LDEX', time: Date.now() - 1200000, wallet: '0xDEAD...BEEF' },
]

export const MOCK_PORTFOLIO = {
  totalValue: 48721.84,
  change24h: 3.21,
  tokens: [
    { symbol: 'LTC', balance: 247.3, value: 21617.34, change24h: 3.21 },
    { symbol: 'ETH', balance: 4.82, value: 15623.63, change24h: 1.87 },
    { symbol: 'USDT', balance: 8241.0, value: 8241.0, change24h: 0.01 },
    { symbol: 'LDEX', balance: 1124.5, value: 2406.43, change24h: 12.34 },
    { symbol: 'BTC', balance: 0.012, value: 814.10, change24h: 2.14 },
  ],
  positions: [
    { pair: 'LTC/USDT', type: 'LP', size: '$12,400', pnl: '+$842' },
    { pair: 'LTC/ETH', type: 'LP', size: '$5,600', pnl: '+$231' },
    { pair: 'LTC-PERP', type: 'Long 5x', size: '$4,800', pnl: '+$384' },
  ]
}

export function generatePriceHistory(basePrice, count = 100) {
  const history = []
  let price = basePrice
  const now = Date.now()
  for (let i = count; i >= 0; i--) {
    const time = Math.floor((now - i * 3600000) / 1000)
    const change = (Math.random() - 0.48) * price * 0.02
    const open = price
    price = Math.max(price + change, price * 0.5)
    const high = Math.max(open, price) * (1 + Math.random() * 0.005)
    const low = Math.min(open, price) * (1 - Math.random() * 0.005)
    const close = price
    const volume = Math.random() * 1000000 + 100000
    history.push({ time, open, high, low, close, value: close, volume })
  }
  return history
}
