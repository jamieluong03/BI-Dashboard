"use client";

// import { TrendingUp } from "lucide-react";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis, BarRectangleItem, BarShapeProps, Rectangle } from "recharts";
import { RechartsDevtools } from '@recharts/devtools';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

type ChartData = {
    name: string;
    value: number;
};

const chartConfig = {
  desktop: {
    label: "Value",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

interface BarChartProps {
  dataKey: string;
  title: string | number;
  description: string;
  chartData: ChartData[];
};

const MyCustomShape = (props: BarShapeProps) => {
  const [isActive, setIsActive] = useState(false);
  const handleMouseClick = () => {
    setIsActive(curr => !curr);
  };
  const fill = isActive ? 'var(--color-blue-500)' : 'var(--color-blue-300)';
  return <Rectangle {...props} onClick={handleMouseClick} fill={fill} />;
};

export function ChartBarLabelCustom({ dataKey, title, description, chartData }: BarChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              right: 16,
            }}
            responsive
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
              hide
            />
            <XAxis dataKey={dataKey} type="number" hide />
            <Bar 
                dataKey={dataKey} 
                fill="var(--color-blue-300)" 
                radius={4}
                onClick={(bri: BarRectangleItem, index, event) => {
                    console.log('clicked on', bri, index, event);
                }}
                shape={MyCustomShape}
            >
              <LabelList
                dataKey="name"
                position="insideLeft"
                offset={8}
                className="fill-(--color-label)"
                fontSize={12}
              />
              <LabelList
                dataKey={dataKey}
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
              <RechartsDevtools />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
  )
}
