import { useState } from 'react';
import './App.css';
import { SingleTickerTracker } from '../single-ticker-tracker/SingleTickerTracker.tsx';
import { SimpleTicker } from '../simple-ticker/SimpleTicker.tsx';
import { LogComponent } from '../log/LogComponent.tsx';
import { messagebroker } from '@morgan-stanley/message-broker';
import { IStockContract } from '../../contracts.ts';
import { styles } from './styles.ts';

const broker = messagebroker<IStockContract>();
const watchStockChannel = broker.create('watch-stock');

function App() {
    const [symbols, setSymbols] = useState<string[]>([]);

    function addSymbol(formData: FormData) {
        const queryString = formData.get('query')?.toString() || '';

        if (!queryString.trim()) {
            return;
        }

        console.log('Publishing watch-stock:', queryString);
        watchStockChannel.publish(queryString);
        setSymbols((oldSymbols) => [...oldSymbols, queryString]);
    }

    return (
        <div style={styles.root}>
            <div style={styles.tickerBar}>
                <div style={styles.tickerScroll}>
                    <div style={styles.tickerContent}>
                        {symbols.map((symbol) => <SimpleTicker key={`${symbol}-1`} symbol={symbol} />)}
                    </div>
                    <div style={styles.tickerContent}>
                        {symbols.map((symbol) => <SimpleTicker key={`${symbol}-2`} symbol={symbol} />)}
                    </div>
                </div>
            </div>
            <div style={styles.contentRow}>
                <div style={styles.mainContent}>
                    <h1>Stock Tracker</h1>

                    <form action={addSymbol} style={styles.form}>
                        <input
                            style={styles.input}
                            name='query'
                            placeholder='Enter stock symbol'
                        />
                        <button type='submit'>Add</button>
                    </form>

                    <div style={styles.trackerContainer}>
                        <div style={styles.trackerInner}>
                            {symbols.map((symbol) => <SingleTickerTracker key={symbol} symbol={symbol} />)}
                        </div>
                    </div>
                </div>
                <div>
                    <LogComponent />
                </div>
            </div>
        </div>
    );
}

export default App;
