import express from "express";
import cors from "cors";
import { createServer } from "http";
import { join } from "path";
import { existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

import { tokens, getTokenBySymbol } from "./data/tokens.js";
import { pools, getPoolById } from "./data/pools.js";
import { farms } from "./data/farms.js";
import { proposals } from "./data/proposals.js";
import { recentTransactions } from "./data/transactions.js";
import { generateTxHash } from "./utils/crypto.js";
import { generateOHLCV, generatePriceHistory } from "./utils/ohlcv.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const VERSION = "1.0.0";

// ─── Middleware ──────────────────────────────────────────────────────────────

app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "10mb" }));

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const ms = Date.now() - start;
    console.log(`${req.method} ${req.path} → ${res.statusCode} (${ms}ms)`);
  });
  next();
});

// ─── Static Files (production frontend) ─────────────────────────────────────

const distPath = join(process.cwd(), "dist");
if (existsSync(distPath)) {
  app.use(express.static(distPath));
}

// ─── Health ──────────────────────────────────────────────────────────────────

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: VERSION,
  });
});

// Alias
app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime(), version: VERSION });
});

// ─── Service Info ─────────────────────────────────────────────────────────────

app.get("/api", (req, res) => {
  res.json({
    name: "LiteDEX API",
    version: VERSION,
    description:
      "REST API for the LiteDEX decentralized exchange on the Litecoin ecosystem",
    health: "/api/health",
    docs: "/docs",
    endpoints: [
      "GET  /api/tokens",
      "GET  /api/pools",
      "GET  /api/pools/:id",
      "GET  /api/farms",
      "GET  /api/governance/proposals",
      "POST /api/governance/vote",
      "GET  /api/portfolio/:address",
      "GET  /api/price/:symbol",
      "GET  /api/bridge/routes",
      "POST /api/swap/quote",
      "POST /api/ai/suggest",
      "GET  /api/transactions/recent",
    ],
  });
});

// ─── Docs ─────────────────────────────────────────────────────────────────────

