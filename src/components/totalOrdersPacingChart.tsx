import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useMemo } from "react";
import { format } from "date-fns";

const chartConfig = {
    day: {
        label: "Day",
    },
    current: {
        label: "Current Year",
        color: "#10b981",
    },
    previous: {
        label: "Previous Year",
        color: "#94a3b8",
    },
    target: {
        label: "Monthly Target",
        color: "#d00e0e",
    },
} satisfies ChartConfig;

type PacingData = {
    day: number;
    current: number;
    previous: number;
};

type TotalOrdersPacingChartProps = {
    data: PacingData[];
    selectedDate: Date;
};

export function TotalOrdersChart({ data, selectedDate }: TotalOrdersPacingChartProps) {

    const isDesktop = useMediaQuery("(min-width: 768px)");
    const targetValue = useMemo(() => {
        return data.map((d) => ({
            ...d,
            target: d.previous > 0 ? Math.round(d.previous * 1.15) : 0,
        }));
    }, [data]);
    const monthName = format(selectedDate, "MMMM");

    return (
        <>
            <ChartContainer config={chartConfig} className="h-full w-full aspect-[4/1]">
                <LineChart
                    accessibilityLayer
                    data={targetValue}
                    margin={{ top: 20, left: -10, right: 10, bottom: 20 }}
                >
                    <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted/50" />
                    <XAxis
                        dataKey="day"
                        tickLine={false}
                        axisLine={true}
                        tickMargin={8}
                        tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
                        interval={isDesktop ? 4 : 6}
                        tickFormatter={(v) => v.toLocaleString()}
                        label={{
                            value: "Day of Month",
                            position: "insideBottom",
                            offset: -15,
                            fontSize: 11,
                            fill: "hsl(var(--muted-foreground))",
                            fontWeight: 500
                        }}
                    />
                    <YAxis
                        tickLine={false}
                        axisLine={true}
                        tickMargin={8}
                        tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
                        tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}
                        label={{
                            value: "Number of Orders",
                            angle: -90,
                            position: "insideLeft",
                            offset: 20,
                            dy: 50,
                            fontSize: 11,
                            fill: "hsl(var(--muted-foreground))",
                            fontWeight: 500
                        }}
                    />
                    <ChartTooltip
                        cursor={{ stroke: "hsl(var(--muted))", strokeWidth: 1 }}
                        content={<ChartTooltipContent indicator="dot" labelKey="day"
                            labelFormatter={(value, payload) => {
                                const day = payload?.[0]?.payload?.day || value;
                                return `${monthName} ${day}`;
                            }}
                        />}
                    />
                    <Line
                        dataKey="previous"
                        type="monotone"
                        stroke="var(--color-previous)"
                        strokeWidth={1.5}
                        strokeDasharray="4 4"
                        dot={false}
                    />
                    <Line
                        dataKey="target"
                        type="monotone"
                        stroke="var(--color-target)"
                        strokeWidth={1.5}
                        strokeDasharray="2 2"
                        dot={false}
                        opacity={0.6}
                    />
                    <Line
                        dataKey="current"
                        type="monotone"
                        stroke="var(--color-current)"
                        strokeWidth={2.5}
                        dot={false}
                        activeDot={{ r: 4 }}
                    />
                </LineChart>
            </ChartContainer>
        </>
    )
}