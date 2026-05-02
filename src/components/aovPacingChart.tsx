import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { format } from "date-fns";

const aovConfig = {
    current: { label: "Current AOV", color: "#6366f1" },
    previous: { label: "Prev Year AOV", color: "#94a3b8" },
    upt: { label: "Items per Order", color: "#8b5cf6" },
    buckets: { label: "Orders", color: "#6366f1" }
} satisfies ChartConfig;

type AovPacingChartProps = {
    data: {
        day: number;
        current: number;
        previous: number;
    }[];
};

interface AovDateProp {
    selectedDate: Date;
}

export default function AovPacingChart({ data, selectedDate }: AovPacingChartProps & AovDateProp) {

    const isDesktop = useMediaQuery("(min-width: 768px)");
    const monthName = format(selectedDate, "MMMM");

    return (
        <>
            <ChartContainer config={aovConfig} className="h-full w-full aspect-[4/1]">
                <LineChart
                    accessibilityLayer
                    data={data}
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
                        tickFormatter={(v) => `$${v.toFixed(0)}`}
                    />

                    <ChartTooltip
                        cursor={{ stroke: "hsl(var(--muted))", strokeWidth: 1 }}
                        content={
                            <ChartTooltipContent
                                indicator="dot"
                                labelKey="day"
                                formatter={(value) => [`$${Number(value).toFixed(2)}`, undefined]}
                                labelFormatter={(value, payload) => {
                                    const day = payload?.[0]?.payload?.day || value;
                                    return `${monthName} ${day}`;
                                }}
                            />
                        }
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
};