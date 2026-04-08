import { 
    ChartContainer, 
    ChartTooltip, 
    ChartTooltipContent,
    type ChartConfig 
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";

interface WaterfallProps {
  data: any[];
  config: ChartConfig;
}

export function NetProfitWaterfall({ data, config }: WaterfallProps) {
  return (
    <ChartContainer config={config} className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 10, left: 10, bottom: 20 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 10 }}
            tickFormatter={(val) => `$${Intl.NumberFormat('en', { notation: 'compact' }).format(val)}`}
          />
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          
          <Bar dataKey="base" stackId="a" fill="transparent" />
          <Bar 
            dataKey="displayValue" 
            stackId="a" 
            radius={[4, 4, 0, 0]} 
            isAnimationActive={true}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}