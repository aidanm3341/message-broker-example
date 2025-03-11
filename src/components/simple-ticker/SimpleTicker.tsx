import React, { useEffect } from 'react';
import { messagebroker } from '@morgan-stanley/message-broker';
import { IStockContract, Stock } from '../../contracts.ts';
import { useState } from 'react';

interface SimpleTicker {
    symbol: string;
}

const symbolCss: React.CSSProperties = {
    fontWeight: 'bold',
    fontSize: '1.5rem',
    marginRight: '1rem',
};

const boxStyle: React.CSSProperties = {
    display: 'flex',
    borderLeft: '1px solid gray',
    padding: '0.5rem',
    width: '12rem',
    height: '3rem',
    alignItems: 'center',
};

const broker = messagebroker<IStockContract>();

export function SimpleTicker({ symbol }: SimpleTicker) {
    const [data, setData] = useState<Stock>({ symbol: 'No Data', price: 0 });
    const [initialPrice, setInitialPrice] = useState<number>();

    useEffect(() => {
        ////////
        const subscription = broker.get('price-update').subscribe(
            (newStockValue) => {
                if (newStockValue.data.symbol === symbol) {
                    if (!initialPrice) {
                        setInitialPrice(() => newStockValue.data.price);
                    }
                    setData(() => newStockValue.data);
                }
            },
        );
        return () => subscription.unsubscribe();
        ////////
    }, []);

    const positivePrice = (
        <>
            <p
                style={{
                    color: 'green',
                    fontSize: '1.5rem',
                }}
            >
                {data.price}
            </p>
        </>
    );

    const negativePrice = (
        <>
            <p
                style={{
                    color: 'red',
                    fontSize: '1.5rem',
                }}
            >
                {data.price}
            </p>
        </>
    );

    return (
        <div style={boxStyle}>
            <p style={symbolCss}>
                {symbol}
            </p>
            {(data && initialPrice && data?.price < initialPrice)
                ? negativePrice
                : positivePrice}
        </div>
    );
}
