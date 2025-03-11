export type Symbol = string;

export interface Stock {
    symbol: Symbol;
    price: number;
}

export interface IStockContract {
    'watch-stock': Symbol;
    'price-update': Stock;

    'market-close': object;
    'market-open': object;
    'stock-split': Stock;
}
