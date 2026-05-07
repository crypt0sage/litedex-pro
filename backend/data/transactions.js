import { randomHex } from "../utils/crypto.js";

const wallets = [
  "0x4f3c8b2a1d9e7f6a5c4b3a2d1e0f9c8b7a6d5e4f",
  "0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b",
  "0x1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d",
  "0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f",
  "0xd1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0",
  "0xa2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1",
  "0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2",
];

const now = Date.now();
const MINUTE = 60_000;

function randWallet() {
  return wallets[Math.floor(Math.random() * wallets.length)];
}

function randRange(min, max) {
  return min + Math.random() * (max - min);
}

function makeTime(minsAgo) {
  return new Date(now - minsAgo * MINUTE).toISOString();
}

export const recentTransactions = [
  {
    hash: "0x" + "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
    type: "swap",
    pair: "LTC/USDT",
    amountIn: 12.5,
    amountOut: 1067.75,
    time: makeTime(2),
    wallet: wallets[0],
  },
  {
    hash: "0x" + "b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567a",
    type: "add_liquidity",
    pair: "LTC/USDT",
    amountIn: 500.0,
    amountOut: 42750.0,
    time: makeTime(5),
    wallet: wallets[1],
  },
  {
    hash: "0x" + "c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567ab2",
    type: "swap",
    pair: "ETH/USDC",
    amountIn: 1.2,
    amountOut: 4095.2,
    time: makeTime(8),
    wallet: wallets[2],
  },
  {
    hash: "0x" + "d4e5f6789012345678901234567890abcdef1234567890abcdef1234567ab2c3",
    type: "stake",
    pair: "LITESWAP",
    amountIn: 10000.0,
    amountOut: 10000.0,
    time: makeTime(12),
    wallet: wallets[3],
  },
  {
    hash: "0x" + "e5f6789012345678901234567890abcdef1234567890abcdef1234567ab2c3d4",
    type: "bridge",
    pair: "LTC→ETH",
    amountIn: 25.0,
    amountOut: 24.62,
    time: makeTime(17),
    wallet: wallets[4],
  },
  {
    hash: "0x" + "f6789012345678901234567890abcdef1234567890abcdef1234567ab2c3d4e5",
    type: "swap",
    pair: "BTC/USDT",
    amountIn: 0.15,
    amountOut: 9780.0,
    time: makeTime(24),
    wallet: wallets[5],
  },
  {
    hash: "0x" + "17890123456789012345678901234567890abcdef1234567890abcdef1234567",
    type: "remove_liquidity",
    pair: "wLTC/USDC",
    amountIn: 1200.0,
    amountOut: 1198.5,
    time: makeTime(31),
    wallet: wallets[6],
  },
  {
    hash: "0x" + "289012345678901234567890abcdef1234567890abcdef1234567890ab12345c",
    type: "swap",
    pair: "LTC/ETH",
    amountIn: 8.0,
    amountOut: 0.2003,
    time: makeTime(38),
    wallet: wallets[0],
  },
  {
    hash: "0x" + "390123456789012345678901234567890abcdef1234567890abcdef12345678d",
    type: "stake",
    pair: "LTC-USDT LP",
    amountIn: 3400.0,
    amountOut: 3400.0,
    time: makeTime(45),
    wallet: wallets[1],
  },
  {
    hash: "0x" + "4a0123456789012345678901234567890abcdef1234567890abcdef12345678e",
    type: "add_liquidity",
    pair: "LTC/LITESWAP",
    amountIn: 200.0,
    amountOut: 40388.0,
    time: makeTime(52),
    wallet: wallets[2],
  },
  {
    hash: "0x" + "5b0123456789012345678901234567890abcdef1234567890abcdef12345678f",
    type: "bridge",
    pair: "LTC→BSC",
    amountIn: 50.0,
    amountOut: 49.25,
    time: makeTime(61),
    wallet: wallets[3],
  },
  {
    hash: "0x" + "6c0123456789012345678901234567890abcdef1234567890abcdef12345679a",
    type: "swap",
    pair: "LTC/USDT",
    amountIn: 200.0,
    amountOut: 17084.0,
    time: makeTime(73),
    wallet: wallets[4],
  },
  {
    hash: "0x" + "7d0123456789012345678901234567890abcdef1234567890abcdef12345679b",
    type: "swap",
    pair: "LITESWAP/USDC",
    amountIn: 5000.0,
    amountOut: 2118.5,
    time: makeTime(81),
    wallet: wallets[5],
  },
  {
    hash: "0x" + "8e0123456789012345678901234567890abcdef1234567890abcdef12345679c",
    type: "remove_liquidity",
    pair: "ETH/USDC",
    amountIn: 8500.0,
    amountOut: 8492.0,
    time: makeTime(94),
    wallet: wallets[6],
  },
  {
    hash: "0x" + "9f0123456789012345678901234567890abcdef1234567890abcdef12345679d",
    type: "swap",
    pair: "LTC/USDT",
    amountIn: 5.75,
    amountOut: 491.16,
    time: makeTime(108),
    wallet: wallets[0],
  },
  {
    hash: "0x" + "af0123456789012345678901234567890abcdef1234567890abcdef12345679e",
    type: "stake",
    pair: "LTC-ETH LP",
    amountIn: 620.0,
    amountOut: 620.0,
    time: makeTime(120),
    wallet: wallets[1],
  },
  {
    hash: "0x" + "bf0123456789012345678901234567890abcdef1234567890abcdef12345679f",
    type: "bridge",
    pair: "ETH→LTC",
    amountIn: 2.0,
    amountOut: 79.85,
    time: makeTime(136),
    wallet: wallets[2],
  },
  {
    hash: "0x" + "cf0123456789012345678901234567890abcdef1234567890abcdef1234567a0",
    type: "add_liquidity",
    pair: "ETH/USDC",
    amountIn: 0.5,
    amountOut: 1706.33,
    time: makeTime(152),
    wallet: wallets[3],
  },
  {
    hash: "0x" + "df0123456789012345678901234567890abcdef1234567890abcdef1234567a1",
    type: "swap",
    pair: "BTC/USDT",
    amountIn: 0.08,
    amountOut: 5216.0,
    time: makeTime(167),
    wallet: wallets[4],
  },
  {
    hash: "0x" + "ef0123456789012345678901234567890abcdef1234567890abcdef1234567a2",
    type: "swap",
    pair: "LTC/ETH",
    amountIn: 30.0,
    amountOut: 0.751,
    time: makeTime(183),
    wallet: wallets[5],
  },
];
