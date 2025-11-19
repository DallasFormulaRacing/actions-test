import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LogEntry {
  time: string;
  sensor_id: number;
  event_type: string;
  data: number;
}

export default function LiveLogStream() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Connect to SSE endpoint
    const eventSource = new EventSource('http://localhost:5000/eventhub/stream');
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log('SSE Connection opened');
      setIsConnected(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        // Extract event data
        const eventInfo = message.event;
        const eventType = eventInfo.event_type;
        const eventData = eventInfo.data;

        // Create log entries for each data item
        const newLogs = eventData.map((item: { time: string; sensor_id: number; data: number }) => ({
          time: item.time,
          sensor_id: item.sensor_id,
          event_type: eventType,
          data: item.data,
        }));

        setLogs((prevLogs) => [...prevLogs, ...newLogs]);
      } catch (error) {
        console.error('Error parsing SSE message:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error);
      setIsConnected(false);
    };

    // Cleanup on unmount
    return () => {
      eventSource.close();
    };
  }, []);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Logs</span>
                  <span className={`text-sm ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
                    {isConnected ? '● Connected' : '● Disconnected'}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-black rounded-lg p-4 h-96 overflow-y-auto font-mono text-sm">
                  {logs.length === 0 ? (
                    <div className="text-gray-500">Waiting for events...</div>
                  ) : (
                    logs.map((log, index) => (
                      <div key={index} className="mb-4 text-gray-100">
                        <div>time: {log.time}</div>
                        <div>sensor_id: {log.sensor_id}</div>
                        <div>event_type: {log.event_type}</div>
                        <div>data: {log.data}</div>
                        {index < logs.length - 1 && <div className="my-2 border-t border-gray-700"></div>}
                      </div>
                    ))
                  )}
                  <div ref={logsEndRef} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
