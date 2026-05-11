import { useMemo, useState } from "react";
import { lastOrderMonth } from "@/lib/utils";
import { startOfMonth } from "date-fns";
import { MonthSelect } from "./periodPicker";
import { InfoTooltip } from "./infoToolTip";
import { useRegionalInsight } from "@/hooks/views";
import { RegionalContributionChart } from "./regionRevenueChart";
import {  } from "./skeletons";

export default function SalesChannelCard() {

    const [selectedDate, setSelectedDate] = useState<Date>(() => startOfMonth(lastOrderMonth));
    const { regions_insight, isLoading, isError } = useRegionalInsight(selectedDate);

    const revenueChartData = useMemo(() => {
        if (!regions_insight) return [];

        return Object.keys(regions_insight).map((region) => ({
            region: regions_insight[region].region,
            revenue: regions_insight[region].revenue,
            orders: regions_insight[region].orders
        }));
    }, [regions_insight]);

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
                                <div className="flex gap-1">
                                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                        Revenue vs. Volume By Region
                                    </h3>
                                    <InfoTooltip display comment="If a region's Volume bar is much longer than its Revenue bar relative to others, it signals a low-AOV market that might be taxing the warehouse without much financial payoff." />
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:h-full h-[125px] flex-1 min-h-0">
                            {/* Revenue vs. Volume */}
                            <RegionalContributionChart data={revenueChartData} />
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