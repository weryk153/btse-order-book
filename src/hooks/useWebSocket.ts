import { useEffect, useRef } from 'react';

type Options = {
  retryOnSeqMismatch?: boolean;
  filterBySymbol?: string;
};

export function useWebSocket<T>(url: string, topic: string, onMessage: (data: T) => void, options?: Options) {
  const socketRef = useRef<WebSocket | null>(null);
  const lastSeqRef = useRef<number | null>(null);

  useEffect(() => {
    const socket = new WebSocket(url);
    socketRef.current = socket;

    let opened = false;
    let shouldClose = false;

    const subscribe = () => {
      socket.send(JSON.stringify({ op: 'subscribe', args: [topic] }));
    };

    const unsubscribe = () => {
      socket.send(JSON.stringify({ op: 'unsubscribe', args: [topic] }));
    };

    socket.onopen = () => {
      opened = true;
      if (shouldClose) {
        socket.close();
        return;
      }
      subscribe();
    };

    socket.onmessage = event => {
      try {
        const msg = JSON.parse(event.data);
        if (!msg?.data) return;

        if (options?.filterBySymbol && Array.isArray(msg.data) && msg.data[0]?.symbol !== options.filterBySymbol) {
          return;
        }

        const data = msg.data as T;

        const { seqNum, prevSeqNum, type } = msg.data ?? {};
        if (
          options?.retryOnSeqMismatch &&
          type !== 'snapshot' &&
          lastSeqRef.current !== null &&
          prevSeqNum !== lastSeqRef.current
        ) {
          unsubscribe();
          subscribe();
          return;
        }

        if (typeof seqNum === 'number') {
          lastSeqRef.current = seqNum;
        }

        onMessage(data);
      } catch (err) {
        console.error('WebSocket message parse error:', err);
      }
    };

    socket.onerror = err => {
      console.error(`WebSocket error on ${url} (${topic}):`, err);
    };

    return () => {
      if (opened) {
        if (socket.readyState === WebSocket.CONNECTING || socket.readyState === WebSocket.OPEN) {
          socket.close();
        }
      } else {
        shouldClose = true;
      }
    };
  }, [url, topic]);
}