app.get("/docs", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>LiteDEX API Docs</title>
<style>
  :root {
    --bg: #0a0e1a;
    --surface: #111827;
    --border: #1f2d3d;
    --accent: #4ade80;
    --accent2: #22d3ee;
    --text: #e2e8f0;
    --muted: #64748b;
    --danger: #f87171;
    --warn: #fbbf24;
    --method-get: #22d3ee;
    --method-post: #4ade80;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--bg); color: var(--text); font-family: 'SF Mono', 'Fira Code', monospace; }
  header { background: var(--surface); border-bottom: 1px solid var(--border); padding: 24px 48px; display: flex; align-items: center; gap: 16px; }
  header h1 { font-size: 22px; font-weight: 700; color: var(--accent); letter-spacing: -0.5px; }
  header span { color: var(--muted); font-size: 13px; }
  .badge { background: #0f2d1f; color: var(--accent); border: 1px solid #16532d; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
  main { max-width: 900px; margin: 0 auto; padding: 48px 24px; }
  .intro { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 24px; margin-bottom: 40px; }
  .intro p { color: var(--muted); line-height: 1.7; font-size: 14px; font-family: -apple-system, sans-serif; }
  .intro p strong { color: var(--text); }
  h2 { font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: var(--muted); margin-bottom: 20px; margin-top: 48px; }
  h2:first-of-type { margin-top: 0; }
  .endpoint { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; margin-bottom: 16px; overflow: hidden; }
  .endpoint-header { display: flex; align-items: center; gap: 12px; padding: 16px 20px; cursor: pointer; }
  .method { font-size: 11px; font-weight: 800; padding: 3px 10px; border-radius: 6px; letter-spacing: 1px; min-width: 48px; text-align: center; }
  .GET  { background: #0c2a35; color: var(--method-get); border: 1px solid #164e63; }
  .POST { background: #0f2d1f; color: var(--method-post); border: 1px solid #16532d; }
  .path { font-size: 14px; color: var(--text); }
  .desc { color: var(--muted); font-size: 13px; margin-left: auto; font-family: -apple-system, sans-serif; }
  .endpoint-body { border-top: 1px solid var(--border); padding: 20px; display: none; }
  .endpoint-body.open { display: block; }
  .section-label { font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: var(--muted); margin-bottom: 8px; }
  pre { background: #07111f; border: 1px solid var(--border); border-radius: 8px; padding: 16px; font-size: 12px; overflow-x: auto; line-height: 1.6; color: #a8dadc; margin-bottom: 16px; }
  .note { background: #1a1205; border: 1px solid #3d2c00; border-radius: 8px; padding: 12px 16px; font-size: 12px; color: var(--warn); font-family: -apple-system, sans-serif; margin-bottom: 12px; }
  a { color: var(--accent2); text-decoration: none; }
</style>
</head>
<body>
<header>
  <h1>⚡ LiteDEX API</h1>
  <span>v${VERSION}</span>
  <div class="badge">LIVE</div>
</header>
<main>
  <div class="intro">
    <p><strong>LiteDEX API</strong> powers the LiteDEX decentralized exchange on the Litecoin ecosystem. All responses include realistic mock data for tokens, pools, farms, governance, and cross-chain bridge routes. Base URL: <strong>${req.protocol}://${req.get("host")}</strong></p>
  </div>

  <h2>Core Endpoints</h2>

  <div class="endpoint">
    <div class="endpoint-header" onclick="this.nextElementSibling.classList.toggle('open')">
      <span class="method GET">GET</span>
      <span class="path">/api/tokens</span>
      <span class="desc">All supported tokens with live prices</span>
    </div>
    <div class="endpoint-body">
      <div class="section-label">Response</div>
      <pre>{ "success": true, "data": [{ "id": "ltc", "symbol": "LTC", "name": "Litecoin", "price": 85.42, "change24h": 2.34, "volume24h": 412800000, "logoUrl": "...", "address": "0x...", "chainId": 1 }] }</pre>
      <div class="section-label">cURL</div>
      <pre>curl ${req.protocol}://${req.get("host")}/api/tokens</pre>
    </div>
  </div>

  <div class="endpoint">
    <div class="endpoint-header" onclick="this.nextElementSibling.classList.toggle('open')">
      <span class="method GET">GET</span>
      <span class="path">/api/pools</span>
      <span class="desc">All liquidity pools with TVL and APR</span>
    </div>
    <div class="endpoint-body">
      <div class="section-label">Response</div>
      <pre>{ "success": true, "data": [{ "id": "pool-ltc-usdt", "token0": { "symbol": "LTC", ... }, "token1": { "symbol": "USDT", ... }, "tvl": 4820000, "apr": 18.4, "volume24h": 1240000 }] }</pre>
      <div class="section-label">cURL</div>
      <pre>curl ${req.protocol}://${req.get("host")}/api/pools</pre>
    </div>
  </div>

  <div class="endpoint">
    <div class="endpoint-header" onclick="this.nextElementSibling.classList.toggle('open')">
      <span class="method GET">GET</span>
      <span class="path">/api/pools/:id</span>
      <span class="desc">Single pool with 90-day price history</span>
    </div>
    <div class="endpoint-body">
      <div class="section-label">Example</div>
      <pre>curl ${req.protocol}://${req.get("host")}/api/pools/pool-ltc-usdt</pre>
      <div class="section-label">Response</div>
      <pre>{ "success": true, "data": { "id": "pool-ltc-usdt", "tvl": 4820000, "apr": 18.4, "fee": 0.3, "priceRatio": 85.42, "priceHistory": [{ "time": 1710000000, "value": 83.12 }, ...] } }</pre>
    </div>
  </div>

  <div class="endpoint">
    <div class="endpoint-header" onclick="this.nextElementSibling.classList.toggle('open')">
      <span class="method POST">POST</span>
      <span class="path">/api/swap/quote</span>
      <span class="desc">Get a swap quote with price impact</span>
    </div>
    <div class="endpoint-body">
      <div class="section-label">Request Body</div>
      <pre>{ "tokenIn": "LTC", "tokenOut": "USDT", "amountIn": 10, "slippage": 0.5 }</pre>
      <div class="section-label">Response</div>
      <pre>{ "success": true, "data": { "amountOut": 854.2, "priceImpact": 0.12, "fee": 2.5626, "route": ["LTC", "USDT"], "minAmountOut": 849.93 } }</pre>
      <div class="section-label">cURL</div>
      <pre>curl -X POST ${req.protocol}://${req.get("host")}/api/swap/quote \\
  -H 'Content-Type: application/json' \\
  -d '{"tokenIn":"LTC","tokenOut":"USDT","amountIn":10,"slippage":0.5}'</pre>
    </div>
  </div>

  <div class="endpoint">
    <div class="endpoint-header" onclick="this.nextElementSibling.classList.toggle('open')">
      <span class="method POST">POST</span>
      <span class="path">/api/governance/vote</span>
      <span class="desc">Submit a governance vote</span>
    </div>
    <div class="endpoint-body">
      <div class="section-label">Request Body</div>
      <pre>{ "proposalId": "prop-001", "vote": "for", "walletAddress": "0x4f3c8b..." }</pre>
      <div class="section-label">Response</div>
      <pre>{ "success": true, "data": { "proposalId": "prop-001", "vote": "for", "txHash": "0xabc123..." } }</pre>
      <div class="section-label">cURL</div>
      <pre>curl -X POST ${req.protocol}://${req.get("host")}/api/governance/vote \\
  -H 'Content-Type: application/json' \\
  -d '{"proposalId":"prop-001","vote":"for","walletAddress":"0x4f3c8b2a..."}'</pre>
    </div>
  </div>

  <div class="endpoint">
    <div class="endpoint-header" onclick="this.nextElementSibling.classList.toggle('open')">
      <span class="method POST">POST</span>
      <span class="path">/api/ai/suggest</span>
      <span class="desc">AI-powered trading suggestions</span>
    </div>
    <div class="endpoint-body">
      <div class="section-label">Request Body</div>
      <pre>{ "riskProfile": "medium", "portfolio": [{ "symbol": "LTC", "balance": 100 }] }</pre>
      <div class="section-label">Response</div>
      <pre>{ "success": true, "data": { "suggestions": [{ "action": "BUY", "pair": "LTC/USDT", "reasoning": "...", "confidence": 0.78, "expectedReturn": "+12.4%" }], "marketSentiment": "Bullish" } }</pre>
      <div class="section-label">cURL</div>
      <pre>curl -X POST ${req.protocol}://${req.get("host")}/api/ai/suggest \\
  -H 'Content-Type: application/json' \\
  -d '{"riskProfile":"high"}'</pre>
    </div>
  </div>

  <div class="endpoint">
    <div class="endpoint-header" onclick="this.nextElementSibling.classList.toggle('open')">
      <span class="method GET">GET</span>
      <span class="path">/api/price/:symbol</span>
      <span class="desc">Token price with 90-day OHLCV history</span>
    </div>
    <div class="endpoint-body">
      <div class="section-label">Example</div>
      <pre>curl ${req.protocol}://${req.get("host")}/api/price/LTC</pre>
      <div class="section-label">Response</div>
      <pre>{ "success": true, "data": { "symbol": "LTC", "price": 85.42, "change24h": 2.34, "high24h": 87.1, "low24h": 83.5, "volume24h": 412800000, "history": [{ "time": 1710000000, "open": 82.1, "high": 84.2, "low": 81.5, "close": 83.4, "volume": 2400000 }, ...] } }</pre>
    </div>
  </div>

  <div class="endpoint">
    <div class="endpoint-header" onclick="this.nextElementSibling.classList.toggle('open')">
      <span class="method GET">GET</span>
      <span class="path">/api/bridge/routes</span>
      <span class="desc">Cross-chain bridge routes</span>
    </div>
    <div class="endpoint-body">
      <div class="section-label">cURL</div>
      <pre>curl ${req.protocol}://${req.get("host")}/api/bridge/routes</pre>
      <div class="section-label">Response</div>
      <pre>{ "success": true, "data": [{ "id": "ltc-eth-usdt", "fromChain": "Litecoin", "toChain": "Ethereum", "token": "USDT", "estimatedTime": "15–25 min", "fee": "0.15%", "minAmount": 10, "maxAmount": 50000 }] }</pre>
    </div>
  </div>

  <div class="endpoint">
    <div class="endpoint-header" onclick="this.nextElementSibling.classList.toggle('open')">
      <span class="method GET">GET</span>
      <span class="path">/api/portfolio/:address</span>
      <span class="desc">Portfolio overview for a wallet</span>
    </div>
    <div class="endpoint-body">
      <div class="section-label">Example</div>
      <pre>curl ${req.protocol}://${req.get("host")}/api/portfolio/0x4f3c8b2a...</pre>
    </div>
  </div>

</main>
<script>
  // All sections collapsed by default — click to expand
</script>
</body>
</html>`);
});

// ─── Tokens ───────────────────────────────────────────────────────────────────

app.get("/api/tokens", (req, res) => {
  res.json({ success: true, data: tokens });
});

// ─── Pools ────────────────────────────────────────────────────────────────────

app.get("/api/pools", (req, res) => {
  res.json({ success: true, data: pools });
});

app.get("/api/pools/:id", (req, res) => {
  const pool = getPoolById(req.params.id);
  if (!pool) {
    return res
      .status(404)
      .json({ success: false, error: { code: "NOT_FOUND", message: `Pool '${req.params.id}' not found` } });
  }

  const priceHistory = generatePriceHistory(pool.priceRatio, 90);

  res.json({
    success: true,
    data: {
      ...pool,
      priceHistory,
    },
  });
});

// ─── Farms ────────────────────────────────────────────────────────────────────

app.get("/api/farms", (req, res) => {
  res.json({ success: true, data: farms });
});

// ─── Governance ──────────────────────────────────────────────────────────────

app.get("/api/governance/proposals", (req, res) => {
  res.json({ success: true, data: proposals });
});

app.post("/api/governance/vote", (req, res) => {
  const { proposalId, vote, walletAddress } = req.body || {};

  if (!proposalId || typeof proposalId !== "string") {
    return res.status(400).json({
      success: false,
      error: { code: "INVALID_INPUT", message: "proposalId is required" },
    });
  }
  if (!vote || !["for", "against"].includes(vote)) {
    return res.status(400).json({
      success: false,
      error: { code: "INVALID_INPUT", message: "vote must be 'for' or 'against'" },
    });
  }
  if (!walletAddress || typeof walletAddress !== "string") {
    return res.status(400).json({
      success: false,
      error: { code: "INVALID_INPUT", message: "walletAddress is required" },
    });
  }

  const proposal = proposals.find((p) => p.id === proposalId);
  if (!proposal) {
    return res.status(404).json({
      success: false,
      error: { code: "NOT_FOUND", message: `Proposal '${proposalId}' not found` },
    });
  }

  const txHash = generateTxHash();

  res.json({
    success: true,
    data: {
      proposalId,
      vote,
      txHash,
      walletAddress,
      timestamp: new Date().toISOString(),
    },
  });
});

// ─── Portfolio ────────────────────────────────────────────────────────────────

app.get("/api/portfolio/:address", (req, res) => {
  const address = req.params.address;

  // Generate deterministic-ish but realistic portfolio data from address hash
  const seed = address.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const rng = (n) => ((seed * 9301 + 49297) % 233280) / 233280 * n;

  const ltcBalance = 42.5 + (seed % 100);
  const ethBalance = 1.8 + (seed % 20) / 10;
  const usdtBalance = 1240 + (seed % 3000);
  const liteswapBalance = 5000 + (seed % 15000);
  const wltcBalance = 10 + (seed % 50);

  const ltcValue = ltcBalance * 85.42;
  const ethValue = ethBalance * 3412.67;
  const usdtValue = usdtBalance;
  const liteswapValue = liteswapBalance * 0.4237;
  const wltcValue = wltcBalance * 85.38;

  const totalValue = ltcValue + ethValue + usdtValue + liteswapValue + wltcValue;

  res.json({
    success: true,
    data: {
      address,
      totalValue: parseFloat(totalValue.toFixed(2)),
      change24h: parseFloat((2.14 + (seed % 400) / 100 - 2).toFixed(2)),
      tokens: [
        { symbol: "LTC", balance: parseFloat(ltcBalance.toFixed(4)), value: parseFloat(ltcValue.toFixed(2)), change24h: 2.34 },
        { symbol: "ETH", balance: parseFloat(ethBalance.toFixed(4)), value: parseFloat(ethValue.toFixed(2)), change24h: -1.28 },
        { symbol: "USDT", balance: parseFloat(usdtBalance.toFixed(2)), value: parseFloat(usdtValue.toFixed(2)), change24h: 0.02 },
        { symbol: "LITESWAP", balance: parseFloat(liteswapBalance.toFixed(2)), value: parseFloat(liteswapValue.toFixed(2)), change24h: 5.82 },
        { symbol: "wLTC", balance: parseFloat(wltcBalance.toFixed(4)), value: parseFloat(wltcValue.toFixed(2)), change24h: 2.31 },
      ],
      positions: [
        {
          pair: "LTC/USDT",
          type: "lp",
          size: parseFloat((ltcValue * 0.3).toFixed(2)),
          pnl: parseFloat((ltcValue * 0.03).toFixed(2)),
          apr: 18.4,
          poolId: "pool-ltc-usdt",
        },
        {
          pair: "LTC/ETH",
          type: "lp",
          size: parseFloat((ltcValue * 0.15).toFixed(2)),
          pnl: parseFloat((ltcValue * 0.018).toFixed(2)),
          apr: 32.7,
          poolId: "pool-ltc-eth",
        },
        {
          pair: "LTC/USDT",
          type: "long",
          size: parseFloat((ltcBalance * 5).toFixed(4)),
          pnl: parseFloat((ltcBalance * 5 * 0.0234).toFixed(2)),
          leverage: "3x",
        },
        {
          pair: "ETH/USDC",
          type: "lp",
          size: parseFloat((ethValue * 0.2).toFixed(2)),
          pnl: parseFloat((ethValue * -0.008).toFixed(2)),
          apr: 12.8,
          poolId: "pool-eth-usdc",
        },
      ],
      stakedFarms: [
        { farmId: "farm-ltc-usdt-lp", staked: parseFloat((1400 + (seed % 2000)).toFixed(2)), pendingRewards: parseFloat((120 + (seed % 400)).toFixed(4)) },
        { farmId: "farm-liteswap-single", staked: parseFloat(liteswapBalance.toFixed(2)), pendingRewards: parseFloat((280 + (seed % 600)).toFixed(4)) },
      ],
    },
  });
});

// ─── Price ────────────────────────────────────────────────────────────────────

app.get("/api/price/:symbol", (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  const token = getTokenBySymbol(symbol);

  if (!token) {
    return res.status(404).json({
      success: false,
      error: { code: "NOT_FOUND", message: `Token '${symbol}' not found` },
    });
  }

  const history = generateOHLCV(token.price * 0.88, 90);
  // Ensure the last close is close to the current price
  if (history.length > 0) {
    history[history.length - 1].close = token.price;
  }

  // Derive 24h stats from last two candles
  const last = history[history.length - 1];
  const prev = history[history.length - 2] || last;
  const high24h = parseFloat((token.price * 1.018).toFixed(8));
  const low24h = parseFloat((token.price * 0.978).toFixed(8));

  res.json({
    success: true,
    data: {
      symbol: token.symbol,
      name: token.name,
      price: token.price,
      change24h: token.change24h,
      high24h,
      low24h,
      volume24h: token.volume24h,
      marketCap: token.marketCap,
      logoUrl: token.logoUrl,
      history,
    },
  });
});

// ─── Bridge Routes ────────────────────────────────────────────────────────────

const bridgeRoutes = [
  { id: "ltc-eth-ltc", fromChain: "Litecoin", toChain: "Ethereum", token: "LTC", estimatedTime: "15–25 min", fee: "0.20%", minAmount: 0.1, maxAmount: 5000 },
  { id: "eth-ltc-ltc", fromChain: "Ethereum", toChain: "Litecoin", token: "LTC", estimatedTime: "15–25 min", fee: "0.20%", minAmount: 0.1, maxAmount: 5000 },
  { id: "ltc-eth-usdt", fromChain: "Litecoin", toChain: "Ethereum", token: "USDT", estimatedTime: "12–20 min", fee: "0.15%", minAmount: 10, maxAmount: 500_000 },
  { id: "eth-ltc-usdt", fromChain: "Ethereum", toChain: "Litecoin", token: "USDT", estimatedTime: "12–20 min", fee: "0.15%", minAmount: 10, maxAmount: 500_000 },
  { id: "ltc-eth-usdc", fromChain: "Litecoin", toChain: "Ethereum", token: "USDC", estimatedTime: "12–20 min", fee: "0.15%", minAmount: 10, maxAmount: 500_000 },
  { id: "eth-ltc-usdc", fromChain: "Ethereum", toChain: "Litecoin", token: "USDC", estimatedTime: "12–20 min", fee: "0.15%", minAmount: 10, maxAmount: 500_000 },
  { id: "ltc-bsc-ltc", fromChain: "Litecoin", toChain: "BSC", token: "LTC", estimatedTime: "8–15 min", fee: "0.18%", minAmount: 0.1, maxAmount: 3000 },
  { id: "bsc-ltc-ltc", fromChain: "BSC", toChain: "Litecoin", token: "LTC", estimatedTime: "8–15 min", fee: "0.18%", minAmount: 0.1, maxAmount: 3000 },
  { id: "ltc-bsc-usdt", fromChain: "Litecoin", toChain: "BSC", token: "USDT", estimatedTime: "6–12 min", fee: "0.12%", minAmount: 10, maxAmount: 250_000 },
  { id: "bsc-ltc-usdt", fromChain: "BSC", toChain: "Litecoin", token: "USDT", estimatedTime: "6–12 min", fee: "0.12%", minAmount: 10, maxAmount: 250_000 },
  { id: "eth-bsc-eth", fromChain: "Ethereum", toChain: "BSC", token: "ETH", estimatedTime: "10–18 min", fee: "0.10%", minAmount: 0.01, maxAmount: 1000 },
  { id: "bsc-eth-eth", fromChain: "BSC", toChain: "Ethereum", token: "ETH", estimatedTime: "10–18 min", fee: "0.10%", minAmount: 0.01, maxAmount: 1000 },
  { id: "eth-bsc-usdt", fromChain: "Ethereum", toChain: "BSC", token: "USDT", estimatedTime: "8–14 min", fee: "0.08%", minAmount: 5, maxAmount: 1_000_000 },
  { id: "bsc-eth-usdt", fromChain: "BSC", toChain: "Ethereum", token: "USDT", estimatedTime: "8–14 min", fee: "0.08%", minAmount: 5, maxAmount: 1_000_000 },
];

app.get("/api/bridge/routes", (req, res) => {
  const { fromChain, toChain, token } = req.query;
  let routes = bridgeRoutes;

  if (fromChain) routes = routes.filter((r) => r.fromChain.toLowerCase() === fromChain.toLowerCase());
  if (toChain) routes = routes.filter((r) => r.toChain.toLowerCase() === toChain.toLowerCase());
  if (token) routes = routes.filter((r) => r.token.toUpperCase() === token.toUpperCase());

  res.json({ success: true, data: routes });
});

// ─── Swap Quote ───────────────────────────────────────────────────────────────

app.post("/api/swap/quote", (req, res) => {
  const { tokenIn, tokenOut, amountIn, slippage } = req.body || {};

  if (!tokenIn || typeof tokenIn !== "string") {
    return res.status(400).json({ success: false, error: { code: "INVALID_INPUT", message: "tokenIn is required" } });
  }
  if (!tokenOut || typeof tokenOut !== "string") {
    return res.status(400).json({ success: false, error: { code: "INVALID_INPUT", message: "tokenOut is required" } });
  }
  if (amountIn === undefined || amountIn === null || isNaN(Number(amountIn)) || Number(amountIn) <= 0) {
    return res.status(400).json({ success: false, error: { code: "INVALID_INPUT", message: "amountIn must be a positive number" } });
  }

  const tokenInData = getTokenBySymbol(tokenIn);
  const tokenOutData = getTokenBySymbol(tokenOut);

  if (!tokenInData) {
    return res.status(400).json({ success: false, error: { code: "INVALID_INPUT", message: `Token '${tokenIn}' not supported` } });
  }
  if (!tokenOutData) {
    return res.status(400).json({ success: false, error: { code: "INVALID_INPUT", message: `Token '${tokenOut}' not supported` } });
  }

  const amt = Number(amountIn);
  const slip = Math.max(0, Math.min(50, Number(slippage) || 0.5));

  // Calculate amountOut using token prices
  const inputValueUSD = amt * tokenInData.price;
  const priceImpact = parseFloat((0.01 + Math.random() * 0.49).toFixed(4));
  const effectiveValue = inputValueUSD * (1 - priceImpact / 100);
  const amountOut = effectiveValue / tokenOutData.price;
  const fee = parseFloat((inputValueUSD * 0.003).toFixed(6)); // 0.3% fee in USD

  // Determine route (direct or via USDT/USDC)
  const stables = ["USDT", "USDC", "DAI"];
  const inSym = tokenIn.toUpperCase();
  const outSym = tokenOut.toUpperCase();
  let route;
  if (stables.includes(inSym) || stables.includes(outSym)) {
    route = [inSym, outSym];
  } else {
    route = [inSym, "USDT", outSym];
  }

  const minAmountOut = parseFloat((amountOut * (1 - slip / 100)).toFixed(8));

  res.json({
    success: true,
    data: {
      tokenIn: inSym,
      tokenOut: outSym,
      amountIn: amt,
      amountOut: parseFloat(amountOut.toFixed(8)),
      priceImpact,
      fee,
      feeToken: "USD",
      route,
      minAmountOut,
      exchangeRate: parseFloat((amountOut / amt).toFixed(8)),
      slippage: slip,
    },
  });
});

// ─── AI Suggestions ───────────────────────────────────────────────────────────

const suggestionPool = {
  low: [
    { action: "HOLD", pair: "LTC/USDT", reasoning: "LTC is consolidating in a healthy range. Strong on-chain metrics and network hashrate at ATH suggest accumulation phase. Hold current positions and monitor the $88 resistance.", confidence: 0.82, expectedReturn: "+3–8%" },
    { action: "BUY", pair: "USDT", reasoning: "Market uncertainty ahead of macro data. Rotating 20% of volatile positions into USDT as a defensive hedge while preserving capital for re-entry opportunities.", confidence: 0.75, expectedReturn: "0%" },
    { action: "HOLD", pair: "ETH/USDC LP", reasoning: "Providing liquidity in the ETH/USDC pool generates 12.8% APR with minimal impermanent loss risk given current low volatility conditions.", confidence: 0.79, expectedReturn: "+12.8% APR" },
    { action: "BUY", pair: "LTC/USDT", reasoning: "LTC/BTC ratio is at a 3-month low, historically a buying opportunity. Litecoin halving narrative building momentum. Small allocation recommended.", confidence: 0.68, expectedReturn: "+5–15%" },
    { action: "HOLD", pair: "wLTC/USDC LP", reasoning: "wLTC/USDC pool offers 24.1% APR with stablecoin pairing reducing IL exposure. Continue earning yield while LTC price stabilizes.", confidence: 0.84, expectedReturn: "+24.1% APR" },
  ],
  medium: [
    { action: "BUY", pair: "LTC/USDT", reasoning: "Technical breakout above $85 resistance confirmed with volume. RSI cooling from 72 to 61. Fibonacci retracement support at $82.40. Target: $95–105.", confidence: 0.74, expectedReturn: "+12–22%" },
    { action: "BUY", pair: "LITESWAP/USDC", reasoning: "LITESWAP governance token undervalued relative to protocol TVL. LIP-12 emission reduction proposal likely to pass, creating deflationary pressure. Entry at $0.42 is attractive.", confidence: 0.71, expectedReturn: "+25–40%" },
    { action: "HOLD", pair: "LTC/ETH LP", reasoning: "LTC/ETH pair generating 32.7% APR. Both assets showing correlated movement, reducing impermanent loss. Maintain position through the current consolidation.", confidence: 0.78, expectedReturn: "+32.7% APR" },
    { action: "SELL", pair: "ETH", reasoning: "ETH facing near-term resistance at $3,500. Consider taking partial profits (25–30%) and redeploying into LTC/USDT LP for higher risk-adjusted returns.", confidence: 0.65, expectedReturn: "Lock profits" },
    { action: "BUY", pair: "LTC/ETH LP", reasoning: "Adding to the LTC/ETH pool at current ratios is favorable. Protocol fee income is up 34% WoW. LITESWAP farm rewards add an extra 32.7% on top of trading fees.", confidence: 0.72, expectedReturn: "+32–45%" },
  ],
  high: [
    { action: "BUY", pair: "LTC/LITESWAP LP", reasoning: "Aggressive yield farming opportunity. 87.3% APR in LTC/LITESWAP pool with additional 148% APR from LITESWAP farm rewards. High IL risk offset by reward emissions. For risk-tolerant capital only.", confidence: 0.63, expectedReturn: "+80–200% (incl. farming)" },
    { action: "BUY", pair: "LITESWAP", reasoning: "LITESWAP at $0.42 is a high-conviction asymmetric bet. V3 launch proposal (LIP-13) could catalyze 5–10x. Low market cap of $42M vs $15M+ TVL protocol. 1–3 week horizon.", confidence: 0.61, expectedReturn: "+100–500%" },
    { action: "SELL", pair: "BTC/USDT", reasoning: "BTC showing bearish divergence on 4h RSI while funding rates spike. Short-term correction to $60,000–$62,000 likely. Reduce BTC exposure by 40% and redeploy into LTC on dip.", confidence: 0.58, expectedReturn: "+8–15% on rotation" },
    { action: "BUY", pair: "LTC/USDT", reasoning: "On-chain accumulation by large wallets detected in last 48h. Exchange outflows at 90-day high. Breakout above $90 could trigger short squeeze to $110–120. 3x leverage long candidate.", confidence: 0.66, expectedReturn: "+30–60%" },
    { action: "BUY", pair: "ETH/USDC LP", reasoning: "Deploy max capital into ETH/USDC farm before LIP-11 passes. Expected TVL spike will temporarily boost APR. Exit after 2 weeks when APR normalizes.", confidence: 0.69, expectedReturn: "+40–80% annualized" },
  ],
};

const sentiments = ["Bullish", "Bearish", "Neutral"];

app.post("/api/ai/suggest", (req, res) => {
  const { portfolio, riskProfile } = req.body || {};

  const validProfiles = ["low", "medium", "high"];
  const profile = validProfiles.includes(riskProfile) ? riskProfile : "medium";

  const pool = suggestionPool[profile];
  // Shuffle and pick 3–5 suggestions
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const count = 3 + Math.floor(Math.random() * 3);
  const suggestions = shuffled.slice(0, count).map((s) => ({
    ...s,
    confidence: parseFloat((s.confidence + (Math.random() * 0.1 - 0.05)).toFixed(2)),
  }));

  const sentimentWeights = {
    low: [0.3, 0.3, 0.4],
    medium: [0.5, 0.2, 0.3],
    high: [0.6, 0.2, 0.2],
  };
  const weights = sentimentWeights[profile];
  const rand = Math.random();
  let sentiment;
  if (rand < weights[0]) sentiment = "Bullish";
  else if (rand < weights[0] + weights[1]) sentiment = "Bearish";
  else sentiment = "Neutral";

  // Portfolio analysis summary if provided
  let portfolioSummary = null;
  if (Array.isArray(portfolio) && portfolio.length > 0) {
    const totalValue = portfolio.reduce((sum, item) => {
      const t = getTokenBySymbol(item.symbol);
      return sum + (t ? t.price * (item.balance || 0) : 0);
    }, 0);
    portfolioSummary = {
      totalValue: parseFloat(totalValue.toFixed(2)),
      tokenCount: portfolio.length,
      dominantAsset: portfolio.sort((a, b) => {
        const ta = getTokenBySymbol(a.symbol);
        const tb = getTokenBySymbol(b.symbol);
        return (tb ? tb.price * b.balance : 0) - (ta ? ta.price * a.balance : 0);
      })[0]?.symbol || null,
    };
  }

  res.json({
    success: true,
    data: {
      riskProfile: profile,
      marketSentiment: sentiment,
      suggestions,
      generatedAt: new Date().toISOString(),
      ...(portfolioSummary && { portfolioAnalysis: portfolioSummary }),
    },
  });
});

// ─── Recent Transactions ──────────────────────────────────────────────────────

app.get("/api/transactions/recent", (req, res) => {
  // Rotate timestamps to feel live
  const now = Date.now();
  const dynamic = recentTransactions.map((tx, i) => ({
    ...tx,
    time: new Date(now - i * 9 * 60 * 1000).toISOString(),
  }));

  res.json({ success: true, data: dynamic.slice(0, 20) });
});

// ─── SPA Fallback ─────────────────────────────────────────────────────────────

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  const indexPath = join(process.cwd(), "dist", "index.html");
  if (existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  res.status(404).json({ error: "Frontend not built. Run npm run build in the frontend." });
});

// ─── Error Handler ────────────────────────────────────────────────────────────

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message || err);
  res.status(500).json({
    success: false,
    error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" },
  });
});

// ─── Server Start ─────────────────────────────────────────────────────────────

const server = createServer(app);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`⚡ LiteDEX API running on port ${PORT}`);
  console.log(`   Docs:   http://localhost:${PORT}/docs`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
});

// ─── Graceful Shutdown ────────────────────────────────────────────────────────

function shutdown(signal) {
  console.log(`\n${signal} received — shutting down gracefully...`);
  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });
  setTimeout(() => {
    console.error("Force exit after timeout.");
    process.exit(1);
  }, 8000);
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
  process.exit(1);
});
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection:", reason);
  process.exit(1);
});
