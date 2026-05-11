import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart";

const contributionConfig = {
    orders: {
        label: "Order Volume",
        color: "#94a3b8",
    },
    revenue: {
        label: "Total Revenue",
        color: "#6366f1",
    },
} satisfies ChartConfig;

interface DataPoint {
    region: string;
    revenue: number;
    orders: number;
}

export function RegionalContributionChart({ data }: { data: DataPoint[] }) {
    console.log("Data for Regional Contribution Chart:", data);
    const sortedData = [...data].sort((a, b) => b.revenue - a.revenue);

    return (
        <ChartContainer config={contributionConfig} className="min-h-[280px] h-[300px] w-full">
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

                <XAxis type="number" hide xAxisId="left" />
                <XAxis type="number" hide xAxisId="right" />

                <ChartTooltip
                    cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
                    content={
                        <ChartTooltipContent
                            hideLabel
                            indicator="dot"
                            className="w-[200px]"
                            formatter={(value, name) => (
                                <div className="flex w-full items-center justify-between">
                                    <span className="text-slate-500 font-medium lowercase first-letter:uppercase">
                                        {name === "revenue" ? "Revenue" : "Total Orders"}
                                    </span>
                                    <span className="font-bold text-slate-900 ml-auto tabular-nums">
                                        {name === "revenue"
                                            ? `$${Number(value).toLocaleString()}`
                                            : Number(value).toLocaleString()
                                        }
                                    </span>
                                </div>
                            )}
                        />
                    }
                />

                <Bar
                    xAxisId="left"
                    dataKey="revenue"
                    fill="var(--color-revenue)"
                    radius={[0, 4, 4, 0]}
                    barSize={12}
                />
                <Bar
                    xAxisId="right"
                    dataKey="orders"
                    fill="var(--color-orders)"
                    radius={[0, 4, 4, 0]}
                    barSize={12}
                />

                <ChartLegend content={<ChartLegendContent />} className="mt-4" />
            </BarChart>
        </ChartContainer>
    );
}