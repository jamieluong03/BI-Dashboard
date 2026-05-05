import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";

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
            <ChartContainer config={profitabilityConfig} className="min-h-[280px] h-[350px] w-full">
                <BarChart data={data} margin={{ top: 30, right: 0, left: 0, bottom: 0 }} barGap={8}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted/50" />
                    
                    <XAxis dataKey="channel" tickLine={false} axisLine={false} fontSize={11} fontWeight={600} tickMargin={12} className="fill-slate-500 uppercase" />
                    <YAxis tickLine={false} axisLine={false} fontSize={10} tickMargin={8} className="fill-slate-400" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                    
                    <ChartTooltip
                        cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
                        content={
                            <ChartTooltipContent 
                                hideLabel
                                indicator="dot"
                                formatter={(value, name) => [
                                    <span
                                        key={name}
                                        className="font-bold"
                                        style={{ color: name === "revenue" ? "#6366f1" : "#10b981" }}
                                    >
                                        ${Number(value).toLocaleString()}
                                    </span>,
                                ]}
                            />
                        }
                    />
                    <ChartLegend content={<ChartLegendContent />} className="mt-4" />
                    
                    <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} barSize={32}>
                        <LabelList 
                            dataKey="growth" 
                            position="top" 
                            content={(props: any) => {
                                const { x, y, width, value } = props;
                                if (value === undefined || value === null) return null;
                                
                                const isPositive = value > 0;
                                const color = isPositive ? "#10b981" : "#ef4444";

                                return (
                                    <text 
                                        x={x + width / 2} 
                                        y={y - 12} 
                                        fill={color} 
                                        textAnchor="middle" 
                                        fontSize={10} 
                                        fontWeight="bold"
                                    >
                                        {isPositive ? "↑" : "↓"} {Math.abs(value)}%
                                    </text>
                                );
                            }} 
                        />
                    </Bar>

                    <Bar dataKey="margin" fill="var(--color-margin)" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
            </ChartContainer>
        </div>
    );
}