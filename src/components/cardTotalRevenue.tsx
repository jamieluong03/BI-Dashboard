import { useState, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RevenueComparisonChart } from "@/components/revenueComparisonChart";
import { useRevenueComparisonQuery } from "@/hooks/calculations";
import { startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, subQuarters, format, subMonths, setMonth, setYear } from "date-fns";
import { lastOrderDate } from "@/lib/utils";

type CompType = "mom" | "qoq" | "yoy";

export default function TotalRevenueCard() {
    const [activeTab, setActiveTab] = useState<CompType>("mom");

    // state for months
    const [momA, setMomA] = useState<Date>(() => startOfMonth(lastOrderDate));
    const [momB, setMomB] = useState<Date>(() => startOfMonth(subMonths(lastOrderDate, 1)));

    // state for quarters
    const [qoqA, setQoqA] = useState<Date>(() => startOfQuarter(lastOrderDate));
    const [qoqB, setQoqB] = useState<Date>(() => startOfQuarter(subQuarters(lastOrderDate, 1)));

    // state for years
    const [yoyMonth, setYoyMonth] = useState<number>(lastOrderDate.getMonth());
    const [yoyYearA, setYoyYearA] = useState<number>(2026);
    const [yoyYearB, setYoyYearB] = useState<number>(2025);

    const ranges = useMemo(() => {
        if (activeTab === "mom") {
            return {
                rangeA: { from: startOfMonth(momA), to: endOfMonth(momA) },
                rangeB: { from: startOfMonth(momB), to: endOfMonth(momB) }
            };
        }
        if (activeTab === "qoq") {
            return {
                rangeA: { from: startOfQuarter(qoqA), to: endOfQuarter(qoqA) },
                rangeB: { from: startOfQuarter(qoqB), to: endOfQuarter(qoqB) }
            };
        }

        const dateA = setYear(setMonth(lastOrderDate, yoyMonth), yoyYearA);
        const dateB = setYear(setMonth(lastOrderDate, yoyMonth), yoyYearB);
        return {
            rangeA: { from: startOfMonth(dateA), to: endOfMonth(dateA) },
            rangeB: { from: startOfMonth(dateB), to: endOfMonth(dateB) }
        };
    }, [activeTab, momA, momB, qoqA, qoqB, yoyMonth, yoyYearA, yoyYearB]);

    const { data, isLoading, isError, error } = useRevenueComparisonQuery(ranges.rangeA, ranges.rangeB);

    return (
        <div className="space-y-6 pt-2">
            <div className="flex flex-col gap-4">
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as CompType)}>
                    <TabsList className="grid w-full grid-cols-3 h-11 bg-slate-100/50">
                        <TabsTrigger value="mom">Month (MoM)</TabsTrigger>
                        <TabsTrigger value="qoq">Quarter (QoQ)</TabsTrigger>
                        <TabsTrigger value="yoy">Year (YoY)</TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="flex flex-wrap items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100 gap-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Comparison Periods</span>

                    <div className="flex items-center gap-3">
                        {activeTab === "mom" && (
                            <>
                                <MonthSelect value={momA} onChange={setMomA} />
                                <span className="text-xs font-bold text-slate-300">vs</span>
                                <MonthSelect value={momB} onChange={setMomB} />
                            </>
                        )}

                        {activeTab === "qoq" && (
                            <>
                                <QuarterSelect value={qoqA} onChange={setQoqA} />
                                <span className="text-xs font-bold text-slate-300">vs</span>
                                <QuarterSelect value={qoqB} onChange={setQoqB} />
                            </>
                        )}

                        {activeTab === "yoy" && (
                            <>
                                <MonthIndexSelect value={yoyMonth} onChange={setYoyMonth} />
                                <YearSelect value={yoyYearA} onChange={setYoyYearA} />
                                <span className="text-xs font-bold text-slate-300">vs</span>
                                <YearSelect value={yoyYearB} onChange={setYoyYearB} />
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 min-h-[300px] flex flex-col justify-center">
                {isLoading ? (
                    <div className="flex flex-col items-center gap-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="text-xs text-slate-400 font-medium">Loading...</p>
                    </div>
                ) : isError ? (
                    <div className="text-center space-y-2">
                        <p className="text-red-500 text-sm font-bold">Failed to load data</p>
                        <p className="text-[10px] text-slate-400 max-w-[200px] mx-auto">
                            {(error as any)?.message || "Unknown Database Error"}
                        </p>
                    </div>
                ) : (
                    <div className="bg-white border-slate-200 p-4 mt-4">
                        <RevenueComparisonChart
                            current={data?.current || []}
                            previous={data?.previous || []}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

function MonthSelect({ value, onChange }: { value: Date, onChange: (d: Date) => void }) {
    const months = Array.from({ length: 12 }).map((_, i) => subMonths(startOfMonth(lastOrderDate), i));
    return (
        <Select value={value.toISOString()} onValueChange={(v) => onChange(new Date(v))}>
            <SelectTrigger className="h-8 w-[130px] text-xs font-semibold bg-white">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {months.map((m) => (
                    <SelectItem key={m.toISOString()} value={m.toISOString()}>{format(m, "MMM yyyy")}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

function QuarterSelect({ value, onChange }: { value: Date, onChange: (d: Date) => void }) {
    return (
        <Select value={value.toISOString()} onValueChange={(v) => onChange(new Date(v))}>
            <SelectTrigger className="h-8 w-[110px] text-xs font-semibold bg-white">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value={startOfQuarter(new Date(2026, 0, 1)).toISOString()}>Q1 2026</SelectItem>
                <SelectItem value={startOfQuarter(new Date(2025, 9, 1)).toISOString()}>Q4 2025</SelectItem>
                <SelectItem value={startOfQuarter(new Date(2025, 6, 1)).toISOString()}>Q3 2025</SelectItem>
            </SelectContent>
        </Select>
    );
};

function MonthIndexSelect({ value, onChange }: { value: number, onChange: (v: number) => void }) {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return (
        <Select value={value.toString()} onValueChange={(v) => onChange(parseInt(v))}>
            <SelectTrigger className="h-8 w-[80px] text-xs font-semibold bg-white">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {monthNames.map((name, i) => (
                    <SelectItem key={name} value={i.toString()}>{name}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

function YearSelect({ value, onChange }: { value: number, onChange: (v: number) => void }) {
    return (
        <Select value={value.toString()} onValueChange={(v) => onChange(parseInt(v))}>
            <SelectTrigger className="h-8 w-[80px] text-xs font-semibold bg-white">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="2026">2026</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
            </SelectContent>
        </Select>
    );
};