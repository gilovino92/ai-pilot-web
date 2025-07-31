/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

export type ConnectionStats = {
  bytesReceived: number;
  bytesSent: number;
  connectTime: number;
  disconnectTime: null | number;
  latency: null | number;
  messagesReceived: number;
  messagesSent: number;
  reconnectCount: number;
};

export type EventMap = {
  close: CloseEvent;
  error: Event;
  latencyUpdate: number;
  message: ArrayBuffer | string;
  open: void;
  queueSize: number;
  reconnected: void;
  reconnecting: number;
};

type EventCallback<T> = (data: T) => void;

type EventsType = { [K in keyof EventMap]: Set<EventCallback<EventMap[K]>> };

type QueuedMessage = {
  data: ArrayBuffer | string;
  retries: number;
  timestamp: number;
};

class Timeout {
  private timeoutId?: ReturnType<typeof setTimeout>;

  constructor(callback: () => void, delay: number) {
    this.timeoutId = setTimeout(callback, delay);
  }

  dispose(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
  }
}

class Timer {
  private timerId?: ReturnType<typeof setInterval>;

  constructor(callback: () => void, interval: number, immediate = false) {
    if (immediate) {
      callback();
    }
    this.timerId = setInterval(callback, interval);
  }

  dispose(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = undefined;
    }
  }
}

export class WebSocketClient {
  public get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  public get isConnecting(): boolean {
    return this.connecting;
  }

  private connecting = false;
  private connectionTimeout?: Timeout;
  private events: EventsType = {
    close: new Set(),
    error: new Set(),
    latencyUpdate: new Set(),
    message: new Set(),
    open: new Set(),
    queueSize: new Set(),
    reconnected: new Set(),
    reconnecting: new Set(),
  };
  private heartbeatTimer?: Timer;
  private lastPingTime = 0;
  private manuallyDisconnected = false;
  private messageQueue: QueuedMessage[] = [];
  private readonly options: {
    binaryType?: BinaryType;
    connectionTimeout: number;
    heartbeatInterval: number;
    maxQueueSize: number;
    maxRetries: number;
    queueFlushInterval: number;
    reconnectAttempts: number;
    reconnectDelay: number;
  };
  private queueTimer?: Timer;
  private reconnectCount = 0;
  private stats: ConnectionStats = {
    bytesReceived: 0,
    bytesSent: 0,
    connectTime: 0,
    disconnectTime: null,
    latency: null,
    messagesReceived: 0,
    messagesSent: 0,
    reconnectCount: 0,
  };
  private readonly url: string;
  private ws: null | WebSocket = null;

  constructor(
    url: string,
    options: Partial<typeof WebSocketClient.prototype.options> = {},
  ) {
    this.url = url;
    this.options = {
      binaryType: "arraybuffer",
      connectionTimeout: 5000,
      heartbeatInterval: 30000,
      maxQueueSize: 1000,
      maxRetries: 3,
      queueFlushInterval: 300,
      reconnectAttempts: 5,
      reconnectDelay: 1000,
      ...options,
    };
  }

  public clearQueue(): void {
    this.messageQueue = [];
    this.emit("queueSize", 0);
  }

  public async connect(): Promise<void> {
    this.manuallyDisconnected = false;

    if (this.ws?.readyState === WebSocket.OPEN || this.connecting) {
      throw new Error("WebSocket connection already exists");
    }

    this.connecting = true;

    try {
      await this.createConnection();
      this.startQueueProcessor();
    } finally {
      this.connecting = false;
    }
  }

  public disconnect(): void {
    if (this.ws) {
      this.manuallyDisconnected = true;
      this.ws.close();
      this.ws = null;
    }
    this.cleanup();
  }

  public enqueue(data: ArrayBuffer | string): void {
    this.queueMessage(data);
  }

  public enqueueMultiple(dataItems: (ArrayBuffer | string)[]): void {
    const totalNewItems = dataItems.length;
    const currentQueueSize = this.messageQueue.length;

    if (currentQueueSize + totalNewItems > this.options.maxQueueSize) {
      throw new Error(
        `Cannot enqueue ${totalNewItems} messages. Would exceed maximum queue size of ${this.options.maxQueueSize}`,
      );
    }

    const newMessages: QueuedMessage[] = dataItems.map((data) => ({
      data,
      retries: 0,
      timestamp: Date.now(),
    }));

    this.messageQueue = [...this.messageQueue, ...newMessages];

    this.emit("queueSize", this.messageQueue.length);
  }

  public getQueueSize(): number {
    return this.messageQueue.length;
  }

  public getStats(): ConnectionStats {
    return { ...this.stats };
  }

  public off<K extends keyof EventMap>(
    event: K,
    callback: EventCallback<EventMap[K]>,
  ): void {
    this.events[event].delete(callback);
  }

