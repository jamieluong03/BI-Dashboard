import { useState } from "react";
import { lastOrderMonth } from "@/lib/utils";
import { startOfMonth, endOfMonth, subYears, format } from "date-fns";
import { MonthSelect } from "./periodPicker";
import { InfoTooltip } from "./infoToolTip";
import { useChannelInsights } from "@/hooks/views";
import { ProfitabilityChart } from "./channelRevenueMargin";


export default function SalesChannelCard() {

    const [selectedDate, setSelectedDate] = useState<Date>(() => startOfMonth(lastOrderMonth));

    const currentStart = startOfMonth(selectedDate);
    const currentEnd = endOfMonth(selectedDate);
    const prevStart = subYears(currentStart, 1);
    const prevEnd = endOfMonth(prevStart);

    const { channel_insights, isLoading } = useChannelInsights(selectedDate);
    console.log("Channel Insights:", channel_insights);

    return (
        <div className="w-full">
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
                                    Revenue vs. Margin By Channel
                                </h3>
                                <InfoTooltip display comment="Comparing actual orders performance against targets" />
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:h-full h-[125px]">
                        {/* Revenue vs. Margin By Channel */}
                        <ProfitabilityChart data={channel_insights?.profitabilityData || []} />
                        <div className="mt-4 pt-4 border-t border-slate-50">
                            <p className="text-[10px] text-slate-400 italic">
                                * Net Margin represents total revenue minus product costs and shipping expenses.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 md:p-6 rounded-2xl border border-slate-100 shadow-sm min-h-[100px] lg:h-[320px] flex flex-col">
                        <div className="flex gap-1 mb-6">
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                AOV By Channel
                            </h3>
                            <InfoTooltip display comment="Displaying peak ordering hours grouped in time" />
                        </div>
                        {/* AOV By Channel */}
                    </div>
                    <div className="bg-white p-6 md:p-6 rounded-2xl border border-slate-100 shadow-sm min-h-[100px]] lg:h-[320px] flex flex-col">
                        <div className="flex gap-1 mb-6">
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                First-Purchase Attribution
                            </h3>
                            <InfoTooltip display comment="Displays the proportion of orders that are successful versus those with issues" />
                        </div>
                        {/* First-Purchase Attribution */}
                    </div>
                </div>
            </div>
        </div>
    )
}