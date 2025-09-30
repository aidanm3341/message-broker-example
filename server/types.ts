import type { IMessage } from '@morgan-stanley/message-broker';

export type Symbol = string;

export interface Stock {
    symbol: Symbol;
    price: number;
}

export interface StockData {
    symbol: Symbol;
    price: number;
}

export interface ClientMessage {
    channelName: string;
    message: {
        data: unknown;
    };
}

export function isWatchStockMessage(data: unknown): data is ClientMessage {
    return (
        typeof data === 'object' &&
        data !== null &&
        'channelName' in data &&
        data.channelName === 'watch-stock' &&
        'message' in data &&
        typeof data.message === 'object' &&
        data.message !== null &&
        'data' in data.message &&
        typeof data.message.data === 'string'
    );
}

export function createPriceUpdateMessage(stock: StockData): IMessage<Stock> {
    return {
        channelName: 'price-update',
        data: {
            symbol: stock.symbol,
            price: stock.price,
        },
        timestamp: Date.now(),
        id: generateMessageId(),
        isHandled: false,
    };
}

function generateMessageId(): string {
    return `server-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}