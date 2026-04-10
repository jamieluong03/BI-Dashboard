import { useState, useMemo } from "react";
import { useSalesStats } from "@/hooks/views";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
    startOfMonth, endOfMonth,
    startOfQuarter, endOfQuarter,
    startOfYear, endOfYear,
    format, subMonths, subQuarters, subYears
} from "date-fns";
import { lastOrderDate } from "@/lib/utils";
import { type ChartConfig } from "@/components/ui/chart";
import { NetProfitWaterfall } from "@/components/netProfitWaterfall";
import { NetProfitEfficiencyChart } from "@/components/netProfitEffiencyChart";
import { InfoTooltip } from "./infoToolTip";
import { NetProfitVarianceTable } from "@/components/netProfitVarianceTable";

type ViewType = "month" | "quarter" | "year";

const CHART_CONFIG = {
    revenue: { label: "Revenue", color: "#3b82f6" },
    cogs: { label: "COGS", color: "#f43f5e" },
    shipping: { label: "Shipping", color: "#fb923c" },
    ads: { label: "Ad Spend", color: "#f59e0b" },
    refunds: { label: "Refunds", color: "#94a3b8" },
    profit: { label: "Net Profit", color: "#10b981" },
} satisfies ChartConfig;

const businessTargets = { floor: 15, ceiling: 35 };

