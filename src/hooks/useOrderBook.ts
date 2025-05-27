import { useWebSocket } from './useWebSocket';
import { useOrderBookStore } from '@/store/useOrderBookStore';

export type Quote = { price: number; size: number };

type OrderBookDelta = {
  bids?: [string, string][];
  asks?: [string, string][];
  seqNum: number;
  prevSeqNum: number;
  type: 'snapshot' | 'delta';
  timestamp: number;
  symbol: string;
};

type TradeTick = {
  price: number;
  size: number;
  side: 'BUY' | 'SELL';
  symbol: string;
  timestamp: number;
  tradeId: number;
};

export const useOrderBook = (symbol: string) => {
  const setLastPrice = useOrderBookStore(state => state.setLastPrice);
  const updateNewPrices = useOrderBookStore(state => state.updateNewPrices);

  const ORDERBOOK_WS = 'wss://ws.btse.com/ws/oss/futures';
  const TRADE_WS = 'wss://ws.btse.com/ws/futures';
  const ORDERBOOK_TOPIC = `update:${symbol}_0`;
  const TRADE_TOPIC = `tradeHistoryApi:${symbol}`;

  useWebSocket<OrderBookDelta>(
    ORDERBOOK_WS,
    ORDERBOOK_TOPIC,
    data => {
      const toList = (entries: [string, string][]): Quote[] =>
        entries.map(([p, s]) => ({
          price: parseFloat(p),
          size: parseFloat(s),
        }));

      const get = useOrderBookStore.getState;

      if (data.type === 'snapshot') {
        const snapshotBids = toList(data.bids ?? []);
        const snapshotAsks = toList(data.asks ?? []);

        const bids = mergeAndTrimQuotes([], snapshotBids);
        const asks = mergeAndTrimQuotes([], snapshotAsks);

        useOrderBookStore.setState({ bids, asks });

        setTimeout(() => {
          updateNewPrices([...bids, ...asks]);
        }, 0);
        return;
      }

      const updateBids = data.bids ? toList(data.bids) : [];
      const updateAsks = data.asks ? toList(data.asks) : [];

      const currentBids = get().bids;
      const currentAsks = get().asks;

      const bids = updateBids.length ? mergeAndTrimQuotes(currentBids, updateBids) : currentBids;

      const asks = updateAsks.length ? mergeAndTrimQuotes(currentAsks, updateAsks) : currentAsks;

      useOrderBookStore.setState({ bids, asks });

      setTimeout(() => {
        updateNewPrices([...bids, ...asks]);
      }, 0);
    },
    { retryOnSeqMismatch: true }
  );

  useWebSocket<TradeTick[]>(
    TRADE_WS,
    TRADE_TOPIC,
    data => {
      if (!Array.isArray(data) || data[0]?.symbol !== symbol) return;
      setLastPrice(data[0].price); // 儲存成交價（觸發 LastPriceRow UI 更新）
    },
    { filterBySymbol: symbol }
  );
};

const mergeAndTrimQuotes = (prev: Quote[], updates: Quote[]): Quote[] => {
  const map = new Map(prev.map(q => [q.price, q.size]));

  for (const { price, size } of updates) {
    if (size === 0)
      map.delete(price); // size 為 0 則表示刪除該價格
    else map.set(price, size);
  }

  return Array.from(map.entries())
    .map(([price, size]) => ({ price, size }))
    .sort((a, b) => b.price - a.price)
    .slice(0, 8);
};
