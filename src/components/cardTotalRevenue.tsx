import { useState, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RevenueComparisonChart } from "@/components/revenueComparisonChart";
import { useRevenueComparisonQuery } from "@/hooks/calculations";
import { startOfMonth, endOfMonth, subMonths, subQuarters, subYears, format } from "date-fns";

type CompType = "mom" | "qoq" | "yoy";

export default function TotalRevenueCard() {

  const [activeTab, setActiveTab] = useState<CompType>("mom");
  const [selectedMonth, setSelectedMonth] = useState<Date>(() => startOfMonth(new Date()));

  const rangeA = useMemo(() => ({
    from: startOfMonth(selectedMonth),
    to: endOfMonth(selectedMonth)
  }), [selectedMonth]);

  const rangeB = useMemo(() => {
    if (activeTab === "mom") return { from: subMonths(rangeA.from, 1), to: subMonths(rangeA.to, 1) };
    if (activeTab === "qoq") return { from: subQuarters(rangeA.from, 1), to: subQuarters(rangeA.to, 1) };
    return { from: subYears(rangeA.from, 1), to: subYears(rangeA.to, 1) };
  }, [rangeA, activeTab]);

  const { data, isLoading, isError } = useRevenueComparisonQuery(rangeA, rangeB);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        {/* Comparison Type Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as CompType)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="mom">Month</TabsTrigger>
            <TabsTrigger value="qoq">Quarter</TabsTrigger>
            <TabsTrigger value="yoy">Year</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Internal Date Selector */}
        <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
          <span className="text-xs font-bold text-slate-500 uppercase">Analyzing</span>
          <MonthPicker selectedDate={selectedMonth} onSelect={setSelectedMonth} />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 min-h-[300px] flex flex-col justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center gap-2">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
             <p className="text-xs text-slate-400">Loading comparison...</p>
          </div>
        ) : isError ? (
          <p className="text-center text-red-500 text-sm">Failed to load data.</p>
        ) : (
          <RevenueComparisonChart 
            current={data?.current || []} 
            previous={data?.previous || []} 
          />
        )}
      </div>

      {/* Dynamic Summary */}
      {!isLoading && data && (
        <div className="text-[11px] text-slate-400 text-center italic">
          Comparing {format(rangeA.from, "MMM yyyy")} vs. {format(rangeB.from, "MMM yyyy")}
        </div>
      )}
    </div>
  );
}

// Sub-component for the month selection dropdown
function MonthPicker({ selectedDate, onSelect }: { selectedDate: Date, onSelect: (d: Date) => void }) {
  // Generate last 6 months as options
  const options = Array.from({ length: 6 }).map((_, i) => subMonths(startOfMonth(new Date()), i));

  return (
    <Select 
      value={selectedDate.toISOString()} 
      onValueChange={(val) => onSelect(new Date(val))}
    >
      <SelectTrigger className="w-[160px] h-9 font-semibold text-sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((date) => (
          <SelectItem key={date.toISOString()} value={date.toISOString()}>
            {format(date, "MMMM yyyy")}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}