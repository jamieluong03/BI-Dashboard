import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from "recharts";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

const momentumConfig = {
    positive: {
        label: "Growth",
        color: "#06b6d4",
    },
    negative: {
        label: "Decline",
        color: "#f43f5e",
    },
} satisfies ChartConfig;

interface DataPoint {
    region: string;
    growthIndex: number;
}

export function RegionalMomentumChart({ data }: { data: DataPoint[] }) {
    const chartData = useMemo(() => {
        return [...data]
            .sort((a, b) => b.growthIndex - a.growthIndex)
            .map((item) => ({
                ...item,
                positive: item.growthIndex > 0 ? item.growthIndex : 0,
                negative: item.growthIndex < 0 ? item.growthIndex : 0,
            }));
    }, [data]);

    return (
        <ChartContainer config={momentumConfig} className="h-full w-full">
            <BarChart
                data={chartData}
                layout="vertical"
                margin={{ left: 30, right: 30, top: 0, bottom: 0 }}
                stackOffset="sign"
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

                <XAxis type="number" hide domain={['dataMin - 10', 'dataMax + 10']} />

                <ReferenceLine x={0} stroke="#cbd5e1" strokeWidth={2} />

                <ChartTooltip
                    cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
                    content={
                        <ChartTooltipContent
                            hideLabel
                            className="w-[180px]"
                            formatter={(value, name) => (
                                <div className="flex w-full items-center justify-between">
                                    <span className="text-slate-500 font-medium">
                                        {name === "positive" ? "Growth" : "Decline"}
                                    </span>
                                    <span className={`font-bold tabular-nums ${name === "positive" ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {name === "positive" ? '+' : ''}{value}%
                                    </span>
                                </div>
                            )}
                        />
                    }
                />

                <Bar
                    dataKey="positive"
                    fill="var(--color-positive)"
                    stackId="stack"
                    barSize={20}
                    radius={[0, 4, 4, 0]}
                />
                <Bar
                    dataKey="negative"
                    fill="var(--color-negative)"
                    stackId="stack"
                    barSize={20}
                    radius={[4, 0, 0, 4]}
                />
            </BarChart>
        </ChartContainer>
    );
}