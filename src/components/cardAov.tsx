import { useState, useMemo } from "react";
import { lastOrderMonth } from "@/lib/utils";
import { useSalesStats } from "@/hooks/views";
import { startOfMonth, endOfMonth, subYears, format, getDate, parseISO } from "date-fns";
import { MonthSelect } from "./periodPicker";
import { InfoTooltip } from "./infoToolTip";

export default function AovCard() {

    const [selectedDate, setSelectedDate] = useState<Date>(() => startOfMonth(lastOrderMonth));

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

    if (loadingCurrent || loadingPrev) {
        return <div className="p-6 space-y-4">
            {/* skeleton */}
        </div>;
    };

    return (
        <div className="w-full">
            <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100 gap-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        Analysis Period
                    </span>
                    <MonthSelect value={selectedDate} onChange={setSelectedDate} />
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col lg:min-h-[250px]">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
                        <div>
                            <div className="flex gap-1 mb-6">
                                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                    AOV Pacing Analysis
                                </h3>
                                <InfoTooltip display comment="Comparing actual orders performance against targets" />
                            </div>
                            {/* <div className="flex items-baseline gap-2">
                                                <span className="text-3xl font-bold text-slate-900 tabular-nums">
                                                    {loadingCurrent ? "..." : (currentOrders?.totalOrders || 0).toLocaleString()}
                                                </span>
                                                <span className="text-xs font-semibold text-slate-400">
                                                    Total Orders
                                                </span>
                                            </div> */}
                        </div>

                        <div className="flex flex-col items-end gap-3 w-full sm:w-auto">
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
                        {/* Aov Pacing Chart */}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 md:p-6 rounded-2xl border border-slate-100 shadow-sm min-h-[100px] lg:h-[320px] flex flex-col">
                        <div className="flex gap-1 mb-6">
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                Order Value Bucket
                            </h3>
                            <InfoTooltip display comment="Displaying peak ordering hours grouped in time" />
                        </div>
                        {/* Order Value Bucket */}
                    </div>
                    <div className="bg-white p-6 md:p-6 rounded-2xl border border-slate-100 shadow-sm min-h-[100px]] lg:h-[320px] flex flex-col">
                        <div className="flex gap-1 mb-6">
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                Unit per transaction
                            </h3>
                            <InfoTooltip display comment="Displays the proportion of orders that are successful versus those with issues" />
                        </div>
                        {/* UPT chart */}
                    </div>
                </div>
            </div>
        </div>
    )
}