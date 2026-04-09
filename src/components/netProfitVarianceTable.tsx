import React from "react";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface VarianceData {
  label: string;
  current: number;
  previous: number;
  isInverse?: boolean;
}

interface NetProfitVarianceTableProps {
  currentStats: any;
  previousStats: any;
  isLoading?: boolean;
}

export function NetProfitVarianceTable({ currentStats, previousStats, isLoading }: NetProfitVarianceTableProps) {
  
  const rows: VarianceData[] = [
    { label: "Revenue", current: currentStats?.totalRevenue, previous: previousStats?.totalRevenue },
    { label: "COGS", current: currentStats?.totalCost, previous: previousStats?.totalCost, isInverse: true },
    { label: "Shipping", current: currentStats?.totalShipping, previous: previousStats?.totalShipping, isInverse: true },
    { label: "Ad Spend", current: currentStats?.totalAdSpend, previous: previousStats?.totalAdSpend, isInverse: true },
    { label: "Refunds", current: currentStats?.totalRefunds || 0, previous: previousStats?.totalRefunds || 0, isInverse: true },
    { label: "Net Profit", current: currentStats?.netProfit, previous: previousStats?.netProfit },
  ];

  if (isLoading) return <div className="animate-pulse space-y-3 p-4">...</div>;

  return (
    <div className="w-full overflow-hidden">
      <table className="w-full text-left text-xs border-collapse">
        <thead className="bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          <tr>
            <th className="px-4 py-3">Metric</th>
            <th className="px-4 py-3 text-right">Current</th>
            <th className="px-4 py-3 text-right">Previous</th>
            <th className="px-4 py-3 text-right">Variance</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => (
            <VarianceRow key={row.label} {...row} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function VarianceRow({ label, current = 0, previous = 0, isInverse = false }: VarianceData) {
  const diff = current - previous;
  const percentChange = previous !== 0 ? (diff / Math.abs(previous)) * 100 : 0;
  
  const isPositiveChange = diff > 0;
  const isNeutral = diff === 0;
  const isGood = isInverse ? !isPositiveChange : isPositiveChange;

  return (
    <tr className="group hover:bg-slate-50/50 transition-colors">
      <td className="px-4 py-3 font-medium text-slate-700">{label}</td>
      <td className="px-4 py-3 text-right tabular-nums text-slate-600">
        {formatCurrency(current)}
      </td>
      <td className="px-4 py-3 text-right tabular-nums text-slate-400">
        {formatCurrency(previous)}
      </td>
      <td className={cn(
        "px-4 py-3 text-right tabular-nums font-semibold",
        isNeutral ? "text-slate-400" : isGood ? "text-emerald-600" : "text-rose-600"
      )}>
        <div className="flex items-center justify-end gap-1">
          <span>{percentChange > 0 ? "+" : ""}{percentChange.toFixed(1)}%</span>
          {isNeutral ? <Minus className="h-3 w-3" /> : 
           isPositiveChange ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />
          }
        </div>
      </td>
    </tr>
  );
}

const formatCurrency = (val: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);