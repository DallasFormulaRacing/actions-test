import { useRef, useMemo } from 'react';
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
  const logsEndRef = useRef<HTMLDivElement>(null);

  const { isConnected, latestEvents } = useSSE();

  const logs = useMemo(() => {
    if (!latestEvents.length) return [];

    // Flatten all events and filter for this specific sensor
    const sensorLogs: LogEntry[] = latestEvents
      .flatMap((event: any) => {
        if (!event || !event.event || !Array.isArray(event.event.data)) return [];
        
        return event.event.data
          .filter((d: { sensor_id: number; time: string; data: number }) => d.sensor_id === sensorID)
          .map((d: { sensor_id: number; time: string; data: number }) => ({
            id: `${d.time}-${d.sensor_id}-${Math.random()}`,
            time: d.time,
            sensor_id: d.sensor_id,
            event_type: event.event.event_type,
            data: d.data,
          }));
      });

    // Keep only the last MAX_LOGS entries
    return sensorLogs.slice(-MAX_LOGS);
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
                        <div>time: {new Date(log.time).toLocaleString('en-US', { 
                          timeZone: 'America/Chicago',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: true
                        })}</div>
                        {/* <div>sensor_id: {log.sensor_id}</div> */}
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
