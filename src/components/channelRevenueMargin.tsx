import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { 
    ChartConfig, 
    ChartContainer, 
    ChartTooltip, 
    ChartTooltipContent, 
    ChartLegend, 
    ChartLegendContent 
} from "@/components/ui/chart";

const profitabilityConfig = {
    revenue: {
        label: "Gross Revenue",
        color: "#6366f1",
    },
    margin: {
        label: "Net Margin",
        color: "#10b981",
    },
} satisfies ChartConfig;

interface ProfitabilityChartProps {
    data: { channel: string; revenue: number; margin: number }[];
}

export function ProfitabilityChart({ data }: ProfitabilityChartProps) {
    
    return (
        <div className="h-full w-full">
            <ChartContainer config={profitabilityConfig} className="min-h-[180px] w-full">
                <BarChart
                    data={data}
                    margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                    barGap={8}
                    
                >
                    <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted/50" />
                    <XAxis
                        dataKey="channel"
                        tickLine={false}
                        axisLine={false}
                        fontSize={11}
                        fontWeight={600}
                        tickMargin={12}
                        className="fill-slate-500 uppercase"
                    />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        fontSize={10}
                        tickMargin={8}
                        className="fill-slate-400"
                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    />
                    <ChartTooltip
                        cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
                        content={
                            <ChartTooltipContent 
                                indicator="dot"
                                labelKey="channel"
                                formatter={(value) => [`$${Number(value).toLocaleString()}`, undefined]}
                            />
                        }
                    />
                    <ChartLegend content={<ChartLegendContent />} className="mt-4" />
                    
                    <Bar
                        dataKey="revenue"
                        fill="var(--color-revenue)"
                        radius={[4, 4, 0, 0]}
                        barSize={32}
                    />
                    <Bar
                        dataKey="margin"
                        fill="var(--color-margin)"
                        radius={[4, 4, 0, 0]}
                        barSize={32}
                    />
                </BarChart>
            </ChartContainer>
        </div>
    );
}