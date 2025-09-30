import React, { useEffect } from 'react';
import { messagebroker } from '@morgan-stanley/message-broker';
import { LineView } from '../line-view/LineView.tsx';
import { IStockContract, Stock } from '../../contracts.ts';
import { useState } from 'react';

interface SingleTickerTrackerProps {
    symbol: string;
}

const broker = messagebroker<IStockContract>();

export function SingleTickerTracker({ symbol }: SingleTickerTrackerProps) {
    const [data, setData] = useState<Stock[]>([]);

    useEffect(() => {
        ////////
        console.log(`🎯 SingleTickerTracker subscribing to price-update for ${symbol}`);
        const subscription = broker.get('price-update').subscribe(
            (newStockValue) => {
                if (newStockValue.data.symbol === symbol) {
                    setData((prevState) => [...prevState, newStockValue.data]);
                }
            },
        );
        return () => subscription.unsubscribe();
        ////////
    }, [symbol]);

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                margin: '1rem',
            }}
        >
            <h2>{symbol}</h2>
            <LineView data={data} dataKey='price' />
        </div>
    );
}
