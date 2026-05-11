import { useState } from "react";
import { lastOrderMonth } from "@/lib/utils";
import { startOfMonth } from "date-fns";
import { MonthSelect } from "./periodPicker";
import { InfoTooltip } from "./infoToolTip";
import { useRegionalInsight } from "@/hooks/views";
import {  } from "./skeletons";

export default function SalesChannelCard() {

    const [selectedDate, setSelectedDate] = useState<Date>(() => startOfMonth(lastOrderMonth));

    const { regions_insight, isLoading, isError } = useRegionalInsight(selectedDate);

    return (
        <div className="w-full">
            {isLoading ? (
                // skeleton
                <></>
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
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col lg:min-h-[100px]">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
                            <div>
                                <div className="flex gap-1 mb-6">
                                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                        Revenue vs. Volume By Region
                                    </h3>
                                    <InfoTooltip display comment="Visualizes the relationship between Gross Revenue and Net Margin, tracking the spread to ensure that scaling sales volume is translating into actual profitability." />
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:h-full h-[125px] flex-1 min-h-0">
                            {/* Revenue vs. Volume */}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white p-6 md:p-6 rounded-2xl border border-slate-100 shadow-sm min-h-[100px] lg:h-[320px] flex flex-col">
                            <div className="flex gap-1 mb-6">
                                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                    Logistics Efficiency
                                </h3>
                                <InfoTooltip display comment="Measures the average revenue generated per transaction across each sales channel, highlighting which platforms attract the highest-spending customers." />
                            </div>
                            {/* Logistics Efficiency */}
                            <div className="flex-1 min-h-0 w-full">
                            </div>
                        </div>
                        <div className="bg-white p-6 md:p-6 rounded-2xl border border-slate-100 shadow-sm min-h-[100px]] lg:h-[320px] flex flex-col">
                            <div className="flex gap-1 mb-6">
                                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                    Growth Index
                                </h3>
                                <InfoTooltip display comment="Analyzes marketing efficiency by channel, distinguishing between first-time customer acquisition and repeat purchase retention to optimize your media spend." />
                            </div>
                            {/* Growth Index */}
                            <div className="flex-1 min-h-0 w-full">
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}