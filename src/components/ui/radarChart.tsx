"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
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

export function ChartRadarDots({ title, description, dataKey, comment, chartData, Icon, iconColor }: ChartProps) {

  return (
    <Card className="relative overflow-hidden h-full">
      <CardHeader className="items-center">
        <CardTitle className="text-slate-700 font-medium">{title}</CardTitle>
        <CardAction>
          <div className="">
            {Icon && (
              <Icon className={`aspect-square w-3 ${iconColor}"}`} />
            )}
          </div>
        </CardAction>
      </CardHeader>
      <CardContent>
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
        <CardDescription className="mt-1 text-xs">
          {comment}
        </CardDescription>
      </CardContent>
    </Card>
  )
}
