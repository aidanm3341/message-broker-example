import React, { useEffect, useState } from 'react';
import { IStockContract } from '../../contracts.ts';
import { messagebroker } from '@morgan-stanley/message-broker';

interface Event {
    time: Date;
    message: string;
}

const broker = messagebroker<IStockContract>();

export function LogComponent() {
    const [events, setEvents] = useState<Event[]>([]);

    ///////////
    useEffect(() => {
        const subscription = broker.get('price-update').subscribe(
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
        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        const subscription = broker.get('watch-stock').subscribe((message) => {
            setEvents((prevEvents) => [
                ...prevEvents,
                {
                    time: new Date(message.timestamp),
                    message: `Watching stock [${message.data}]`,
                },
            ]);
        });
        return () => subscription.unsubscribe();
    }, []);
    /////////////

    return (
        <div
            style={{
                backgroundColor: 'rgb(28, 28, 28)',
                padding: '1rem',
                overflowY: 'auto',
                maxHeight: '100vh',
            }}
        >
            <h2>Log</h2>
            <table
                style={{
                    justifySelf: 'end',
                    alignSelf: 'end',
                }}
            >
                <tr>
                    <th>Time Received</th>
                    <th>Message</th>
                </tr>
                {events.sort((ev1, ev2) => ev2.time.getTime() - ev1.time.getTime()).map((event, index) => (
                    <tr key={index}>
                        <td>{event.time.getHours() + ':' + event.time.getMinutes() + ':' + event.time.getSeconds()}</td>
                        <td>{event.message}</td>
                    </tr>
                ))}
            </table>
        </div>
    );
}
