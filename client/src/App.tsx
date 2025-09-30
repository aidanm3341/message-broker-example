import React, { useState } from 'react';
import './App.css';
import { SingleTickerTracker } from './components/single-ticker-tracker/SingleTickerTracker.tsx';
import { SimpleTicker } from './components/simple-ticker/SimpleTicker.tsx';
import { LogComponent } from './components/log/LogComponent.tsx';
import { messagebroker } from '@morgan-stanley/message-broker';
import { IStockContract } from './contracts.ts';

////////////
const broker = messagebroker<IStockContract>();
const watchStockChannel = broker.create('watch-stock');
////////////

function App() {
    const [symbols, setSymbols] = useState<string[]>([]);

    function addSymbol(formData: FormData) {
        const queryString: string = formData.get('query')?.toString() || '';
        /////////////
        console.log('🔵 Publishing watch-stock:', queryString);
        watchStockChannel.publish(queryString);
        /////////////
        setSymbols((oldSymbols) => [...oldSymbols, queryString]);
    }

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                width: '100vw',
                height: '100vh',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflowX: 'auto',
                    flex: '1',
                }}
            >
                <h1>Stock Tracker</h1>
                <div
                    style={{
                        display: 'flex',
                        position: 'absolute',
                        top: '0',
                        left: '0',
                    }}
                >
                    {symbols.map((symbol) => <SimpleTicker key={symbol} symbol={symbol} />)}
                </div>

                <form
                    action={addSymbol}
                    style={{
                        width: '50rem',
                        display: 'flex',
                    }}
                >
                    <input
                        style={{
                            flexGrow: 1,
                            marginRight: '1rem',
                        }}
                        name='query'
                    />
                    <button type='submit'>Add</button>
                </form>

                <div
                    style={{
                        display: 'flex',
                    }}
                >
                    {symbols.map((symbol) => <SingleTickerTracker key={symbol} symbol={symbol} />)}
                </div>
            </div>
            <div>
                <LogComponent />
            </div>
        </div>
    );
}

export default App;
