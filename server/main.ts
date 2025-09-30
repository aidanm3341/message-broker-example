import { WebSocketServer } from './WebSocketServer.ts';
import { SERVER_CONFIG } from './config.ts';

const server = new WebSocketServer();
server.start(SERVER_CONFIG.PORT);
