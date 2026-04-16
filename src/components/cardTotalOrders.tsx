import { useState, useMemo } from "react";
import { useSalesStats } from "@/hooks/views";
import {
    startOfMonth,
    endOfMonth,
    subYears,
    subMonths,
    format,
    getDate,
    parseISO
} from "date-fns";
import { lastOrderMonth } from "@/lib/utils";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const chartConfig = {
    current: {
        label: "Current Year",
        color: "#10b981",
    },
    previous: {
        label: "Previous Year",
        color: "#94a3b8",
    },
} satisfies ChartConfig;

export default function TotalOrdersCard() {

    const isDesktop = useMediaQuery("(min-width: 768px)");
    const [selectedDate, setSelectedDate] = useState<Date>(() => startOfMonth(lastOrderMonth));
    const monthOptions = useMemo(() => {
        return Array.from({ length: 12 }).map((_, i) => {
            const date = subMonths(startOfMonth(lastOrderMonth), i);
            return {
                label: format(date, "MMMM yyyy"),
                value: date.toISOString(),
            };
        });
    }, []);

    const currentStart = startOfMonth(selectedDate);
    const currentEnd = endOfMonth(selectedDate);
    const prevStart = subYears(currentStart, 1);
    const prevEnd = endOfMonth(prevStart);

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
            const curDay = currentOrders?.daily?.find((d: any) => getDate(parseISO(d.date)) === dayNum);
            const prevDay = previousOrders?.daily?.find((d: any) => getDate(parseISO(d.date)) === dayNum);

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
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col lg:min-h-[250px]">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
                    <div>
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                            Order Pacing Analysis
                        </h3>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-slate-900 tabular-nums">
                                {loadingCurrent ? "..." : (currentOrders?.totalOrders || 0).toLocaleString()}
                            </span>
                            <span className="text-xs font-semibold text-slate-400">
                                Total Orders
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-3 w-full sm:w-auto">
                        <Select
                            value={selectedDate.toISOString()}
                            onValueChange={(v) => setSelectedDate(new Date(v))}
                        >
                            <SelectTrigger className="h-8 w-full sm:w-[160px] text-xs font-bold bg-slate-50 border-none shadow-none focus:ring-0">
                                <SelectValue placeholder="Select month" />
                            </SelectTrigger>
                            <SelectContent>
                                {monthOptions.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value} className="text-xs">
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5">
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                <span className="text-[9px] font-bold text-slate-400 uppercase">{format(currentStart, 'yyyy')}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="h-1.5 w-1.5 rounded-full border border-dashed border-slate-400" />
                                <span className="text-[9px] font-bold text-slate-400 uppercase">{format(prevStart, 'yyyy')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full md:h-full h-[125px]">
                    {loadingCurrent || loadingPrev ? (
                        <Skeleton className="h-full w-full rounded-lg" />
                    ) : (
                        <ChartContainer config={chartConfig} className="h-full w-full aspect-[4/1]">
                            <LineChart
                                accessibilityLayer
                                data={pacingData}
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
                                    content={<ChartTooltipContent indicator="dot" />}
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
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 4 }}
                                />
                            </LineChart>
                        </ChartContainer>
                    )}
                </div>
            </div>
        </div>
    );
}