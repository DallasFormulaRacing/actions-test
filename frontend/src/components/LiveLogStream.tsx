import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSSE } from '@/hooks/useSSE';

interface LogEntry {
  id: string;
  time: string;
  sensor_id: number;
  event_type: string;
  data: number;
}

const MAX_LOGS = 100; // Limit log history to prevent performance degradation

export default function LiveLogStream({sensorID}: {sensorID: number}) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  // const [isConnected, setIsConnected] = useState(false);
  // const eventSourceRef = useRef<EventSource | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);
  // const shouldAutoScrollRef = useRef(true);

  const { isConnected, latestEvents } = useSSE();

  useEffect(() => {
    if (!latestEvents.length) return;

    // Extract logs for this specific sensor
    const sensorLogs: LogEntry[] = latestEvents
      .flatMap((event: any) =>
        event.event.data
          .filter((d: any) => d.sensor_id === sensorID)
          .map((d: any) => ({
            id: `${d.time}-${d.sensor_id}-${Math.random()}`,
            time: d.time,
            sensor_id: d.sensor_id,
            event_type: event.event.event_type,
            data: d.data,
          }))
      );

    if (sensorLogs.length > 0) {
      setLogs((prev) => {
        const updated = [...prev, ...sensorLogs];
        return updated.length > MAX_LOGS ? updated.slice(-MAX_LOGS) : updated;
      });
    }
  }, [latestEvents, sensorID]);

  // useEffect(() => {
  //   if (shouldAutoScrollRef.current) {
  //     logsEndRef.current?.scrollIntoView({ behavior: 'instant' });
  //   }
  // }, [logs]);

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
                      <div key={log.id} className="mb-4 text-gray-100">
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
