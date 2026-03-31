"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { ChartProps } from "@/types/dataTypes";

const chartConfig = {
  value: {
    label: "Sales",
    color: "var(--color-blue-300)",
  },
} satisfies ChartConfig

export function ChartRadarDots({ title, description, dataKey, chartData }: ChartProps) {
  console.log("chartData", chartData);
  return (
    <Card>
      <CardHeader className="items-center pb-2">
        <CardTitle className="text-slate-500 font-medium">{title}</CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[200px] md:max-h-[300px] w-full"
        >
          <RadarChart data={chartData} margin={{ top: 10, right: 40, bottom: 10, left: 40 }} outerRadius="75%">
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" hideIndicator/>}/>
            <PolarAngleAxis dataKey="name" tick={{ fill: 'var(--foreground)', fontSize: 12, fontWeight: 500 }} tickSize={15}/>
            <PolarGrid />
            <Radar
              dataKey={dataKey}
              fill="var(--color-blue-300)"
              fillOpacity={0.6}
              dot={{
                r: 4,
                fillOpacity: 1,
              }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
