// Static mock data for the dashboard's subgraph statistics
// Replaces The Graph API calls (api.thegraph.com is down)

const LG_GHOST_ADDR  = '0x98f606a4cdde68b9f68732d21fb9ba8b5510ee48';
const ECTO_ADDR      = '0x0fa48f20dddcf6ed724a36381f66c3e905fe7988';
const LG_MARKET_ADDR = '0x12492e327c49bc2f7df86d1d96752b9af1dfe2e1';
const PCS_MARKET_ADDR= '0x17539cca21c7933df5c980172d22659b8c345c5a';

// ── SubgraphCollection objects (one per collection × marketplace) ────────
export const mockCollectionData: Record<string, Record<string, any>> = {
  littleghosts: {
    [LG_GHOST_ADDR]: {
      id: LG_GHOST_ADDR,
      name: 'LittleGhosts',
      symbol: 'LG',
      active: true,
      totalTrades: '847',
      totalVolumeBNB: '312.58',
      numberTokensListed: '23',
      creatorAddress: LG_MARKET_ADDR,
      tradingFee: '0.05',
      whitelistChecker: '0x0000000000000000000000000000000000000000',
    },
    [ECTO_ADDR]: {
      id: ECTO_ADDR,
      name: 'EctoSkeletons',
      symbol: 'ECTO',
      active: true,
      totalTrades: '512',
      totalVolumeBNB: '187.43',
      numberTokensListed: '15',
      creatorAddress: LG_MARKET_ADDR,
      tradingFee: '0.05',
      whitelistChecker: '0x0000000000000000000000000000000000000000',
    },
  },
  pancakeswap: {
    [LG_GHOST_ADDR]: {
      id: LG_GHOST_ADDR,
      name: 'LittleGhosts',
      symbol: 'LG',
      active: true,
      totalTrades: '1204',
      totalVolumeBNB: '589.31',
      numberTokensListed: '31',
      creatorAddress: PCS_MARKET_ADDR,
      tradingFee: '0.02',
      whitelistChecker: '0x0000000000000000000000000000000000000000',
    },
    [ECTO_ADDR]: {
      id: ECTO_ADDR,
      name: 'EctoSkeletons',
      symbol: 'ECTO',
      active: true,
      totalTrades: '634',
      totalVolumeBNB: '241.87',
      numberTokensListed: '18',
      creatorAddress: PCS_MARKET_ADDR,
      tradingFee: '0.02',
      whitelistChecker: '0x0000000000000000000000000000000000000000',
    },
  },
};

// ── 24-hour transaction arrays (used for 24h sale count + volume) ────────
// Each entry needs at minimum { askPrice: string }
function make24hTransactions(prices: string[]) {
  return prices.map((askPrice, i) => ({
    id: `0x${i.toString().padStart(64, '0')}`,
    timestamp: String(Math.floor(Date.now() / 1000) - i * 3600),
    askPrice,
    netPrice: String(+askPrice * 0.95),
    withBNB: true,
  }));
}

export const mock24hTransactions: Record<string, Record<string, any[]>> = {
  littleghosts: {
    [LG_GHOST_ADDR]: make24hTransactions(['0.42', '0.85', '1.2', '0.3', '0.5', '0.75', '0.22', '1.8', '0.6', '0.48']),
    [ECTO_ADDR]:     make24hTransactions(['0.58', '1.5', '0.28', '0.95', '0.75', '2.1', '0.42', '0.65']),
  },
  pancakeswap: {
    [LG_GHOST_ADDR]: make24hTransactions(['0.55', '0.38', '1.1', '0.72', '0.2', '0.9', '0.45', '1.4', '0.31', '0.68', '0.88', '0.25']),
    [ECTO_ADDR]:     make24hTransactions(['0.35', '0.8', '1.2', '0.45', '0.6', '0.78']),
  },
};

// ── Day-data arrays (used for 7d / 30d stats) ───────────────────────────
// Each entry: { id, date, dailyVolumeBNB, dailyTrades }
function makeDayData(baseTs: number, days: number, tradeRange: [number,number], volRange: [number,number]) {
  return Array.from({ length: days }, (_, i) => {
    const trades = Math.round(tradeRange[0] + Math.random() * (tradeRange[1] - tradeRange[0]));
    const vol    = (volRange[0] + Math.random() * (volRange[1] - volRange[0])).toFixed(2);
    const date   = baseTs - (days - 1 - i) * 86400;
    return { id: `${date}`, date, dailyVolumeBNB: vol, dailyTrades: String(trades) };
  });
}
const NOW_DAYS = Math.floor(Date.now() / 1000);

export const mockDayData: Record<string, Record<string, { days7: any[]; days30: any[] }>> = {
  littleghosts: {
    [LG_GHOST_ADDR]: {
      days7:  makeDayData(NOW_DAYS, 7,  [3, 12],  [1.5, 6.5]),
      days30: makeDayData(NOW_DAYS, 30, [2, 15],  [1.0, 8.0]),
    },
    [ECTO_ADDR]: {
      days7:  makeDayData(NOW_DAYS, 7,  [2, 8],   [0.8, 4.5]),
      days30: makeDayData(NOW_DAYS, 30, [1, 10],  [0.5, 5.5]),
    },
  },
  pancakeswap: {
    [LG_GHOST_ADDR]: {
      days7:  makeDayData(NOW_DAYS, 7,  [5, 18],  [2.5, 10.0]),
      days30: makeDayData(NOW_DAYS, 30, [3, 20],  [1.5, 12.0]),
    },
    [ECTO_ADDR]: {
      days7:  makeDayData(NOW_DAYS, 7,  [2, 10],  [1.0, 5.5]),
      days30: makeDayData(NOW_DAYS, 30, [1, 12],  [0.6, 6.5]),
    },
  },
};
