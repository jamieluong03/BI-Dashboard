import { 
  Area, 
  AreaChart, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  ResponsiveContainer 
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const efficiencyChartConfig = {
  margin: {
    label: "Net Margin",
    color: "#10b981", // Emerald 500
  },
} satisfies ChartConfig;

interface EfficiencyChartProps {
  data: { date: string; margin: number }[];
}

export function NetProfitEfficiencyChart({ data }: EfficiencyChartProps) {
  return (
    <div className="h-[200px] w-full">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
        Margin Efficiency Trend (%)
      </p>
      
      <ChartContainer config={efficiencyChartConfig} className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="fillMargin" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-margin)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-margin)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
            
            {/* We keep X and Y Axis minimal/hidden for the "Sparkline" feel */}
            <XAxis dataKey="date" hide />
            <YAxis hide domain={[0, 'auto']} />

            <ChartTooltip
              cursor={{ stroke: "#e2e8f0", strokeWidth: 1 }}
              content={
                <ChartTooltipContent
                  hideLabel
                  // formatter handles the value safely for TypeScript
                  formatter={(value) => (
                    <div className="flex items-center gap-1.5 font-medium">
                      <span className="text-slate-900 font-bold">
                        {Number(value).toFixed(1)}%
                      </span>
                      <span className="text-slate-500 text-[10px] uppercase tracking-wider">
                        Net Margin
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Area
              dataKey="margin"
              type="monotone"
              fill="url(#fillMargin)"
              fillOpacity={0.4}
              stroke="var(--color-margin)"
              strokeWidth={2}
              stackId="a"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}