import React, { createContext, useEffect, useState } from "react";

interface SSEContextType {
  latestEvents: any[];
  isConnected: boolean;
}

export const SSEContext = createContext<SSEContextType>({
  latestEvents: [],
  isConnected: false,
});

export function SSEProvider({ children }: { children: React.ReactNode }) {
  const [latestEvents, setLatestEvents] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const es = new EventSource("http://localhost:5000/eventhub/stream");

    es.onopen = () => {
      console.log("SSE connected");
      setIsConnected(true);
    };

    es.onerror = () => {
      console.log("SSE disconnected");
      setIsConnected(false);
    };

    es.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        setLatestEvents((prev) => [...prev, msg].slice(-300));
      } catch (err: any) {
        console.error(err.msg);
      }
    };

    return () => es.close();
  }, []);

  return (
    <SSEContext.Provider value={{ latestEvents, isConnected }}>
      {children}
    </SSEContext.Provider>
  );
}
