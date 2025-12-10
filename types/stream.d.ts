import type { StreamCallbacks, StreamRequest } from './types';
export declare abstract class StreamAdapter {
    abstract connect(request: StreamRequest, callbacks: StreamCallbacks): void;
    abstract disconnect(): void;
}
export declare class MockStreamAdapter extends StreamAdapter {
    private aborted;
    connect(request: StreamRequest, callbacks: StreamCallbacks): void;
    disconnect(): void;
    private generateThoughts;
    private generateResponse;
}
export declare class StreamClient {
    private adapter;
    constructor(protocol?: 'mock' | 'sse' | 'websocket');
    stream(request: StreamRequest, callbacks: StreamCallbacks): void;
    abort(): void;
}
//# sourceMappingURL=stream.d.ts.map