  public on<K extends keyof EventMap>(
    event: K,
    callback: EventCallback<EventMap[K]>,
  ): void {
    this.events[event].add(callback);
  }

  public once<K extends keyof EventMap>(
    event: K,
    callback: EventCallback<EventMap[K]>,
  ): void {
    const wrappedCallback = ((data: EventMap[K]) => {
      this.off(event, wrappedCallback);
      callback(data);
    }) as EventCallback<EventMap[K]>;

    this.on(event, wrappedCallback);
  }

  public send(data: ArrayBuffer | string): void {
    if (this.isConnected && this.messageQueue.length === 0) {
      this.sendImmediate(data).catch(() => {
        this.queueMessage(data);
      });
    } else {
      this.queueMessage(data);
    }
  }

  private cleanup(): void {
    this.connectionTimeout?.dispose();
    this.heartbeatTimer?.dispose();
    this.queueTimer?.dispose();
  }

  private createConnection(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.url);
      this.ws.binaryType = this.options.binaryType!;

      this.connectionTimeout = new Timeout(() => {
        if (this.ws?.readyState !== WebSocket.OPEN) {
          this.ws?.close();
          reject(new Error("Connection timeout"));
        }
      }, this.options.connectionTimeout);

      this.ws.onopen = () => {
        this.stats.connectTime = Date.now();
        this.stats.disconnectTime = null;
        this.startHeartbeat();
        this.emit("open", undefined);

        if (this.reconnectCount > 0) {
          this.emit("reconnected", undefined);
        }

        this.reconnectCount = 0;
        resolve();
      };

      this.ws.onclose = async (event) => {
        this.stats.disconnectTime = Date.now();
        this.emit("close", event);
        this.cleanup();

        if (
          !this.manuallyDisconnected &&
          this.reconnectCount < this.options.reconnectAttempts
        ) {
          this.reconnectCount++;
          this.stats.reconnectCount++;
          this.emit("reconnecting", this.reconnectCount);

          const delay =
            this.options.reconnectDelay * Math.pow(2, this.reconnectCount - 1);
          await new Promise((resolve) => setTimeout(resolve, delay));

          if (!this.connecting) {
            this.connect().catch((error) => {
              this.emit(
                "error",
                new Event(`Reconnection failed: ${error.message}`),
              );
            });
          }
        }
      };

      this.ws.onerror = (event) => {
        this.emit("error", event);
        reject(event);
      };

      this.ws.onmessage = (event) => {
        this.handleMessage(event);
      };
    });
  }

  private emit<K extends keyof EventMap>(event: K, data: EventMap[K]): void {
    this.events[event].forEach((callback) => callback(data));
  }

  private getMessageSize(data: any): number {
    if (typeof data === "string") {
      return new Blob([data]).size;
    }
    return data.byteLength;
  }

  private handleMessage(event: MessageEvent): void {
    this.stats.messagesReceived++;
    this.stats.bytesReceived += this.getMessageSize(event.data);

    if (typeof event.data === "string" && event.data === "pong") {
      this.updateLatency();
      return;
    }

    this.emit("message", event.data);
  }

  private async processQueue(): Promise<void> {
    if (!this.isConnected || this.messageQueue.length === 0) {
      return;
    }

    const message = this.messageQueue[0];
    try {
      await this.sendImmediate(message.data);
      this.messageQueue.shift();
      this.emit("queueSize", this.messageQueue.length);
    } catch (error) {
      message.retries++;
      if (message.retries >= this.options.maxRetries) {
        this.messageQueue.shift();
        this.emit(
          "error",
          new Event(
            `Failed to send message after ${this.options.maxRetries} retries`,
          ),
        );
      }
    }
  }

  private queueMessage(data: ArrayBuffer | string): void {
    if (this.messageQueue.length >= this.options.maxQueueSize) {
      throw new Error("Message queue is full");
    }

    this.messageQueue.push({
      data,
      retries: 0,
      timestamp: Date.now(),
    });

    this.emit("queueSize", this.messageQueue.length);
  }

  private async sendImmediate(data: ArrayBuffer | string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.isConnected) {
        reject(new Error("WebSocket is not connected"));
        return;
      }

      try {
        this.ws!.send(data);
        this.stats.messagesSent++;
        this.stats.bytesSent += this.getMessageSize(data);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  private startHeartbeat(): void {
    this.heartbeatTimer = new Timer(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.lastPingTime = Date.now();
        this.ws.send("ping");
      }
    }, this.options.heartbeatInterval);
  }

  private startQueueProcessor(): void {
    this.queueTimer = new Timer(() => {
      this.processQueue();
    }, this.options.queueFlushInterval);
  }

  private updateLatency(): void {
    const latency = Date.now() - this.lastPingTime;
    this.stats.latency = latency;
    this.emit("latencyUpdate", latency);
  }
}

export default WebSocketClient;
