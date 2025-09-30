import { useEffect, useState } from "react";
import { messagebroker } from "@morgan-stanley/message-broker";
import { LineView } from "../line-view/LineView.tsx";
import { IStockContract, Stock } from "../../contracts.ts";
import { styles } from "./styles.ts";

const broker = messagebroker<IStockContract>();

interface SingleTickerTrackerProps {
    symbol: string;
}

export function SingleTickerTracker({ symbol }: SingleTickerTrackerProps) {
    const [data, setData] = useState<Stock[]>([]);

    useEffect(() => {
        console.log(
            `SingleTickerTracker subscribing to price-update for ${symbol}`,
        );
        const subscription = broker.get("price-update").subscribe(
            (newStockValue) => {
                if (newStockValue.data.symbol === symbol) {
                    setData((prevState) => [...prevState, newStockValue.data]);
                }
            },
        );
        return () => subscription.unsubscribe();
    }, [symbol]);

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>{symbol}</h2>
            <LineView data={data} dataKey="price" />
        </div>
    );
}
