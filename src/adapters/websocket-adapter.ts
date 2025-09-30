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
    private messageSubject = new Subject<IMessage<T[any]>>();
    private isInitialized = false;
    private reconnectAttempts = 0;
    private reconnectTimer: number | null = null;

    constructor(private config: IWebSocketAdapterConfig) {}

    async initialize(): Promise<void> {
        if (this.isInitialized) {
            return;
        }
        this.isInitialized = true;
    }

    async connect(): Promise<void> {
        if (this.socket?.readyState === WebSocket.OPEN) {
            return;
        }

        return new Promise((resolve, reject) => {
            try {
                this.socket = new WebSocket(
                    this.config.url,
                    this.config.protocols
                );

                this.socket.onopen = () => {
                    console.log('🔌 WebSocket connection established');
                    this.reconnectAttempts = 0;
                    if (this.reconnectTimer) {
                        clearTimeout(this.reconnectTimer);
                        this.reconnectTimer = null;
                    }
                    resolve();
                };

                this.socket.onmessage = (event) => {
                    try {
                        const data =
                            this.config.messageFormat === 'raw'
                                ? event.data
                                : JSON.parse(event.data);

                        if (
                            this.config.messageFormat === 'json' &&
                            this.isValidMessage(data)
                        ) {
                            this.messageSubject.next(data as IMessage<T[any]>);
                        } else if (this.config.messageFormat === 'raw') {
                            const message: IMessage<T[any]> = {
                                channelName: 'websocket',
                                data: data,
                                timestamp: Date.now(),
                                id: this.generateId(),
                                isHandled: false,
                            };
                            console.log(
                                '✅ Raw message, wrapping and forwarding:',
                                message
                            );
                            this.messageSubject.next(message);
                        } else {
                            console.warn('❌ Invalid message format:', data);
                            console.warn('❌ Validation details:', {
                                hasData: data !== undefined && data !== null,
                                hasChannelName:
                                    data &&
                                    typeof data.channelName === 'string',
                                hasDataField: data && data.data !== undefined,
                                hasTimestamp:
                                    data && typeof data.timestamp === 'number',
                                hasId: data && typeof data.id === 'string',
                                hasIsHandled:
                                    data && typeof data.isHandled === 'boolean',
                            });
                        }
                    } catch (error) {
                        console.warn(
                            'Failed to parse WebSocket message:',
                            error
                        );
                    }
                };

                this.socket.onerror = (error) => {
                    reject(new Error(`WebSocket connection failed: ${error}`));
                };

                this.socket.onclose = () => {
                    if (
                        this.config.reconnectOnClose !== false &&
                        this.shouldReconnect()
                    ) {
                        this.scheduleReconnect();
                    }
                };
            } catch (error) {
                reject(error);
            }
        });
    }

    async disconnect(): Promise<void> {
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }

        if (this.socket) {
            this.socket.close(1000, 'Normal closure');
            this.socket = null;
        }

        this.messageSubject.complete();
    }

    async sendMessage(channelName: keyof T, message: IMessage): Promise<void> {
        if (!this.isConnected()) {
            console.error('❌ WebSocket is not connected!');
            throw new Error('WebSocket is not connected');
        }

        const payload =
            this.config.messageFormat === 'json'
                ? JSON.stringify({ channelName, message })
                : message.data;

        this.socket!.send(payload);
    }

    getMessageStream(): Observable<IMessage<T[any]>> {
        return this.messageSubject.asObservable();
    }

    isConnected(): boolean {
        return this.socket?.readyState === WebSocket.OPEN;
    }

    private isValidMessage(data: any): data is IMessage<T[any]> {
        return (
            data &&
            typeof data.channelName === 'string' &&
            data.data !== undefined &&
            typeof data.timestamp === 'number' &&
            typeof data.id === 'string' &&
            typeof data.isHandled === 'boolean'
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
        this.reconnectTimer = setTimeout(async () => {
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
        }, interval);
    }

    private generateId(): string {
        return `ws-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 11)}`;
    }
}
