import { useRef, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSSE } from '@/hooks/useSSE';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

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
    return sensorLogs.slice(-MAX_LOGS).reverse();
  }, [latestEvents, sensorID]);

  // useEffect(() => {
  //   if (shouldAutoScrollRef.current) {
  //     logsEndRef.current?.scrollIntoView({ behavior: 'instant' });
  //   }
  // }, [logs]);

  return (
    <div className="px-4 lg:px-6">
      <Card className="border border-white/10 backdrop-blur-sm @container/card">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            Logs
            <span className={`text-sm ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
              {isConnected ? '● Connected' : '● Disconnected'}
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Table className="text-white">
            <TableHeader>
              <TableRow className="hover:bg-transparent border-white/10">
                <TableHead className="text-white/70">Time</TableHead>
                <TableHead className="text-white/70">Data</TableHead>
                <TableHead className="text-white/70">Event Type</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-gray-500 py-6 text-center">
                    Waiting for events...
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log, idx) => (
                  <TableRow
                    key={log.id}
                    className={`
                      border-white/5 
                      ${idx % 2 === 0 ? "bg-white/5" : "bg-white/0"}
                      hover:bg-white/10
                    `}
                  >
                    <TableCell>
                      {new Date(log.time).toLocaleString("en-US", {
                        timeZone: "America/Chicago",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      })}
                    </TableCell>

                    <TableCell className="font-mono text-blue-300">
                      {log.data}
                    </TableCell>

                    <TableCell className="capitalize">
                      {log.event_type}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
