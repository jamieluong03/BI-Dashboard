import { useState, useMemo } from "react";
import { useOrderDistribution, useSalesStats, useOrderFulfillment } from "@/hooks/views";
import { startOfMonth, endOfMonth, subYears, format, getDate, parseISO } from "date-fns";
import { lastOrderMonth } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { TotalOrdersChart } from "./totalOrdersPacingChart";
import { MonthSelect } from "./periodPicker";
import { TotalOrdersPeaks } from "./totalOrdersPeakBars";
import { TotalOrdersFulfillment } from "./TotalOrdersFulfillmentChart";

export default function TotalOrdersCard() {

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

    const { distribution: ordersDistribution, isLoading: loadingSurge } = useOrderDistribution(
        format(currentStart, "yyyy-MM-dd"),
        format(currentEnd, "yyyy-MM-dd")
    );

    const { fulfillment: ordersFulfillment, isLoading: loadingFulfillment } = useOrderFulfillment(
        format(currentStart, "yyyy-MM-dd"),
        format(currentEnd, "yyyy-MM-dd")
    );

    const pacingData = useMemo(() => {
        if (!currentOrders?.daily && !previousOrders?.daily) return [];
        return Array.from({ length: 31 }, (_, i) => {
            const dayNum = i + 1;
            const curDay = currentOrders?.daily?.find((d: any) => getDate(parseISO(d.date)) === dayNum);
            const prevDay = previousOrders?.daily?.find((d: any) => getDate(parseISO(d.date)) === dayNum);

            return {
                day: dayNum,
                current: curDay?.totalOrders ?? curDay?.totalOrders ?? 0,
                previous: prevDay?.totalOrders ?? prevDay?.totalOrders ?? 0,
            };
        });
    }, [currentOrders, previousOrders]);

    if (loadingCurrent || loadingPrev || loadingSurge || loadingFulfillment) {
        return <div className="p-6 space-y-4"><Skeleton className="h-[300px] w-full rounded-xl" /></div>;
    }

    return (
        <div className="w-full">
            <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-center md:justify-between bg-slate-50 p-3 rounded-lg border border-slate-100 gap-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        Analysis Period
                    </span>
                    <MonthSelect value={selectedDate} onChange={setSelectedDate} />
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col lg:min-h-[250px]">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
                        <div>
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                Order Pacing Analysis
                            </h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-slate-900 tabular-nums">
                                    {loadingCurrent ? "..." : (currentOrders?.totalOrders || 0).toLocaleString()}
                                </span>
                                <span className="text-xs font-semibold text-slate-400">
                                    Total Orders
                                </span>
                            </div>
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
                        <TotalOrdersChart data={pacingData} />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white pt-6 px-2 md:p-6 rounded-2xl border border-slate-100 shadow-sm min-h-[300px] lg:h-[320px] flex flex-col">
                        <TotalOrdersPeaks data={ordersDistribution || []} />
                    </div>
                    <div className="bg-white pt-6 px-2 md:p-6 rounded-2xl border border-slate-100 shadow-sm min-h-[300px] lg:h-[320px] flex flex-col">
                        <TotalOrdersFulfillment data={ordersFulfillment || []} />
                    </div>
                </div>
            </div>
        </div>
    );
}