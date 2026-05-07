import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";

const purchaseAttributionConfig = {
    new: {
        label: "New Orders",
        color: "#6366f1",
    },
    returning: {
        label: "Returning",
        color: "#10b981",
    },
} satisfies ChartConfig;

interface PurchaseAttributionProps {
    data: { channel: string; new: number; returning: number }[];
}

export function PurchaseAttributionChart({ data }: PurchaseAttributionProps) {

    const sortedData = [...data].sort((a, b) => b.new - a.new);

    return (
        <ChartContainer config={purchaseAttributionConfig} className="h-full w-full">
            <BarChart
                data={sortedData}
                layout="vertical"
                margin={{ left: 30, right: 40, top: 0, bottom: 0 }}
                stackOffset="expand"
            >
                <CartesianGrid horizontal={false} strokeDasharray="3 3" className="stroke-muted/50" />
                
                <YAxis
                    dataKey="channel"
                    type="category"
                    tickLine={false}
                    axisLine={true}
                    fontSize={11}
                    fontWeight={600}
                    className="fill-slate-500 uppercase"
                    width={90}
                />
                
                <XAxis type="number" hide />

                <ChartTooltip
                    cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
                    content={
                        <ChartTooltipContent
                            hideLabel
                            indicator="dot"
                            labelFormatter={(value) => value}
                            formatter={(value, name) => (
                                <div className="flex w-full items-center justify-between">
                                    <span className="text-slate-500 font-medium">
                                        {name === "new" ? "New Orders" : "Returning"}
                                    </span>
                                        {Number(value).toLocaleString()}
                                </div>
                            )}
                        />
                    }
                />

                <Bar 
                    dataKey="new" 
                    stackId="a" 
                    fill="var(--color-new)" 
                    radius={[0, 0, 0, 0]} 
                    barSize={24} 
                />
                <Bar 
                    dataKey="returning" 
                    stackId="a" 
                    fill="var(--color-returning)" 
                    radius={[0, 4, 4, 0]} 
                    barSize={24} 
                />
                <ChartLegend content={<ChartLegendContent />} />
            </BarChart>
        </ChartContainer>
    );
}