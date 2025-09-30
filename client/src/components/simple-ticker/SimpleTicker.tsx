import { useEffect, useState } from 'react';
import { messagebroker } from '@morgan-stanley/message-broker';
import { IStockContract, Stock } from '../../contracts.ts';
import { styles } from './styles.ts';

const broker = messagebroker<IStockContract>();

interface SimpleTickerProps {
    symbol: string;
}

export function SimpleTicker({ symbol }: SimpleTickerProps) {
    const [data, setData] = useState<Stock>({ symbol: 'No Data', price: 0 });
    const [initialPrice, setInitialPrice] = useState<number>();

    useEffect(() => {
        const subscription = broker.get('price-update').subscribe(
            (newStockValue) => {
                if (newStockValue.data.symbol === symbol) {
                    if (!initialPrice) {
                        setInitialPrice(newStockValue.data.price);
                    }
                    setData(newStockValue.data);
                }
            },
        );
        return () => subscription.unsubscribe();
    }, [symbol, initialPrice]);

    const isPriceNegative = data && initialPrice && data.price < initialPrice;
    const priceStyle = isPriceNegative ? styles.priceNegative : styles.pricePositive;

    return (
        <div style={styles.container}>
            <p style={styles.symbol}>{symbol}</p>
            <p style={priceStyle}>{data.price}</p>
        </div>
    );
}
