import { messagebroker } from '@morgan-stanley/message-broker';
import { WebSocketAdapter } from '../adapters/websocket-adapter.ts';
import { IStockContract } from '../contracts.ts';
import { WEBSOCKET_CONFIG } from '../config/constants.ts';

export async function initializeWebSocket(): Promise<void> {
    const broker = messagebroker<IStockContract>();
    const wsAdapter = new WebSocketAdapter<IStockContract>({
        url: WEBSOCKET_CONFIG.URL,
        messageFormat: WEBSOCKET_CONFIG.MESSAGE_FORMAT,
        reconnectInterval: WEBSOCKET_CONFIG.RECONNECT_INTERVAL,
        maxReconnectAttempts: WEBSOCKET_CONFIG.MAX_RECONNECT_ATTEMPTS,
    });

    await wsAdapter.initialize();
    await wsAdapter.connect();

    const adapterId = broker.registerAdapter(wsAdapter);
    console.log('✅ WebSocket adapter registered with ID:', adapterId);
}