/**
 * generateOHLCV — Creates realistic price history with a random walk.
 * @param {number} basePrice - Starting price
 * @param {number} days - Number of daily candles to generate
 * @returns {Array<{time, open, high, low, close, volume}>}
 */
export function generateOHLCV(basePrice, days = 90) {
  const candles = [];
  const now = Date.now();
  const DAY_MS = 86_400_000;
  let price = basePrice;

  // Walk backwards from now
  const startTime = now - days * DAY_MS;

  for (let i = 0; i < days; i++) {
    const time = Math.floor((startTime + i * DAY_MS) / 1000); // Unix seconds

    const open = price;

    // Daily variation ±3%
    const changePercent = (Math.random() * 6 - 3) / 100;
    const close = open * (1 + changePercent);

    // High/Low relative to the higher/lower of open/close
    const highBase = Math.max(open, close);
    const lowBase = Math.min(open, close);
    const high = highBase * (1 + Math.random() * 0.02);
    const low = lowBase * (1 - Math.random() * 0.02);

    // Volume: 100k–5M USD-equivalent
    const volume = 100_000 + Math.random() * 4_900_000;

    candles.push({
      time,
      open: parseFloat(open.toFixed(8)),
      high: parseFloat(high.toFixed(8)),
      low: parseFloat(low.toFixed(8)),
      close: parseFloat(close.toFixed(8)),
      volume: parseFloat(volume.toFixed(2)),
    });

    price = close;
  }

  return candles;
}

/**
 * generatePriceHistory — Simple time/value series for pool price charts.
 * @param {number} basePrice
 * @param {number} days
 * @returns {Array<{time: number, value: number}>}
 */
export function generatePriceHistory(basePrice, days = 90) {
  const history = [];
  const now = Date.now();
  const DAY_MS = 86_400_000;
  let price = basePrice;

  const startTime = now - days * DAY_MS;

  for (let i = 0; i < days; i++) {
    const time = Math.floor((startTime + i * DAY_MS) / 1000);
    const changePercent = (Math.random() * 4 - 2) / 100;
    price = price * (1 + changePercent);

    history.push({
      time,
      value: parseFloat(price.toFixed(8)),
    });
  }

  return history;
}
