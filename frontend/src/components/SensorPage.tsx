// import { SectionCards } from "./section-cards"
import { ChartAreaInteractive } from "./chart-area-interactive"
// import { DataTable } from "./data-table"
import LiveLogStream from "./LiveLogStream"

import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"

export default function SensorPage() {
  const { sensorId } = useParams<{ sensorId: string }>()
  const {
    data: metrics = [],
  } = useQuery({
    queryKey: ['sensorMetrics', sensorId],
    queryFn: async () => {
      const res = await fetch(`http://localhost:5000/sensors/${sensorId}/metrics`)
      if (!res.ok) {
        throw new Error('Network err')
      }
      return res.json()
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  })

  return (
    <>
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* <SectionCards /> */}
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive sensorId={Number(sensorId)}/>
          </div>
          {/* <DataTable data={data} /> */}
        </div>
      </div>
    </div>
    {sensorId && <LiveLogStream sensorID={parseInt(sensorId)} />}
    </>
    )
}
