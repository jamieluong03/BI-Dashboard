import { useState, useMemo } from "react";
import { InfoTooltip } from "./infoToolTip";
import { DashboardDateContext, InventoryModalProps } from "@/types/dataTypes";
import { useInventoryPerformance } from "@/hooks/views";
import { SelectDate } from "./dateSelect";
import CriticalReorderList from "./inventoryCriticalReorder";
import { differenceInDays } from "node_modules/date-fns/fp/differenceInDays.cjs";

export default function InventoryCardContent({ dateContext, isInventoryLoading }: InventoryModalProps) {

    const { inventory, isLoading, isError } = useInventoryPerformance(
        dateContext.activeFrom,
        dateContext.activeTo
    );
    console.log("Inventory:", inventory);

    const diffInDays = Math.max(1, differenceInDays(new Date(dateContext.activeTo), new Date(dateContext.activeFrom)));

    const criticalItems = useMemo(() => {
        if (!inventory?.allProducts) return [];

        return inventory.allProducts
            .filter((p: any) => p.stockLevel <= p.reorderPoint && p.stockLevel > 0)
            .map((p: any) => {
                const dailyVelocity = p.units_sold / diffInDays;
                const dailyRevenue = p.revenue / diffInDays;

                return {
                    id: p.id,
                    name: p.name,
                    stock: p.stockLevel,
                    daysLeft: dailyVelocity > 0 ? Math.round(p.stockLevel / dailyVelocity) : 99,
                    weeklyRisk: dailyRevenue * 7,
                    velocity: dailyVelocity
                };
            })
            .sort((a: any, b: any) => b.weeklyRisk - a.weeklyRisk)
            .slice(0, 5);
    }, [inventory, diffInDays]);
    console.log("Critical Items:", criticalItems);

    return (
        <div className="w-full">
            {isLoading ? (
                //skeleton
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
                        <SelectDate
                            range={dateContext.range}
                            onRangeChange={dateContext.onRangeChange}
                            preset={dateContext.preset}
                            onPresetChange={dateContext.onPresetChange}
                        />
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col lg:min-h-[100px]">
                        {/* Stockout Revenue Risk */}
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-2">
                            <div>
                                <div className="flex gap-1">
                                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                        Critical Reorder List
                                    </h3>
                                    <InfoTooltip display comment="Prioritizes restocking based on projected weekly revenue loss. These items drive your cash flow—don't let them hit zero." />
                                </div>
                                <p className="text-sm text-slate-500">Items with the highest financial impact on stockout.</p>
                            </div>

                            {/* Total Risk Summary Badge */}
                            <div className="bg-rose-50 border border-rose-100 px-4 py-2 rounded-xl">
                                <span className="block text-[9px] font-bold text-rose-400 uppercase tracking-tight">Total Weekly Revenue at Risk</span>
                                <span className="text-xl font-black text-rose-600">
                                    ${criticalItems.reduce((sum: number, i: any) => sum + i.weeklyRisk, 0).toLocaleString()}
                                </span>
                            </div>
                        </div>

                        <div className="w-full">
                            <CriticalReorderList items={criticalItems} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white p-6 md:p-6 rounded-2xl border border-slate-100 shadow-sm min-h-[100px] lg:h-[320px] flex flex-col">
                            <div className="flex gap-1 mb-6">
                                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                    Inventory Aging & Capital Liquidity
                                </h3>
                                <InfoTooltip display comment="Measures the average revenue generated per transaction across each sales channel, highlighting which platforms attract the highest-spending customers." />
                            </div>
                            {/* Inventory Aging & Capital Liquidity */}
                            <div className="flex-1 min-h-0 w-full">

                            </div>
                        </div>
                        <div className="bg-white p-6 md:p-6 rounded-2xl border border-slate-100 shadow-sm min-h-[100px]] lg:h-[320px] flex flex-col">
                            <div className="flex gap-1 mb-6">
                                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                    SKU Velocity vs Profitability
                                </h3>
                                <InfoTooltip display comment="Analyzes marketing efficiency by channel, distinguishing between first-time customer acquisition and repeat purchase retention to optimize your media spend." />
                            </div>
                            {/* SKU Velocity vs Profitability */}
                            <div className="flex-1 min-h-0 w-full">

                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}