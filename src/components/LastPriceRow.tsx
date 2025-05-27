import classNames from 'classnames';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { useOrderBookStore } from '@/store/useOrderBookStore';
import { formatNumber } from '@/utils/format';

const LastPriceRow = () => {
  const lastPrice = useOrderBookStore(state => state.lastPrice);
  const prevPrice = useOrderBookStore(state => state.prevPrice);

  const getClass = () => {
    if (lastPrice === null || prevPrice === null) return 'text-primary bg-last-same';
    if (lastPrice > prevPrice) return 'text-bid bg-last-up';
    if (lastPrice < prevPrice) return 'text-ask bg-last-down';
    return 'text-primary bg-last-same';
  };

  const getIcon = () => {
    if (lastPrice === null || prevPrice === null) return null;
    if (lastPrice > prevPrice) return <ArrowUp className="inline w-4 h-4 ml-1" strokeWidth={3} />;
    if (lastPrice < prevPrice) return <ArrowDown className="inline w-4 h-4 ml-1" strokeWidth={3} />;
    return null;
  };

  return (
    <div className={classNames('text-center py-1 font-bold flex items-center justify-center', getClass())}>
      {lastPrice !== null ? (
        <>
          {formatNumber(lastPrice, 1)}
          {getIcon()}
        </>
      ) : (
        '--'
      )}
    </div>
  );
};

export default LastPriceRow;
