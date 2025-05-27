import { create } from 'zustand';
import type { Quote } from '@/hooks/useOrderBook';

interface OrderBookStore {
  bids: Quote[];
  asks: Quote[];
  lastPrice: number | null;
  prevPrice: number | null;
  newPrices: Set<number>;
  prevSizes: Map<number, number>;

  setLastPrice: (price: number) => void;
  updateNewPrices: (quotes: Quote[]) => void;
}

export const useOrderBookStore = create<OrderBookStore>((set, get) => ({
  bids: [],
  asks: [],
  lastPrice: null,
  prevPrice: null,
  newPrices: new Set(),
  prevSizes: new Map(),

  setLastPrice: price =>
    set(state => ({
      lastPrice: price,
      prevPrice: state.lastPrice ?? price,
    })),

  updateNewPrices: quotes => {
    const currentPrev = get().prevSizes;
    const newMap = new Map<number, number>(currentPrev);
    const newSet = new Set<number>();

    quotes.forEach(q => {
      const oldSize = currentPrev.get(q.price);
      if (oldSize === undefined) {
        newMap.set(q.price, q.size);
        newSet.add(q.price);
        return;
      }

      if (q.size !== oldSize) {
        newMap.set(q.price, q.size);
      }
    });

    set({ newPrices: newSet, prevSizes: newMap });
  },
}));
