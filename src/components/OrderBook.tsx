import QuoteTable from './QuoteTable';
import LastPriceRow from './LastPriceRow';
import { useOrderBook } from '@/hooks/useOrderBook'; // 啟動 socket

const OrderBook = () => {
  useOrderBook('BTCPFC');

  return (
    <div className="bg-bg-primary mx-auto mt-10 border border-gray-700 rounded-md overflow-hidden">
      <div className="p-3 text-primary text-sm font-semibold">Order Book</div>
      <div className="px-2 py-1 grid grid-cols-3 gap-2 text-secondary text-xs">
        <div className="text-right">Price (USD)</div>
        <div className="text-right">Size</div>
        <div className="text-right">Total</div>
      </div>
      <QuoteTable type="sell" />
      <LastPriceRow />
      <QuoteTable type="buy" />
    </div>
  );
};

export default OrderBook;