export default function CardNetProfit() {
    const [view, setView] = useState<ViewType>("month");
    const [referenceDate, setReferenceDate] = useState<Date>(() => startOfMonth(lastOrderDate));

    const { dateRange, prevDateRange } = useMemo(() => {
        const map = {
            month: { start: startOfMonth(referenceDate), end: endOfMonth(referenceDate), prev: subMonths(referenceDate, 1) },
            quarter: { start: startOfQuarter(referenceDate), end: endOfQuarter(referenceDate), prev: subQuarters(referenceDate, 1) },
            year: { start: startOfYear(referenceDate), end: endOfYear(referenceDate), prev: subYears(referenceDate, 1) },
        };
        const current = map[view];
        const previous = {
            month: { start: startOfMonth(current.prev), end: endOfMonth(current.prev) },
            quarter: { start: startOfQuarter(current.prev), end: endOfQuarter(current.prev) },
            year: { start: startOfYear(current.prev), end: endOfYear(current.prev) },
        }[view];

        return {
            dateRange: {
                startStr: format(current.start, "yyyy-MM-dd"),
                endStr: format(current.end, "yyyy-MM-dd"),
                formatted: `${format(current.start, "MMM d")} - ${format(current.end, "MMM d, yyyy")}`
            },
            prevDateRange: {
                startStr: format(previous.start, "yyyy-MM-dd"),
                endStr: format(previous.end, "yyyy-MM-dd"),
            }
        };
    }, [view, referenceDate]);

    const { orders, isLoading, isError } = useSalesStats(dateRange.startStr, dateRange.endStr);
    const { orders: previousOrders } = useSalesStats(prevDateRange.startStr, prevDateRange.endStr);

    const waterfallData = useMemo(() => {
        if (!orders) return [];
        const steps = [
            { name: "Revenue", value: orders.totalRevenue, key: "revenue" },
            { name: "COGS", value: -orders.totalCost, key: "cogs" },
            { name: "Shipping", value: -orders.totalShipping, key: "shipping" },
            { name: "Ads", value: -orders.totalAdSpend, key: "ads" },
            { name: "Refunds", value: -(orders.totalRefunds || 0), key: "refunds" },
            { name: "Net Profit", value: orders.netProfit, key: "profit", isTotal: true },
        ];
        let acc = 0;
        return steps.map((s) => {
            const low = s.isTotal ? 0 : (s.value >= 0 ? acc : acc + s.value);
            const high = s.isTotal ? s.value : (s.value >= 0 ? acc + s.value : acc);
            if (!s.isTotal) acc += s.value;
            return { name: s.name, displayValue: s.value, waterfallRange: [low, high], configKey: s.key };
        });
    }, [orders]);

    return (
        <div className="w-full max-w-[1600px] mx-auto space-y-6 pt-2 pb-10">
            <div className="flex flex-col gap-4">
                <Tabs value={view} onValueChange={(v) => setView(v as ViewType)}>
                    <TabsList className="grid w-full grid-cols-3 h-11 bg-slate-100/50">
                        <TabsTrigger value="month">Month</TabsTrigger>
                        <TabsTrigger value="quarter">Quarter</TabsTrigger>
                        <TabsTrigger value="year">Year</TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="flex flex-wrap items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100 gap-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        Analysis Period
                        <span className="text-[10px] text-slate-400 tabular-nums ml-2">
                            {dateRange.formatted}
                        </span>
                    </span>
                    <PeriodPicker view={view} value={referenceDate} onChange={setReferenceDate} />
                </div>
            </div>

            <div className="w-full">
                {isLoading ? (
                    <NetProfitLoadingSkeleton />
                ) : isError ? (
                    <div className="flex h-64 items-center justify-center text-red-500 text-sm bg-red-50 rounded-2xl border border-red-100">
                        Error fetching data for this range.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm min-h-[350px] lg:h-[420px] flex flex-col">
                            <div className="flex items-center gap-1 mb-6">
                                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Profit Waterfall</h3>
                                <InfoTooltip display comment="Waterfall analysis breaking down Revenue into Net Profit." />
                            </div>
                            <div className="flex-1 w-full px-2">
                                <NetProfitWaterfall data={waterfallData} config={CHART_CONFIG} />
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm min-h-[350px] lg:h-[420px] flex flex-col overflow-hidden">
                            <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-white">
                                <div className="flex items-center gap-1">
                                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Period Variance</h3>
                                    <InfoTooltip display comment="Compares performance against previous equivalent period." />
                                </div>
                                <span className="text-[10px] text-slate-400 italic font-medium pr-1">Vs. Last {view}</span>
                            </div>
                            <div className="flex-1">
                                <NetProfitVarianceTable
                                    currentStats={orders}
                                    previousStats={previousOrders}
                                    isLoading={isLoading}
                                />
                            </div>
                        </div>

                        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm min-h-[300px] lg:h-[400px] flex flex-col">
                            <div className="flex items-center gap-1 mb-6">
                                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Efficiency Trend (%)</h3>
                                <InfoTooltip display={true} comment="Tracks daily Net Margin %. Measures how many cents of every dollar you kept as profit." />
                            </div>
                            <div className="flex-1 w-full">
                                <NetProfitEfficiencyChart
                                    data={orders?.daily || []}
                                    floor={businessTargets.floor}
                                    ceiling={businessTargets.ceiling}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function NetProfitLoadingSkeleton() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-[420px] w-full rounded-2xl" />
            <Skeleton className="h-[420px] w-full rounded-2xl" />
            <Skeleton className="lg:col-span-2 h-[400px] w-full rounded-2xl" />
        </div>
    );
}

function PeriodPicker({ view, value, onChange }: { view: ViewType, value: Date, onChange: (d: Date) => void }) {
    const options = useMemo(() => {
        const pickerMap = {
            month: () => Array.from({ length: 12 }).map((_, i) => ({ label: format(subMonths(lastOrderDate, i), "MMM yyyy"), val: subMonths(startOfMonth(lastOrderDate), i).toISOString() })),
            quarter: () => Array.from({ length: 8 }).map((_, i) => { const d = subQuarters(startOfQuarter(lastOrderDate), i); return { label: `Q${Math.floor(d.getMonth() / 3) + 1} ${d.getFullYear()}`, val: d.toISOString() }; }),
            year: () => Array.from({ length: 4 }).map((_, i) => { const d = subYears(startOfYear(lastOrderDate), i); return { label: d.getFullYear().toString(), val: d.toISOString() }; })
        };
        return pickerMap[view]();
    }, [view]);

    return (
        <Select value={value.toISOString()} onValueChange={(v) => onChange(new Date(v))}>
            <SelectTrigger className="h-9 w-[150px] text-xs font-bold bg-white border-slate-200">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {options.map((opt) => (
                    <SelectItem key={opt.val} value={opt.val} className="text-xs">{opt.label}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}