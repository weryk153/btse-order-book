import classNames from 'classnames';
import { useEffect, useMemo, useState } from 'react';
import type { Quote } from '@/hooks/useOrderBook';
import { formatNumber } from '@/utils/format';

type Props = {
  quote: Quote;
  total: number;
  percent: number;
  type: 'buy' | 'sell';
  newPrices: Set<number>;
  prevSizes: Map<number, number>;
};

const QuoteRow = ({ quote, total, percent, type, newPrices, prevSizes }: Props) => {
  const [rowFlash, setRowFlash] = useState(false);
  const [sizeFlash, setSizeFlash] = useState<'up' | 'down' | null>(null);

  const textColor = type === 'buy' ? 'text-bid' : 'text-ask';
  const barBg = type === 'buy' ? 'bg-bid-depth' : 'bg-ask-depth';

  const formattedPrice = useMemo(() => formatNumber(quote.price, 1), [quote.price]);
  const formattedSize = useMemo(() => formatNumber(quote.size), [quote.size]);
  const formattedTotal = useMemo(() => formatNumber(total), [total]);
  const barStyle = useMemo(() => ({ width: `${percent}%` }), [percent]);

  useEffect(() => {
    if (newPrices.has(quote.price)) {
      setRowFlash(true);
      setTimeout(() => setRowFlash(false), 500);
    }
  }, [quote.price, newPrices]);

  useEffect(() => {
    const prev = prevSizes.get(quote.price);
    const isNew = newPrices.has(quote.price);

    if (!isNew && prev !== undefined && quote.size !== prev) {
      setSizeFlash(quote.size > prev ? 'up' : 'down');
      setTimeout(() => setSizeFlash(null), 500);
    }
  }, [quote.price, quote.size, newPrices, prevSizes]);

  return (
    <div
      className={classNames(
        'flex px-2 py-0.5 text-[13px] relative items-center font-mono cursor-pointer',
        'hover:bg-hovered',
        {
          'animate-flash-up': rowFlash && type === 'buy',
          'animate-flash-down': rowFlash && type === 'sell',
        }
      )}
    >
      <div className={classNames('flex-1 basis-[30%] text-right', textColor)}>{formattedPrice}</div>
      <div
        className={classNames('flex-1 basis-[30%] text-right', {
          'animate-flash-up': sizeFlash === 'up',
          'animate-flash-down': sizeFlash === 'down',
        })}
      >
        {formattedSize}
      </div>
      <div className="flex-1 basis-[30%] text-right relative z-10">{formattedTotal}</div>
      <div className={`absolute right-0 top-0 h-full z-0 ${barBg}`} style={barStyle} />
    </div>
  );
};

export default QuoteRow;
