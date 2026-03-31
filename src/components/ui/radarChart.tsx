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
  desktop: {
    label: "Value",
    color: "var(--color-blue-300)",
  },
} satisfies ChartConfig

export function ChartRadarDots({ title, description, dataKey, chartData }: ChartProps) {
  console.log("passed chartData", chartData);
  return (
    <Card>
      <CardHeader className="items-center">
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="name" />
            <PolarGrid />
            <Radar
              dataKey="value"
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
