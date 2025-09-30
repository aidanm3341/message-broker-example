import React from 'react';
import 'reflect-metadata';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { messagebroker } from '@morgan-stanley/message-broker';
import { IStockContract } from './contracts.ts';
import { WebSocketAdapter } from './adapters/websocket-adapter.ts';

///////////////
// Initialize WebSocket adapter at app startup
const broker = messagebroker<IStockContract>();
const wsAdapter = new WebSocketAdapter<IStockContract>({
    url: 'ws://localhost:8080',
    messageFormat: 'json',
    reconnectInterval: 3000,
    maxReconnectAttempts: 10,
});

async function initializeAdapter() {
    await wsAdapter.initialize();
    await wsAdapter.connect();
    console.log(broker);
    const adapterId = broker.registerAdapter(wsAdapter);
    console.log('✅ WebSocket adapter registered with ID:', adapterId);
}

initializeAdapter().catch((error) => {
    console.error('Failed to initialize WebSocket adapter:', error);
});
///////////////

createRoot(document.getElementById('root')!).render(
    <App />,
);
