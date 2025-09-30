import { Decimal } from 'decimal.js';
import { StockData, Symbol, createPriceUpdateMessage } from './types.ts';
import { STOCK_CONFIG } from './config.ts';

export class StockManager {
    private stocks = new Map<Symbol, StockData>();

    addStock(symbol: Symbol): void {
        if (this.stocks.has(symbol)) {
            return;
        }

        const stock: StockData = {
            symbol,
            price: STOCK_CONFIG.INITIAL_PRICE,
        };
        this.stocks.set(symbol, stock);
    }

    getStock(symbol: Symbol): StockData | undefined {
        return this.stocks.get(symbol);
    }

    getAllStocks(): StockData[] {
        return Array.from(this.stocks.values());
    }

    updateStockPrice(stock: StockData): void {
        const offset = this.getRandomOffset(
            STOCK_CONFIG.PRICE_MIN_CHANGE,
            STOCK_CONFIG.PRICE_MAX_CHANGE
        );
        stock.price = new Decimal(stock.price).add(offset).toNumber();
    }

    private getRandomOffset(min: number, max: number): Decimal {
        return new Decimal(Math.random() * (max - min) + min).toDecimalPlaces(
            STOCK_CONFIG.DECIMAL_PLACES
        );
    }
}