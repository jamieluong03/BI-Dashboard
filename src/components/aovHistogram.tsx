import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList } from "recharts";

const bucketConfig = {
    value: {
        label: "Orders",
        color: "#6366f1", // Indigo 500
    },
} satisfies ChartConfig;

type AovHistogramProps = {
    data: {
        range: string;
        value: number;
        key: string;
    }[];
};

export default function AovHistogram({ data }: AovHistogramProps) {

    const mostCommonBucket = [...data].sort((a, b) => b.value - a.value)[0]?.range;

    return (
        <>
            <ChartContainer config={bucketConfig} className="h-full w-full">

                <BarChart
                    data={data}
                    margin={{ top: 20, right: 0, left: 0, bottom: 20 }}
                    barGap={0}
                >
                    <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted/50" />
                    <XAxis
                        dataKey="range"
                        tickLine={false}
                        axisLine={false}
                        fontSize={10}
                        fontWeight={600}
                        tickMargin={10}
                        tick={{ fill: "hsl(var(--muted-foreground))" }}
                    />
                    <YAxis hide />
                    <ChartTooltip
                        cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
                        content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar
                        dataKey="value"
                        fill="var(--color-value)"
                        radius={[4, 4, 0, 0]}
                        barSize={40}
                    >
                        <LabelList
                            dataKey="value"
                            position="top"
                            offset={8}
                            className="fill-slate-500 font-bold"
                            fontSize={10}
                        />
                    </Bar>
                </BarChart>
            </ChartContainer>
            <p className="text-[10px] text-slate-400 m-2 italic">
                * Most customers spend in the {mostCommonBucket} range.
            </p>
        </>
    )
}