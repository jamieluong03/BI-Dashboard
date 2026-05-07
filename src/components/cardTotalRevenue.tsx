import { useState, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RevenueComparisonChart } from "@/components/revenueComparisonChart";
import { useRevenueComparisonQuery } from "@/hooks/calculations";
import { startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, subQuarters, subMonths, setMonth, setYear } from "date-fns";
import { lastOrderDate } from "@/lib/utils";
import { MonthSelect, QuarterSelect, YearSelect, MonthIndexSelect } from "./periodPicker";
import { ViewType } from "@/types/dataTypes";
import { TotalRevenueSkeleton } from "./skeletons";

export default function TotalRevenueCard() {
    const [activeTab, setActiveTab] = useState<ViewType>("month");

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
        if (activeTab === "month") {
            return {
                rangeA: { from: startOfMonth(momA), to: endOfMonth(momA) },
                rangeB: { from: startOfMonth(momB), to: endOfMonth(momB) }
            };
        }
        if (activeTab === "quarter") {
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

    const { data, isLoading, isError } = useRevenueComparisonQuery(ranges.rangeA, ranges.rangeB);

    return (
        <div className="space-y-6 pt-2">
            <div className="flex flex-col gap-4">
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ViewType)}>
                    <TabsList className="grid w-full grid-cols-3 h-11 bg-slate-100/50">
                        <TabsTrigger value="month">Month (MoM)</TabsTrigger>
                        <TabsTrigger value="quarter">Quarter (QoQ)</TabsTrigger>
                        <TabsTrigger value="year">Year (YoY)</TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="flex flex-wrap items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100 gap-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Comparison Periods</span>

                    <div className="flex items-center gap-3">
                        {activeTab === "month" && (
                            <>
                                <MonthSelect value={momA} onChange={setMomA} />
                                <span className="text-xs font-bold text-slate-300">vs</span>
                                <MonthSelect value={momB} onChange={setMomB} />
                            </>
                        )}

                        {activeTab === "quarter" && (
                            <>
                                <QuarterSelect value={qoqA} onChange={setQoqA} />
                                <span className="text-xs font-bold text-slate-300">vs</span>
                                <QuarterSelect value={qoqB} onChange={setQoqB} />
                            </>
                        )}

                        {activeTab === "year" && (
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
                <div className="w-full">
                    {isLoading ? (
                        <TotalRevenueSkeleton />
                    ) : isError ? (
                        <div className="flex h-64 items-center justify-center text-red-500 text-sm bg-red-50 rounded-2xl border border-red-100">
                            Error fetching data for this range.
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
        </div>
    );
};

