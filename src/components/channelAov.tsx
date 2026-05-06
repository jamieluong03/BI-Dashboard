import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const aovChannelConfig = {
    aov: { label: "AOV" },
    email: { label: "email", color: "#6366f1" },
    meta: { label: "Meta", color: "#f59e0b" },
    tiktok: { label: "TikTok", color: "#10b981" },
    organic: { label: "Organic", color: "#ec4899" },
    google: { label: "Google", color: "#3b82f6" },
} satisfies ChartConfig;

interface AovByChannelProps {
    data: { channel: string; aov: number }[];
}

export function AovByChannelChart({ data }: AovByChannelProps) {
    const chartData = data.map((item) => ({
        ...item,
        fill: `var(--color-${item.channel.toLowerCase()})`,
    })).sort((a, b) => b.aov - a.aov);
    console.log("AOV Chart Data:", chartData);

    return (
        <ChartContainer config={aovChannelConfig} className="h-full w-full">
            <BarChart
                data={chartData}
                layout="vertical"
                margin={{ left: 20, right: 20, top: 0, bottom: 20 }}
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
                    width={80}
                />

                <XAxis type="number" />

                <ChartTooltip
                    cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
                    content={
                        <ChartTooltipContent
                            hideLabel
                            indicator="dot"
                            formatter={(value) => (
                                `$${Number(value).toLocaleString()}`
                            )}
                        />
                    }
                />

                <Bar
                    dataKey="aov"
                    radius={[0, 4, 4, 0]}
                    barSize={20}
                />
            </BarChart>
        </ChartContainer>
    );
}