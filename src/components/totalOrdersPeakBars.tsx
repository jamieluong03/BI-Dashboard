import { ChartConfig, ChartContainer } from "./ui/chart";
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, LabelList, CartesianGrid } from "recharts";

const surgeConfig = {
    avgOrders: {
        label: "Avg Orders",
        color: "#10b981",
    },
} satisfies ChartConfig;

type OrdersDistribution = {
    name: string;
    avgOrders: number;
    totalOrders: number;
};

type TotalOrdersPeaksProps = {
    data: OrdersDistribution[];
};

export function TotalOrdersPeaks({ data }: TotalOrdersPeaksProps) {
    return (
        <>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Orders Peak Activity
            </h3>
            <ChartContainer config={surgeConfig} className="">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 40, bottom: 25 }}
                    >
                        <CartesianGrid horizontal={false} strokeDasharray="3 3" className="stroke-muted/50" />
                        <XAxis
                            type="number"
                            tickLine={false}
                            fontSize={10}
                        />
                        <YAxis
                            dataKey="name"
                            type="category"
                            tickLine={false}
                            axisLine={true}
                            fontSize={10}
                            fontWeight={600}
                            width={40}
                            tickFormatter={(value) => {
                                const timeMap: Record<string, string> = {
                                    Morning: "Morning (6:00-11:59)",
                                    Afternoon: "Afternoon (12:00-17:59)",
                                    Evening: "Evening (18:00-23:59)",
                                    Night: "Night (0:00-5:59)",
                                };
                                return timeMap[value] || value;
                            }}
                        />
                        <Bar
                            dataKey="avgOrders"
                            fill="var(--color-avgOrders)"
                            barSize={24}
                        >
                            <LabelList
                                dataKey="avgOrders"
                                position="right"
                                offset={8}
                                className="fill-slate-400 font-bold"
                                fontSize={10}
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </ChartContainer>
        </>
    )
}