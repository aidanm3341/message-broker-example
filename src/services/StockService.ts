import { messagebroker } from '@morgan-stanley/message-broker';
import { IStockContract, Stock } from '../contracts.ts';
import { Decimal } from 'decimal.js';

export class StockService {
    ///////////////
    private broker = messagebroker<IStockContract>();
    private priceUpdateChannel = this.broker.create('price-update', {
        replayCacheSize: 1000,
    });
    ///////////////

    private stocks: Stock[] = [];

    constructor() {
        setInterval(() => {
            this.stocks.forEach((stock) => {
                this.publishNewRandomPrices(stock);
            });
        }, 1000);
    }

    public addStock(symbol: string) {
        this.addStockWithInitialPrice(symbol, 50);
    }

    private addStockWithInitialPrice(symbol: string, price: number) {
        if (this.stocks.find((stock) => stock.symbol === symbol)) {
            return;
        }

        const stock = {
            symbol,
            price,
        };

        this.stocks.push(stock);

        [...Array(50)].map((_) => {
            this.publishNewRandomPrices(stock);
        });
    }

    private getRandomOffset(min: number, max: number): Decimal {
        return new Decimal(Math.random() * (max - min) + min).toDecimalPlaces(2);
    }

    private calculateNewPrice(oldPrice: number): number {
        return new Decimal(oldPrice).add(this.getRandomOffset(5, -5))
            .toNumber();
    }

    private publishNewRandomPrices(stock: Stock) {
        ///////////////
        stock.price = this.calculateNewPrice(stock.price);
        this.priceUpdateChannel.publish({
            ...stock,
        });
        ///////////////
    }
}
