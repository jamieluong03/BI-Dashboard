import { useState } from "react";
import { lastOrderMonth } from "@/lib/utils";
import { useAovInsights } from "@/hooks/views";
import { startOfMonth, subYears, format } from "date-fns";
import { MonthSelect } from "./periodPicker";
import { InfoTooltip } from "./infoToolTip";
import AovPacingChart from "./aovPacingChart";
import AovHistogram from "./aovHistogram";
import { UptChart } from "./aovUptChart";
import { AovSkeleton } from "./skeletons";

export default function AovCard() {

    const [selectedDate, setSelectedDate] = useState<Date>(() => startOfMonth(lastOrderMonth));

    const currentStart = startOfMonth(selectedDate);
    const prevStart = subYears(currentStart, 1);

    const { aov_insights, isLoading, isError } = useAovInsights(selectedDate);

    return (
        <div className="w-full">
            {isLoading ? (
                <AovSkeleton />
            ) : isError ? (
                <div className="flex h-64 items-center justify-center text-red-500 text-sm bg-red-50 rounded-2xl border border-red-100">
                    Error fetching data for this range.
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100 gap-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            Analysis Period
                        </span>
                        <MonthSelect value={selectedDate} onChange={setSelectedDate} />
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col lg:min-h-[250px]">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 md:mb-8">
                            <div>
                                <div className="flex gap-1 md:mb-6">
                                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                        AOV Pacing Analysis
                                    </h3>
                                    <InfoTooltip display comment="Comparing actual orders performance against targets" />
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-3 w-full sm:w-auto">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5">
                                        <div className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                                        <span className="text-[9px] font-bold text-slate-400 uppercase">{format(currentStart, 'yyyy')}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="h-1.5 w-1.5 rounded-full border border-dashed border-slate-400" />
                                        <span className="text-[9px] font-bold text-slate-400 uppercase">{format(prevStart, 'yyyy')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:h-full h-[200px]">
                            {/* Aov Pacing Chart */}
                            <AovPacingChart data={aov_insights?.pacingData || []} selectedDate={selectedDate} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white p-6 md:p-6 rounded-2xl border border-slate-100 shadow-sm min-h-[100px] lg:h-[320px] flex flex-col">
                            <div className="flex gap-1 mb-6">
                                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                    Order Value Distribution
                                </h3>
                                <InfoTooltip display comment="Displaying peak ordering hours grouped in time" />
                            </div>
                            {/* Order Value Bucket */}
                            <AovHistogram data={aov_insights?.bucketData || []} />
                        </div>
                        <div className="bg-white p-6 md:p-6 rounded-2xl border border-slate-100 shadow-sm min-h-[100px]] lg:h-[320px] flex flex-col">
                            <div className="flex gap-1 mb-6">
                                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                    Unit per transaction (UPT)
                                </h3>
                                <InfoTooltip display comment="Displays the proportion of orders that are successful versus those with issues" />
                            </div>
                            {/* UPT chart */}
                            <UptChart value={aov_insights?.upt || 0} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}