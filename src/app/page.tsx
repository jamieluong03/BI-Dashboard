"use client";

import { useState, useMemo } from "react";
import { StatCard } from "@/components/statCard";
import { useBlendedROAS, useCLVStats, useSalesStats, useSalesChannelPerformance, useInventoryPerformance, useRegionalData } from "@/hooks/views";
import { ChartBarLabelCustom } from "@/components/customBarChart";
import { InventoryCard } from "@/components/inventoryCard";
import { ChartRadarDots } from "@/components/radarChart";
import { DashboardSkeleton } from "@/components/skeletons";
import { SelectDate } from "@/components/dateSelect";
import { getRangePresets, lastOrderDate } from "@/lib/utils";
import { DateRange } from "react-day-picker";


export default function Dashboard() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const preset = getRangePresets("last_30", lastOrderDate);
    return { from: new Date(preset.from), to: new Date(preset.to) };
  });

  const dateArgs = useMemo(() => {
    // if there's no full date range, don't update dashboard
    if (!dateRange?.from || !dateRange?.to) {
      return null;
    }

    return {
      from: dateRange.from.toISOString(),
      to: dateRange.to.toISOString()
    };
  }, [dateRange]);

  const defaultRange = getRangePresets("last_30");
  const activeFrom = dateArgs?.from ?? defaultRange.from;
  const activeTo = dateArgs?.to ?? defaultRange.to;

  const { data, isLoading: isRoasLoading, isError: isRoasError, error: roasError } = useBlendedROAS(activeFrom, activeTo);
  const { clv, isLoading: isCLVLoading, isError: isCLVError, error: clvError } = useCLVStats();
  const { orders, isLoading: isOrdersLoading, isError: isOrdersError, error: ordersError } = useSalesStats(activeFrom, activeTo);
  const { channels, isLoading: isChannelsLoading, isError: isChannelsError, error: channelsError } = useSalesChannelPerformance(activeFrom, activeTo);
  const { inventory, isLoading: isInventoryLoading, isError: isInventoryError, error: inventoryError } = useInventoryPerformance(activeFrom, activeTo);
  const { regions, isLoading: isRegionLoading, isError: isRegionError, error: regionError } = useRegionalData(activeFrom, activeTo);

  const isAnyDataLoading = isOrdersLoading || isRoasLoading || isCLVLoading || isChannelsLoading || isInventoryLoading || isRegionLoading;
  const hasAnyErrors = isOrdersError || isRoasError || isCLVError || isChannelsError || isInventoryError || isRegionError;
  const anyErrorMessage = ordersError?.message || roasError?.message || clvError?.message || channelsError?.message || inventoryError?.message || regionError?.message;

  const salesChannel = Object.keys(channels || {}).map(source => {
    return {
      name: channels[source].name === "Facebook and Instagram by Meta" ? "Facebook & Instagram" : channels[source].name,
      value: channels[source].orders
    }
  });

  const regionSales = Object.keys(regions || {}).map(name => {
    return {
      name: regions[name].name,
      value: regions[name].value
    }
  });

  const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-2 lg:py-2">
        <header className="mb-2 p-6 bg-slate-50 rounded-xl">
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4">Analytics Dashboard</h1>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <SelectDate range={dateRange} onRangeChange={setDateRange} />
          </div>
        </header>
        {isAnyDataLoading ? (
          <DashboardSkeleton />
        ) : hasAnyErrors ? (
          <div className="border-red-500 bg-red-50 p-4 rounded-lg">
            <h3 className="text-red-800 font-bold">Failed to load data</h3>

            <p className="text-red-600 text-sm">
              Reason: {anyErrorMessage}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 p-4 md:p-6 bg-slate-50 rounded-xl">
            <StatCard
              title="Total Revenue"
              value={formatter.format(orders?.totalRevenue || 0)}
              description="Steady high-ticket volume supported by premium product positioning."
              metric="total_revenue"
            />
            <StatCard
              title="Net Profit"
              value={formatter.format(orders?.netProfit || 0)}
              description="Healthy 42% bottom-line margin after all operating expenses."
              metric="net_profit"
            />
            <StatCard
              title="Total Orders"
              value={orders?.totalOrders || 0}
              description="Focus on CRO for high-intent traffic rather than just increasing raw ad spend."
              metric="total_orders"
            />
            <StatCard
              title="AOV"
              value={formatter.format(orders?.averageOrderValue || 0)}
              description="Strong customer willingness to invest in luxury price points."
              metric="aov"
            />
            <div className="col-span-2">
              <ChartBarLabelCustom
                dataKey="value"
                title="Sales By Channel"
                description="Click the bars to calculate total sales by channels"
                chartData={salesChannel}
                comment="Omnichannel success: Physical shop leads, followed closely by Google Search."
              />
            </div>
            <div className="col-span-2">
              <ChartRadarDots
                title="Sales By Region"
                description=""
                dataKey="value"
                chartData={regionSales}
                comment="Coastal dominance: CA and NY driving nearly 50% of total volume."
              />
            </div>
            <StatCard
              title="ROAS"
              value={`${(data?.roas.toFixed(2) || 0)}x`}
              description="Paid media is scaling efficiently; $4 returned for every $1 in ad spend."
              metric="roas"
            />
            <StatCard
              title="ROI"
              value={`${(orders?.returnOnInvestment.toFixed(2) || 0)}%`}
              description="Exceptional capital efficiency; for every $1 spent, $1.45 is returned in profit."
              metric="roi"
            />
            <StatCard
              title="Conversion Rate"
              value={(data?.conversionRate.toFixed(2) || 0)}
              description="Typical for high-AOV jewelry; focus on high-intent traffic to boost"
              metric="conversion_rate"
            />
            <StatCard
              title="CTR"
              value={(data?.clickThroughRate.toFixed(2) || 0)}
              description="Creative is resonating well, driving strong engagement across socials."
              metric="ctr"
            />
            <StatCard
              title="CLV"
              value={formatter.format(clv?.avgCLV || 0)}
              description="Significant long-term brand loyalty; customers return for repeat gifting."
              metric="clv"
            />
            <StatCard
              title="MER"
              value={`${(orders?.marketingEfficiencyRatio.toFixed(2) || 0)}x`}
              description="Total marketing spend is well-balanced against gross revenue."
              metric="mer"
            />
            <div className="col-span-2">
              <InventoryCard
                title="Inventory"
                inventoryValue={inventory?.inventoryValue.toFixed(2) || 0}
                sellThroughRate={inventory?.sellThroughRate.toFixed(2) || 0}
                lowStock={
                  (inventory?.lowStockCount ?? 0) > 0 ? `${inventory?.lowStockCount} items are low on stock` : "Stock levels are healthy"
                }
                description="Capital tied in stock; ensure high-value pieces are prioritized for ads. Extremely high turnover velocity; monitor stock-outs on core collections."
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}