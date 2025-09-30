import { useEffect, useState } from 'react';
import { messagebroker } from '@morgan-stanley/message-broker';
import { IStockContract } from '../../contracts.ts';
import { formatTime } from '../../utils/formatTime.ts';
import { styles } from './styles.ts';

const broker = messagebroker<IStockContract>();

interface LogEvent {
    time: Date;
    message: string;
}

export function LogComponent() {
    const [events, setEvents] = useState<LogEvent[]>([]);
    const [hoveredRow, setHoveredRow] = useState<number | null>(null);

    useEffect(() => {
        const priceSubscription = broker.get('price-update').subscribe(
            (newStockValue) => {
                setEvents((prevState) => [
                    ...prevState,
                    {
                        time: new Date(newStockValue.timestamp),
                        message: `Price update [${newStockValue.data.symbol}]: [${newStockValue.data.price}]`,
                    },
                ]);
            },
        );

        const watchSubscription = broker.get('watch-stock').subscribe((message) => {
            setEvents((prevEvents) => [
                ...prevEvents,
                {
                    time: new Date(message.timestamp),
                    message: `Watching stock [${message.data}]`,
                },
            ]);
        });

        return () => {
            priceSubscription.unsubscribe();
            watchSubscription.unsubscribe();
        };
    }, []);

    const sortedEvents = [...events].sort((a, b) => b.time.getTime() - a.time.getTime());

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2>Log</h2>
            </div>
            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.tableHeader}>Time Received</th>
                            <th style={styles.tableHeader}>Message</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedEvents.map((event, index) => (
                            <tr
                                key={index}
                                style={{
                                    ...styles.tableRow,
                                    ...(hoveredRow === index ? styles.tableRowHover : {}),
                                }}
                                onMouseEnter={() => setHoveredRow(index)}
                                onMouseLeave={() => setHoveredRow(null)}
                            >
                                <td style={styles.timeCell}>{formatTime(event.time)}</td>
                                <td style={styles.tableCell}>{event.message}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
