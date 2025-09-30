import { Decimal } from 'decimal.js';
import type { IMessage } from '@morgan-stanley/message-broker';
import type { Stock, Symbol } from '../src/contracts.ts';

interface StockData {
    symbol: Symbol;
    price: number;
}

class StockPriceServer {
    private clients = new Set<WebSocket>();
    private stocks = new Map<Symbol, StockData>();
    private updateInterval: number | null = null;

    start(port: number) {
        console.log(`🚀 WebSocket server starting on port ${port}...`);

        Deno.serve({ port }, (req) => {
            if (req.headers.get('upgrade') === 'websocket') {
                const { socket, response } = Deno.upgradeWebSocket(req);

                socket.onopen = () => {
                    console.log('✅ Client connected');
                    this.clients.add(socket);
                    this.sendExistingStocks(socket);
                };

                socket.onmessage = (event) => {
                    try {
                        const data = JSON.parse(event.data);
                        this.handleClientMessage(socket, data);
                    } catch (error) {
                        console.error('Failed to parse message:', error);
                    }
                };

                socket.onclose = () => {
                    console.log('❌ Client disconnected');
                    this.clients.delete(socket);
                };

                socket.onerror = (error) => {
                    console.error('WebSocket error:', error);
                    this.clients.delete(socket);
                };

                return response;
            }

            return new Response('WebSocket server', { status: 200 });
        });

        this.startPriceUpdates();
        console.log(`✅ WebSocket server running on ws://localhost:${port}`);
    }

    private handleClientMessage(_socket: WebSocket, data: unknown) {
        if (
            typeof data === 'object' &&
            data !== null &&
            'channelName' in data &&
            data.channelName === 'watch-stock' &&
            'message' in data &&
            typeof data.message === 'object' &&
            data.message !== null &&
            'data' in data.message &&
            typeof data.message.data === 'string'
        ) {
            const symbol = data.message.data;
            this.addStock(symbol);
            console.log(`📊 Client watching: ${symbol}`);
        }
    }

    private addStock(symbol: Symbol) {
        if (!this.stocks.has(symbol)) {
            const stock: StockData = {
                symbol,
                price: 50,
            };
            this.stocks.set(symbol, stock);

            // Publish initial 50 price points
            for (let i = 0; i < 50; i++) {
                this.updateStockPrice(stock);
                this.broadcastPriceUpdate(stock);
            }
        }
    }

    private sendExistingStocks(socket: WebSocket) {
        this.stocks.forEach((stock) => {
            if (socket.readyState === WebSocket.OPEN) {
                this.sendPriceUpdate(socket, stock);
            }
        });
    }

    private startPriceUpdates() {
        if (this.updateInterval) return;

        this.updateInterval = setInterval(() => {
            this.stocks.forEach((stock) => {
                this.updateStockPrice(stock);
                this.broadcastPriceUpdate(stock);
            });
        }, 1000);
    }

    private updateStockPrice(stock: StockData) {
        const offset = this.getRandomOffset(-5, 5);
        stock.price = new Decimal(stock.price).add(offset).toNumber();
    }

    private getRandomOffset(min: number, max: number): Decimal {
        return new Decimal(Math.random() * (max - min) + min).toDecimalPlaces(
            2
        );
    }

    private broadcastPriceUpdate(stock: StockData) {
        this.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                this.sendPriceUpdate(client, stock);
            }
        });
    }

    private sendPriceUpdate(socket: WebSocket, stock: StockData) {
        const message: IMessage<Stock> = {
            channelName: 'price-update',
            data: {
                symbol: stock.symbol,
                price: stock.price,
            },
            timestamp: Date.now(),
            id: this.generateId(),
            isHandled: false,
        };

        console.log(`➡️ Sending to ${stock.symbol}: $${stock.price}`);
        socket.send(JSON.stringify(message));
    }

    private generateId(): string {
        return `server-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 11)}`;
    }
}

const server = new StockPriceServer();
server.start(8080);
