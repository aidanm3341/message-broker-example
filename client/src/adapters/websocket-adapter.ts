import { Observable, Subject } from 'rxjs';
import {
    IMessageBrokerAdapter,
    IMessage,
} from '@morgan-stanley/message-broker';

export interface IWebSocketAdapterConfig {
    url: string;
    protocols?: string | string[];
    reconnectInterval?: number;
    maxReconnectAttempts?: number;
    reconnectOnClose?: boolean;
    messageFormat?: 'json' | 'raw';
}

export class WebSocketAdapter<T> implements IMessageBrokerAdapter<T> {
    private socket: WebSocket | null = null;
    private messageSubject = new Subject<IMessage<T[keyof T]>>();
    private isInitialized = false;
    private reconnectAttempts = 0;
    private reconnectTimer: number | null = null;

    constructor(private config: IWebSocketAdapterConfig) {}

    initialize(): Promise<void> {
        if (this.isInitialized) {
            return Promise.resolve();
        }
        this.isInitialized = true;
        return Promise.resolve();
    }

    connect(): Promise<void> {
        if (this.socket?.readyState === WebSocket.OPEN) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            try {
                this.createWebSocket(resolve, reject);
            } catch (error) {
                reject(error);
            }
        });
    }

    private createWebSocket(resolve: () => void, reject: (error: Error) => void): void {
        this.socket = new WebSocket(this.config.url, this.config.protocols);

        this.socket.onopen = () => this.handleOpen(resolve);
        this.socket.onmessage = (event) => this.handleMessage(event);
        this.socket.onerror = (error) => this.handleError(error, reject);
        this.socket.onclose = () => this.handleClose();
    }

    private handleOpen(resolve: () => void): void {
        console.log('WebSocket connection established');
        this.reconnectAttempts = 0;
        this.clearReconnectTimer();
        resolve();
    }

    private handleMessage(event: MessageEvent): void {
        try {
            const data = this.parseMessageData(event.data);
            this.processMessage(data);
        } catch (error) {
            console.warn('Failed to parse WebSocket message:', error);
        }
    }

    private parseMessageData(rawData: unknown): unknown {
        return this.config.messageFormat === 'raw'
            ? rawData
            : JSON.parse(rawData as string);
    }

    private processMessage(data: unknown): void {
        if (this.config.messageFormat === 'json' && this.isValidMessage(data)) {
            this.messageSubject.next(data as IMessage<T[keyof T]>);
        } else if (this.config.messageFormat === 'raw') {
            this.handleRawMessage(data);
        } else {
            this.logInvalidMessage(data);
        }
    }

    private handleRawMessage(data: unknown): void {
        const message: IMessage<T[keyof T]> = {
            channelName: 'websocket',
            data: data as T[keyof T],
            timestamp: Date.now(),
            id: this.generateId(),
            isHandled: false,
        };
        console.log('Raw message, wrapping and forwarding:', message);
        this.messageSubject.next(message);
    }

    private logInvalidMessage(data: unknown): void {
        console.warn('Invalid message format:', data);

        if (typeof data === 'object' && data !== null) {
            const msg = data as Record<string, unknown>;
            console.warn('Validation details:', {
                hasData: data !== undefined && data !== null,
                hasChannelName: typeof msg.channelName === 'string',
                hasDataField: msg.data !== undefined,
                hasTimestamp: typeof msg.timestamp === 'number',
                hasId: typeof msg.id === 'string',
                hasIsHandled: typeof msg.isHandled === 'boolean',
            });
        }
    }

    private handleError(error: Event, reject: (error: Error) => void): void {
        reject(new Error(`WebSocket connection failed: ${error}`));
    }

    private handleClose(): void {
        if (this.config.reconnectOnClose !== false && this.shouldReconnect()) {
            this.scheduleReconnect();
        }
    }

    private clearReconnectTimer(): void {
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }
    }

    disconnect(): Promise<void> {
        this.clearReconnectTimer();
        this.closeSocket();
        this.messageSubject.complete();
        return Promise.resolve();
    }

    private closeSocket(): void {
        if (this.socket) {
            this.socket.close(1000, 'Normal closure');
            this.socket = null;
        }
    }

    sendMessage(channelName: keyof T, message: IMessage): Promise<void> {
        if (!this.isConnected()) {
            console.error('WebSocket is not connected!');
            return Promise.reject(new Error('WebSocket is not connected'));
        }

        const payload = this.buildPayload(channelName, message);
        this.socket!.send(payload);
        return Promise.resolve();
    }

    private buildPayload(channelName: keyof T, message: IMessage): string {
        if (this.config.messageFormat === 'json') {
            return JSON.stringify({ channelName, message });
        }
        // For raw format, convert message.data to string
        return typeof message.data === 'string'
            ? message.data
            : JSON.stringify(message.data);
    }

    getMessageStream(): Observable<IMessage<T[keyof T]>> {
        return this.messageSubject.asObservable();
    }

    isConnected(): boolean {
        return this.socket?.readyState === WebSocket.OPEN;
    }

    private isValidMessage(data: unknown): data is IMessage<T[keyof T]> {
        if (typeof data !== 'object' || data === null) {
            return false;
        }
        const msg = data as Record<string, unknown>;
        return (
            typeof msg.channelName === 'string' &&
            msg.data !== undefined &&
            typeof msg.timestamp === 'number' &&
            typeof msg.id === 'string' &&
            typeof msg.isHandled === 'boolean'
        );
    }

    private shouldReconnect(): boolean {
        const maxAttempts = this.config.maxReconnectAttempts ?? 5;
        return this.reconnectAttempts < maxAttempts;
    }

    private scheduleReconnect(): void {
        if (this.reconnectTimer) {
            return;
        }

        const interval = this.config.reconnectInterval ?? 5000;
        this.reconnectTimer = setTimeout(() => this.attemptReconnect(), interval);
    }

    private async attemptReconnect(): Promise<void> {
        this.reconnectAttempts++;
        this.reconnectTimer = null;

        try {
            await this.connect();
        } catch (error) {
            console.warn(
                `WebSocket reconnection attempt ${this.reconnectAttempts} failed:`,
                error
            );
            if (this.shouldReconnect()) {
                this.scheduleReconnect();
            }
        }
    }

    private generateId(): string {
        return `ws-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 11)}`;
    }
}
