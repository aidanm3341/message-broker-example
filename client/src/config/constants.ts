export const WEBSOCKET_CONFIG = {
    URL: 'ws://localhost:8080',
    MESSAGE_FORMAT: 'json' as const,
    RECONNECT_INTERVAL: 3000,
    MAX_RECONNECT_ATTEMPTS: 10,
};

export const CHART_CONFIG = {
    WIDTH: 300,
    HEIGHT: 200,
    STROKE_COLOR: '#8884d8',
    STROKE_WIDTH: 2,
};
