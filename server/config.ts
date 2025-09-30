export const SERVER_CONFIG = {
    PORT: 8080,
    UPDATE_INTERVAL: 1000,
} as const;

export const STOCK_CONFIG = {
    INITIAL_PRICE: 50,
    INITIAL_DATA_POINTS: 50,
    PRICE_MIN_CHANGE: -5,
    PRICE_MAX_CHANGE: 5,
    DECIMAL_PLACES: 2,
} as const;