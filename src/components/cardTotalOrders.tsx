import { useMemo } from "react";
import { useSalesStats } from "@/hooks/views";
import { 
    startOfMonth, 
    endOfMonth, 
    subYears, 
    format, 
    getDate, 
    parseISO 
} from "date-fns";
import { lastOrderMonth } from "@/lib/utils";
import { CartesianGrid, Line, LineChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { 
    ChartConfig, 
    ChartContainer, 
    ChartTooltip, 
    ChartTooltipContent 
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

const chartConfig = {
  current: {
    label: "Current Year",
    color: "hsl(var(--chart-1))",
  },
  previous: {
    label: "Previous Year",
    color: "hsl(var(--muted-foreground))",
  },
} satisfies ChartConfig;

export default function TotalOrdersCard() {
    const currentStart = useMemo(() => startOfMonth(lastOrderMonth), []);
    const currentEnd = useMemo(() => endOfMonth(lastOrderMonth), []);
    
    const prevStart = useMemo(() => subYears(currentStart, 1), [currentStart]);
    const prevEnd = useMemo(() => endOfMonth(prevStart), [prevStart]);

    const { orders: currentOrders, isLoading: loadingCurrent } = useSalesStats(
        format(currentStart, "yyyy-MM-dd"),
        format(currentEnd, "yyyy-MM-dd")
    );

    const { orders: previousOrders, isLoading: loadingPrev } = useSalesStats(
        format(prevStart, "yyyy-MM-dd"),
        format(prevEnd, "yyyy-MM-dd")
    );

    const pacingData = useMemo(() => {
        if (!currentOrders?.daily && !previousOrders?.daily) return [];

        return Array.from({ length: 31 }, (_, i) => {
            const dayNum = i + 1;

            const curDay = currentOrders?.daily?.find(
                (d: any) => getDate(parseISO(d.date)) === dayNum
            );
            const prevDay = previousOrders?.daily?.find(
                (d: any) => getDate(parseISO(d.date)) === dayNum
            );

            return {
                day: dayNum,
                current: curDay?.totalOrders ?? curDay?.totalOrders ?? 0,
                previous: prevDay?.totalOrders ?? prevDay?.totalOrders ?? 0,
            };
        });
    }, [currentOrders, previousOrders]);

    if (loadingCurrent || loadingPrev) {
        return <div className="p-6 space-y-4"><Skeleton className="h-[300px] w-full rounded-xl" /></div>;
    }

    return (
        <div className="w-full space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-auto lg:h-[420px]">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                            Order Pacing
                        </h3>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-slate-900">
                                {(currentOrders?.totalOrders || 0).toLocaleString()}
                            </span>
                            <span className="text-xs font-semibold text-emerald-600">
                                vs Last Year
                            </span>
                        </div>
                    </div>
                    
                    {/* Legend */}
                    <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2">
                            <div className="h-0.5 w-3 bg-[hsl(var(--chart-1))]" />
                            <span className="text-[9px] font-bold text-slate-400 uppercase">{format(currentStart, 'yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-0.5 w-3 border-t border-dashed border-slate-300" />
                            <span className="text-[9px] font-bold text-slate-400 uppercase">{format(prevStart, 'yyyy')}</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 w-full">
                    <ChartContainer config={chartConfig} className="h-full w-full">
                        <LineChart
                            accessibilityLayer
                            data={pacingData}
                            margin={{ top: 5, left: 12, right: 12, bottom: 5 }}
                        >
                            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted/50" />
                            
                            <XAxis
                                dataKey="day"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={12}
                                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                                interval={4} 
                                tickFormatter={(value) => `Day ${value}`}
                            />

                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tickMargin={12}
                                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                                tickFormatter={(value) => value.toLocaleString()}
                            />

                            <ChartTooltip
                                cursor={{ stroke: "hsl(var(--muted))", strokeWidth: 1 }}
                                content={<ChartTooltipContent indicator="dot" />}
                            />

                            {/* Previous Year */}
                            <Line
                                dataKey="previous"
                                type="monotone"
                                stroke="var(--color-previous)"
                                strokeWidth={2}
                                strokeDasharray="4 4"
                                dot={false}
                            />

                            {/* Current Year */}
                            <Line
                                dataKey="current"
                                type="monotone"
                                stroke="var(--color-current)"
                                strokeWidth={2.5}
                                dot={false}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ChartContainer>
                </div>
            </div>
        </div>
    );
}