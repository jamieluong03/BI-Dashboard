import { useState, useMemo } from "react";
import { useSalesStats } from "@/hooks/views";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
    startOfMonth, endOfMonth, 
    startOfQuarter, endOfQuarter, 
    startOfYear, endOfYear,
    format, subMonths, setYear 
} from "date-fns";
import { lastOrderDate } from "@/lib/utils";
import { type ChartConfig } from "@/components/ui/chart";
import { NetProfitWaterfall } from "@/components/netProfitWaterfall"; 

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

  // --- SELECTOR STATES (Anchored to lastOrderDate) ---
  const [selectedMonth, setSelectedMonth] = useState<Date>(() => startOfMonth(lastOrderDate));
  const [selectedQuarter, setSelectedQuarter] = useState<Date>(() => startOfQuarter(lastOrderDate));
  const [selectedYear, setSelectedYear] = useState<number>(lastOrderDate.getFullYear());

  // --- CALCULATE DATE RANGE ---
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
      const yearDate = setYear(new Date(), selectedYear);
      start = startOfYear(yearDate);
      end = endOfYear(yearDate);
    }

    return {
      start: format(start, "yyyy-MM-dd"),
      end: format(end, "yyyy-MM-dd")
    };
  }, [view, selectedMonth, selectedQuarter, selectedYear]);

  const { orders, isLoading, isError } = useSalesStats(dateRange.start, dateRange.end);

  // --- TRANSFORM DATA FOR WATERFALL ---
  const chartData = useMemo(() => {
    if (!orders) return [];
    const { totalRevenue: rev, totalCost: cost, totalShipping: ship, totalAdSpend: ad, totalRefunds: refund, netProfit: net } = orders;

    return [
      { name: "Revenue", base: 0, displayValue: rev, fill: chartConfig.revenue.color },
      { name: "COGS", base: rev - cost, displayValue: cost, fill: chartConfig.cogs.color },
      { name: "Shipping", base: (rev - cost) - ship, displayValue: ship, fill: chartConfig.shipping.color },
      { name: "Ad Spend", base: (rev - cost - ship) - ad, displayValue: ad, fill: chartConfig.ads.color },
      { name: "Refunds", base: (rev - cost - ship - ad) - refund, displayValue: refund, fill: chartConfig.refunds.color },
      { name: "Net Profit", base: 0, displayValue: net, fill: chartConfig.profit.color },
    ];
  }, [orders]);

  return (
    <div className="space-y-6">
      {/* 1. SELECTORS SECTION */}
      <div className="flex flex-col gap-4">
        <Tabs value={view} onValueChange={(v) => setView(v as ViewType)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="quarter">Quarter</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Timeframe</span>
          
          {view === "month" && <MonthPicker selectedDate={selectedMonth} onSelect={setSelectedMonth} />}
          {view === "quarter" && <QuarterPicker selectedDate={selectedQuarter} onSelect={setSelectedQuarter} />}
          {view === "year" && <YearPicker selectedYear={selectedYear} onSelect={setSelectedYear} />}
        </div>
      </div>

      {/* 2. CHART SECTION */}
      <div className="h-[400px] w-full">
        {isLoading ? (
          <div className="h-full flex items-center justify-center text-slate-400 italic text-sm">
            Crunching margins...
          </div>
        ) : isError ? (
          <div className="h-full flex items-center justify-center text-red-500 text-sm">
            Error fetching data for this period.
          </div>
        ) : (
          <NetProfitWaterfall data={chartData} config={chartConfig} />
        )}
      </div>

      <div className="text-center text-[11px] text-slate-400 italic">
        Viewing breakdown from {format(new Date(dateRange.start), "MMM d")} to {format(new Date(dateRange.end), "MMM d, yyyy")}
      </div>
    </div>
  );
}

// --- SUB-PICKER COMPONENTS ---

function MonthPicker({ selectedDate, onSelect }: { selectedDate: Date, onSelect: (d: Date) => void }) {
  const options = Array.from({ length: 12 }).map((_, i) => subMonths(startOfMonth(lastOrderDate), i));
  return (
    <Select value={selectedDate.toISOString()} onValueChange={(v) => onSelect(new Date(v))}>
      <SelectTrigger className="h-8 w-[140px] text-xs font-semibold">
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
        {/* Dynamic Qs based on your data anchor (2026) */}
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