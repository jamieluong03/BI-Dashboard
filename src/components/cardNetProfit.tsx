import { useState, useMemo } from "react";
import { useSalesStats } from "@/hooks/views";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    startOfMonth, endOfMonth,
    startOfQuarter, endOfQuarter,
    startOfYear, endOfYear,
    format, subMonths
} from "date-fns";
import { lastOrderDate } from "@/lib/utils";
import { type ChartConfig } from "@/components/ui/chart";
import { NetProfitWaterfall } from "@/components/netProfitWaterfall";
import { NetProfitEfficiencyChart } from "@/components/netProfitEffiencyChart";
import { InfoTooltip } from "./infoToolTip";

type ViewType = "month" | "quarter" | "year";

const chartConfig = {
    revenue: { label: "Revenue", color: "#3b82f6" },
    cogs: { label: "COGS", color: "#f43f5e" },
    shipping: { label: "Shipping", color: "#fb923c" },
    ads: { label: "Ad Spend", color: "#f59e0b" },
    refunds: { label: "Refunds", color: "#94a3b8" },
    profit: { label: "Net Profit", color: "#10b981" },
} satisfies ChartConfig;

export default function CardNetProfit() {
    const [view, setView] = useState<ViewType>("month");

    const [selectedMonth, setSelectedMonth] = useState<Date>(() => startOfMonth(lastOrderDate));
    const [selectedQuarter, setSelectedQuarter] = useState<Date>(() => startOfQuarter(lastOrderDate));
    const [selectedYear, setSelectedYear] = useState<number>(lastOrderDate.getFullYear());

    const dateRange = useMemo(() => {
        let start: Date;
        let end: Date;

        if (view === "month") {
            start = startOfMonth(selectedMonth);
            end = endOfMonth(selectedMonth);
        } else if (view === "quarter") {
            start = startOfQuarter(selectedQuarter);
            end = endOfQuarter(selectedQuarter);
        } else {
            const yearDate = new Date(selectedYear, 0, 1, 12, 0, 0);
            start = startOfYear(yearDate);
            end = endOfYear(yearDate);
        }

        return {
            startStr: format(start, "yyyy-MM-dd"),
            endStr: format(end, "yyyy-MM-dd"),
            displayStart: start,
            displayEnd: end
        };
    }, [view, selectedMonth, selectedQuarter, selectedYear]);

    const { orders, isLoading, isError } = useSalesStats(dateRange.startStr, dateRange.endStr);

    const waterfallData = useMemo(() => {
        if (!orders) return [];

        const steps = [
            { name: "Revenue", value: orders.totalRevenue, configKey: "revenue" },
            { name: "COGS", value: -orders.totalCost, configKey: "cogs" },
            { name: "Shipping", value: -orders.totalShipping, configKey: "shipping" },
            { name: "Ads", value: -orders.totalAdSpend, configKey: "ads" },
            { name: "Refunds", value: -(orders.totalRefunds || 0), configKey: "refunds" },
            { name: "Net Profit", value: orders.netProfit, configKey: "profit", isTotal: true },
        ];

        let runningTotal = 0;
        return steps.map((step) => {
            let low: number, high: number;

            if (step.isTotal) {
                low = 0;
                high = step.value;
            } else if (step.value >= 0) {
                low = runningTotal;
                high = runningTotal + step.value;
                runningTotal += step.value;
            } else {
                low = runningTotal + step.value;
                high = runningTotal;
                runningTotal += step.value;
            }

            return {
                name: step.name,
                displayValue: step.value,
                waterfallRange: [low, high],
                configKey: step.configKey,
            };
        });
    }, [orders]);

    const dailyMarginData = useMemo(() => {
        return orders?.daily || [];
    }, [orders]);

    const businessTargets = {
        targetFloor: 15,
        profitCeiling: 35,
    };

    return (
        <div className="space-y-6 pt-2">
            <div className="flex flex-col gap-4">
                <Tabs value={view} onValueChange={(v) => setView(v as ViewType)}>
                    <TabsList className="grid w-full grid-cols-3 h-11 bg-slate-100/50">
                        <TabsTrigger value="month">Month</TabsTrigger>
                        <TabsTrigger value="quarter">Quarter</TabsTrigger>
                        <TabsTrigger value="year">Year</TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="flex flex-wrap items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100 gap-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex gap-2">Analysis Period
                        <InfoTooltip display={true} comment="A chart showing how Revenue becomes Net Profit by subtracting COGS, Shipping, Ads, and Refunds in sequence." />

                    </span>

                    {view === "month" && <MonthPicker selectedDate={selectedMonth} onSelect={setSelectedMonth} />}
                    {view === "quarter" && <QuarterPicker selectedDate={selectedQuarter} onSelect={setSelectedQuarter} />}
                    {view === "year" && <YearPicker selectedYear={selectedYear} onSelect={setSelectedYear} />}
                </div>
            </div>

            <div className="h-full w-full">
                {isLoading ? (
                    <div className="h-full flex items-center justify-center text-slate-400 italic text-sm">
                        Crunching margins...
                    </div>
                ) : isError ? (
                    <div className="h-full flex items-center justify-center text-red-500 text-sm">
                        Error fetching data for this period.
                    </div>
                ) : (
                    <>
                        <div className="h-[350px]">
                            <NetProfitWaterfall data={waterfallData} config={chartConfig} />

                        </div>
                        <div className="text-center text-[11px] text-slate-400 italic">
                            {isLoading ? (
                                "Calculating breakdown..."
                            ) : (
                                <p>Viewing breakdown from {format(startOfMonth(selectedMonth), "MMM d")} to {format(endOfMonth(selectedMonth), "MMM d, yyyy")}</p>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                            <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                                <NetProfitEfficiencyChart data={dailyMarginData} floor={businessTargets.targetFloor} ceiling={businessTargets.profitCeiling} />
                            </div>
                        </div>
                    </>
                )}
            </div>


        </div>
    );
}

function MonthPicker({ selectedDate, onSelect }: { selectedDate: Date, onSelect: (d: Date) => void }) {
    const options = Array.from({ length: 12 }).map((_, i) => subMonths(startOfMonth(lastOrderDate), i));
    return (
        <Select value={selectedDate.toISOString()} onValueChange={(v) => onSelect(new Date(v))}>
            <SelectTrigger className="h-8 w-[140px] text-xs font-semibold bg-white">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {options.map((d) => (
                    <SelectItem key={d.toISOString()} value={d.toISOString()}>{format(d, "MMM yyyy")}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

function QuarterPicker({ selectedDate, onSelect }: { selectedDate: Date, onSelect: (d: Date) => void }) {
    return (
        <Select value={selectedDate.toISOString()} onValueChange={(v) => onSelect(new Date(v))}>
            <SelectTrigger className="h-8 w-[120px] text-xs font-semibold">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value={startOfQuarter(new Date(2026, 0, 1)).toISOString()}>Q1 2026</SelectItem>
                <SelectItem value={startOfQuarter(new Date(2025, 9, 1)).toISOString()}>Q4 2025</SelectItem>
                <SelectItem value={startOfQuarter(new Date(2025, 6, 1)).toISOString()}>Q3 2025</SelectItem>
            </SelectContent>
        </Select>
    );
}

function YearPicker({ selectedYear, onSelect }: { selectedYear: number, onSelect: (y: number) => void }) {
    return (
        <Select value={selectedYear.toString()} onValueChange={(v) => onSelect(parseInt(v))}>
            <SelectTrigger className="h-8 w-[100px] text-xs font-semibold">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="2026">2026</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
            </SelectContent>
        </Select>
    );
}