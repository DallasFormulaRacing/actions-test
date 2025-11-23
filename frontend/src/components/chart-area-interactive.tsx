"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { ChartConfig } from "@/components/ui/chart"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { useSSE } from "@/hooks/useSSE"

export const description = "An interactive area chart"

type Metrics = {
  sensor_id: number;
  data: number;
  time: string;
}

const sensorsConfig = {
  visitors: {
    label: "Sensor Metrics",
  },
  data: {
    label: "Data",
    color: "var(--primary)",
  }
} satisfies ChartConfig

const MAX_POINTS = 150;

export function ChartAreaInteractive({ sensorId }: { sensorId: number }) {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")
  const { latestEvents } = useSSE()

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const metrics = React.useMemo(() => {
    if (!latestEvents.length) return [];

    // flatten all events for this specific sensor
    const all_points = latestEvents.flatMap((event: any) => {
      if (!event || !event.event || !Array.isArray(event.event.data)) return [];

      return event.event.data
        .filter((d: any) => d.sensor_id === sensorId)
        .map((d: any) => ({
          sensor_id: d.sensor_id,
          data: d.data,
          time: d.time,
        }));
    });

    return all_points.slice(-MAX_POINTS);
  }, [latestEvents, sensorId]);

  const filteredMetrics = metrics.map(m => {
    const t = new Date(m.time);
    
    return {
      ...m,
      date: isNaN(t.getTime())
        ? null
        : t.toISOString()
    };
  });


  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Sensor Data</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Last 50 Data Points
          </span>
          <span className="@[540px]/card:hidden">Last 50 data points</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={sensorsConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredMetrics}> {/* SENSOR DATA */}
            <defs>
              <linearGradient id="fillData" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-data)"
                  stopOpacity={0.6}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-data)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              hide
            />
            <YAxis
              domain={['auto', 'auto']}
              axisLine={false}
              hide={isMobile}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="data"
              type="natural"
              fill="url(#fillData)"
              stroke="var(--color-data)"
              // stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
