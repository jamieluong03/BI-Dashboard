import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

const efficiencyConfig = {
  revenue: {
    label: "Total Revenue",
    color: "#6366f1",
  },
  shippingCost: {
    label: "Shipping Paid",
    color: "#f59e0b",
  },
} satisfies ChartConfig;

interface DataPoint {
  region: string;
  revenue: number;
  shippingCost: number;
}

export function RegionalEfficiencyChart({ data }: { data: DataPoint[] }) {
    console.log("Logistics Chart Data:", data);
  const sortedData = [...data].sort((a, b) => b.revenue - a.revenue);

  return (
    <ChartContainer config={efficiencyConfig} className="h-full w-full">
      <BarChart
        data={sortedData}
        layout="vertical"
        margin={{ left: 20, right: 20, top: 0, bottom: 0 }}
        barGap={2}
      >
        <CartesianGrid horizontal={false} strokeDasharray="3 3" className="stroke-muted/50" />
        
        <YAxis
          dataKey="region"
          type="category"
          tickLine={false}
          axisLine={false}
          fontSize={11}
          fontWeight={600}
          className="fill-slate-500 uppercase"
          width={100}
        />

        <XAxis type="number" hide />

        <ChartTooltip
          cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
          content={
            <ChartTooltipContent
              hideLabel
              className="w-[220px]"
              formatter={(value, name, item) => {
                const { revenue, shippingCost } = item.payload;
                const ratio = ((shippingCost / revenue) * 100).toFixed(1);

                return (
                  <div className="flex flex-col w-full gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium lowercase first-letter:uppercase">
                        {name === "revenue" ? "Revenue" : "Shipping Cost"}
                      </span>
                      <span className="font-bold text-slate-900 tabular-nums">
                        ${Number(value).toLocaleString()}
                      </span>
                    </div>
                    {name === "shippingCost" && (
                      <div className="mt-1 pt-1 border-t border-slate-100 flex justify-between items-center">
                        <span className="text-amber-600 text-[10px] font-bold">Shipping % of Rev</span>
                        <span className="text-amber-700 font-bold">{ratio}%</span>
                      </div>
                    )}
                  </div>
                );
              }}
            />
          }
        />
        <Bar 
          dataKey="revenue" 
          fill="var(--color-revenue)" 
          radius={[0, 4, 4, 0]} 
          barSize={12} 
        />
        <Bar 
          dataKey="shippingCost" 
          fill="var(--color-shippingCost)" 
          radius={[0, 4, 4, 0]} 
          barSize={12} 
        />
        <ChartLegend content={<ChartLegendContent />} className="mt-4" />
      </BarChart>
    </ChartContainer>
  );
}