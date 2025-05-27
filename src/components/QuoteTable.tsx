import QuoteRow from './QuoteRow';
import { useOrderBookStore } from '@/store/useOrderBookStore';

type Props = {
  type: 'buy' | 'sell';
};

const QuoteTable = ({ type }: Props) => {
  const quotes = useOrderBookStore(state => (type === 'buy' ? state.bids : state.asks));
  const newPrices = useOrderBookStore(state => state.newPrices);
  const prevSizes = useOrderBookStore(state => state.prevSizes);

  const maxRows = 8;

  if (quotes.length === 0) {
    return (
      <div>
        {Array.from({ length: maxRows }).map((_, i) => (
          <div key={i} className="flex px-2 py-0.5 text-[13px] relative items-center font-mono">
            <div className="flex-1 basis-[30%] text-right text-secondary">--</div>
            <div className="flex-1 basis-[30%] text-right text-secondary">--</div>
            <div className="flex-1 basis-[30%] text-right text-secondary relative z-10">--</div>
            <div className="absolute right-0 top-0 h-full z-0 w-0" />
          </div>
        ))}
      </div>
    );
  }

  const totalSize = quotes.reduce((acc, q) => acc + q.size, 0);
  let runningTotal = 0;

  const filled = quotes.slice(0, maxRows).map(quote => {
    runningTotal += quote.size;

    return (
      <QuoteRow
        key={`${quote.price}-${quote.size}`}
        quote={quote}
        total={runningTotal}
        percent={(runningTotal / totalSize) * 100}
        type={type}
        newPrices={newPrices}
        prevSizes={prevSizes}
      />
    );
  });

  return <div>{filled}</div>;
};

export default QuoteTable;
