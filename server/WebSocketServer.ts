import { StockManager } from './StockManager.ts';
import {
    Symbol,
    isWatchStockMessage,
    createPriceUpdateMessage,
    StockData,
} from './types.ts';
import { SERVER_CONFIG, STOCK_CONFIG } from './config.ts';

export class WebSocketServer {
    private clients = new Set<WebSocket>();
    private stockManager = new StockManager();
    private updateInterval: number | null = null;

    start(port: number = SERVER_CONFIG.PORT): void {
        console.log(`WebSocket server starting on port ${port}...`);

        Deno.serve({ port }, (req) => {
            if (req.headers.get('upgrade') === 'websocket') {
                const { socket, response } = Deno.upgradeWebSocket(req);

                socket.onopen = () => this.handleClientConnect(socket);
                socket.onmessage = (event) => this.handleClientMessage(event);
                socket.onclose = () => this.handleClientDisconnect(socket);
                socket.onerror = (error) =>
                    this.handleClientError(socket, error);

                return response;
            }

            return new Response('WebSocket server', { status: 200 });
        });

        this.startPriceUpdates();
        console.log(`WebSocket server running on ws://localhost:${port}`);
    }

    private handleClientConnect(socket: WebSocket): void {
        console.log('Client connected');
        this.clients.add(socket);
        this.sendExistingStocks(socket);
    }

    private handleClientMessage(event: MessageEvent): void {
        try {
            const data = JSON.parse(event.data);

            if (isWatchStockMessage(data)) {
                const symbol = data.message.data as Symbol;
                this.watchStock(symbol);
                console.log(`Client watching: ${symbol}`);
            }
        } catch (error) {
            console.error('Failed to parse message:', error);
        }
    }

    private handleClientDisconnect(socket: WebSocket): void {
        console.log('Client disconnected');
        this.clients.delete(socket);
    }

    private handleClientError(socket: WebSocket, error: Event): void {
        console.error('WebSocket error:', error);
        this.clients.delete(socket);
    }

    private watchStock(symbol: Symbol): void {
        this.stockManager.addStock(symbol);

        const stock = this.stockManager.getStock(symbol);
        if (!stock) return;

        // Send initial price points
        for (let i = 0; i < STOCK_CONFIG.INITIAL_DATA_POINTS; i++) {
            this.stockManager.updateStockPrice(stock);
            this.broadcastPriceUpdate(stock);
        }
    }

    private sendExistingStocks(socket: WebSocket): void {
        this.stockManager.getAllStocks().forEach((stock) => {
            if (socket.readyState === WebSocket.OPEN) {
                this.sendPriceUpdate(socket, stock);
            }
        });
    }

    private startPriceUpdates(): void {
        if (this.updateInterval) return;

        this.updateInterval = setInterval(() => {
            this.stockManager.getAllStocks().forEach((stock) => {
                this.stockManager.updateStockPrice(stock);
                this.broadcastPriceUpdate(stock);
            });
        }, SERVER_CONFIG.UPDATE_INTERVAL);
    }

    private broadcastPriceUpdate(stock: StockData): void {
        this.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                this.sendPriceUpdate(client, stock);
            }
        });
    }

    private sendPriceUpdate(socket: WebSocket, stock: StockData): void {
        const message = createPriceUpdateMessage(stock);
        console.log(`Sending to ${stock.symbol}: $${stock.price}`);
        socket.send(JSON.stringify(message));
    }
}
