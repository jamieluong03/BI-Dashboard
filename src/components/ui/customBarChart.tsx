"use client";

import { useState, useMemo } from "react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis, Rectangle } from "recharts";
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
  type ChartConfig,
} from "@/components/ui/chart";

type ChartData = {
  name: string;
  [key: string]: string | number;
};

const chartConfig = {
  value: {
    label: "Selected Total",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

interface BarChartProps {
  dataKey: string;
  title: string | number;
  description: string;
  chartData: ChartData[];
};

export function ChartBarLabelCustom({ dataKey, title, description, chartData }: BarChartProps) {
  const [selectedNames, setSelectedNames] = useState<string[]>([]);

  const handleBarClick = (data: any) => {
    if (!data) return;
    const name = data.name;
    setSelectedNames((prev) =>
      prev.includes(name) 
        ? prev.filter((n) => n !== name) 
        : [...prev, name]
    );
  };

  const totalSelected = useMemo(() => {
    return chartData
      .filter((item) => selectedNames.includes(item.name))
      .reduce((sum, item) => sum + (Number(item[dataKey]) || 0), 0);
  }, [selectedNames, chartData, dataKey]);

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Total Orders</p>
          <p className="text-2xl font-black text-blue-600">
            {totalSelected.toLocaleString()}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ left: 0, right: 30 }}
          >
            <CartesianGrid horizontal={false} strokeDasharray="3 3" opacity={0.3} />
            <YAxis dataKey="name" type="category" hide />
            <XAxis dataKey={dataKey} type="number" hide />
            
            <Bar 
              dataKey={dataKey} 
              radius={4}
              cursor="pointer"
              onClick={handleBarClick}
              shape={(props: any) => {
                const { x, y, width, height, name } = props;
                const isActive = selectedNames.includes(name);
                return (
                  <Rectangle
                    {...props}
                    fill={isActive ? 'var(--color-blue-500)' : 'var(--color-blue-300)'}
                    className="transition-all duration-300 hover:opacity-80"
                  />
                );
              }}
              isAnimationActive={false}
            >
              <LabelList
                dataKey="name"
                position="insideLeft"
                offset={8}
                className="fill-black font-semibold"
                fontSize={10}
              />
              <LabelList
                dataKey={dataKey}
                position="right"
                offset={10}
                className="fill-foreground font-bold"
                fontSize={10}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        
      </CardFooter>
    </Card>
  );
}